## Context

The `safeFetch()` wrapper in `src/lib/api/client.ts` is the sole HTTP client for all backend communication (invitation code validation, frame submission for AI analysis). It currently uses `AbortSignal.any()` (line 18) to combine an optional external abort signal with `AbortSignal.timeout()` for automatic timeout. Both static methods are modern additions:

| API | Minimum iOS | iPhone floor |
|-----|-------------|--------------|
| `AbortSignal.any()` | 16.4 | iPhone 8 (if on iOS 16.4+) but not iPhone 11 on iOS 14-16.3 |
| `AbortSignal.timeout()` | 15.6 | iPhone 6s (if on iOS 15.6+) but not older OS versions |
| `AbortController` (basic) | 12.2 | iPhone 5s+ |

The bug manifests as `"AbortSignal.any is not a function"` on the scanner page when `submitFrames` calls `safeFetch` with a user-cancellation signal. The fix must cover both static methods since `AbortSignal.timeout()` has the same class of problem on slightly older devices.

## Goals / Non-Goals

**Goals:**
- Eliminate all `AbortSignal.any()` and `AbortSignal.timeout()` calls from the production code path
- Preserve exact error contract: `FetchError('timeout')` for timeouts, `FetchError('abort')` for user-cancelled requests
- Preserve retry behavior in `safeFetch()` — timeouts remain retriable, aborts do not
- Preserve external signal forwarding from `useAnalysis.ts` (user taps "Cancel")
- Preserve all timeout durations (30s for validation, 60s for analysis)
- Zero new runtime dependencies
- Cover iOS 12.2+ (all iPhones that support the app's core `getUserMedia` requirement)

**Non-Goals:**
- Changing any caller signatures or types
- Adding a general polyfill layer for the project
- Modifying retry logic, error classification, or timeout values
- Addressing non-`safeFetch` compatibility issues (e.g., camera API differences)

## Decisions

### Decision 1: Manual `AbortController` + `setTimeout` over polyfill

**Chosen approach:** Rewrite the signal+timeout logic inline using basic `AbortController` and `setTimeout`/`clearTimeout`.

**Alternatives considered:**

| Approach | Pro | Con |
|----------|-----|-----|
| Manual `AbortController` + `setTimeout` | Works iOS 12.2+, zero deps, no extra bundle bytes | Slightly more verbose (15 lines vs 1) |
| Polyfill `AbortSignal.any()` on prototype | Keeps consumer code clean | Mutates global; still need to handle `AbortSignal.timeout` separately |
| `@vitejs/plugin-legacy` + core-js | Handles all API gaps at once | 10-30KB legacy bundle, extra dependency, overkill for one API |

**Rationale:** The manual approach is the simplest change that covers widest compatibility with zero ongoing cost. A polyfill approach would still need the same underlying logic plus global mutation concerns. The legacy plugin is disproportionate for a single missing API.

### Decision 2: Use `options.signal` listener instead of passing through

The original code passes a *combined* signal to `fetch()`:
```
AbortSignal.any([options.signal, AbortSignal.timeout(N)])
```

Our replacement creates a fresh `AbortController` per request and wires both the external signal and the timeout to abort it:
```
controller = new AbortController()
setTimeout → controller.abort(DOMException('TimeoutError'))
options.signal.addEventListener('abort') → clearTimeout + controller.abort(reason)
fetch(url, { ...options, signal: controller.signal })
```

**Rationale:** This is the idiomatic pre-`AbortSignal.any()` pattern. The key detail is that the listener is registered with `{ once: true }` so it auto-deregisters after firing. For the lifecycle of this app's signals (tied to `AbortController` refs that get nulled in `finally` blocks), there is no practical leak.

### Decision 3: Handle pre-aborted external signal as fast-fail

If `options.signal.aborted` is already `true` when `attemptFetch` runs (race condition), we clear the timeout and immediately abort the new controller with the same reason, causing `fetch` to reject synchronously.

**Rationale:** Matches `AbortSignal.any()` behavior where a pre-aborted signal causes immediate rejection.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| `signal.reason` is `undefined` on iOS < 15.4 | The error handler checks `err.name === 'AbortError'`, not `reason`. Passing `undefined` to `controller.abort()` still produces a `DOMException` with `name: 'AbortError'`. No behavioral change. |
| Memory leak from listener not removed on clean fetch | The listener is on `options.signal`, not a global. The signal object is GC'd when its `AbortController` goes out of scope (ref nulled in `useAnalysis`'s `finally` block). For this app's request lifecycle, the listener lives at most a few seconds. |
| Timer fires after fetch completes (race before `clearTimeout`) | `clearTimeout` is called in the `finally` block of the try/catch. If the timeout fires *during* the `clearTimeout` call, `controller.abort()` is a no-op on an already-settled fetch. No unhandled rejection. |
| Regression: different `abort()` reason shape | The `AbortSignal.timeout()` spec creates a `TimeoutError` DOMException automatically. Our `setTimeout` callback explicitly does `controller.abort(new DOMException('TimeoutError', 'TimeoutError'))`. The `err.name` check on line 25 matches `'TimeoutError'` — this is preserved. |
