## Context

Phase 1 established the project foundation (Astro + React + Tailwind v4 + PWA), design tokens, layout, and page routing. This phase builds the core user flow: invitation code entry (Access Control), route protection (AuthGuard), instructions screen, API layer, and PWA infrastructure components (iOS banner, offline indicator).

## Goals / Non-Goals

### Goals
- Implement the complete authentication gate flow (enter code → validate → access app)
- Protect `/instructions`, `/scanner`, `/report` routes from unauthenticated access
- Provide typed API communication with dummy data fallback for development
- Deliver the Instructional Home content screen
- Add iOS install prompt and offline indicator to the base layout

### Non-Goals
- Camera access and frame extraction (deferred to Phase 3)
- AI analysis and safety report (deferred to Phase 4)
- PWA update prompt (deferred to Phase 5)

## Decisions

### Route Protection via AuthGuard

- **Decision:** Use a React `<AuthGuard>` component wrapping protected page content to prevent unauthenticated direct URL access. `AuthGuard` reads `isValid` from `useHydratedSessionStore` and calls `navigate('/', { history: 'replace' })` if `isValid !== true`. During Zustand persist hydration, a loading spinner is shown to prevent a flash of protected content.
- **Alternatives considered:** Astro middleware (cannot read client-side localStorage), per-page `useEffect` redirect checks (duplicated logic), `beforeload` Astro transition event (no access to React state)
- **Rationale:** AuthGuard is a single reusable component that encapsulates the redirect logic and hydration guard. Each protected Astro page wraps its content with `<AuthGuard client:load>`. Using `history: 'replace'` prevents back-navigation to the protected route after redirect.

```tsx
// src/components/molecules/AuthGuard.tsx
import { type ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { useHydratedSessionStore } from '@/stores/use-session-store';
import { Spinner } from '@/components/atoms/Spinner';

interface AuthGuardProps { children: ReactNode }

export function AuthGuard({ children }: AuthGuardProps) {
  const { isValid } = useHydratedSessionStore();

  if (isValid === null) return <Spinner />;
  if (isValid !== true) {
    navigate('/', { history: 'replace' });
    return <Spinner />;
  }

  return <>{children}</>;
}
```

### Zustand for State Management

- **Decision:** Use Zustand with domain-specific stores: `use-session-store` (persisted), `use-scan-store` (persisted). All persisted stores use `skipHydration: true` for Astro SSR compatibility and manual rehydration in React islands.
- **Alternatives considered:** Direct localStorage utilities, Redux, Context API, Jotai, Nanostores
- **Rationale:** Zustand provides zero-boilerplate state management. Multiple small stores prevent unrelated re-renders. `persist` middleware handles localStorage serialization automatically. `skipHydration` prevents SSR/hydration mismatches in Astro islands. `devtools` middleware enables Redux DevTools debugging.

### Native Fetch for API Calls

- **Decision:** Use the browser's native `fetch` API typed with `safeFetch<T>()`, `AbortSignal.timeout()` for timeouts, `FetchError` class with error categories, retry with exponential backoff + jitter for transient errors only
- **Alternatives considered:** Axios, ky, got
- **Rationale:** Zero additional bundle size. `AbortSignal.timeout()` is native in modern browsers. Typed wrapper ensures type safety. Runtime validation of AI responses with `parseSafetyReport()` fallback.

```ts
// src/lib/api/client.ts
class FetchError extends Error {
  constructor(
    public type: 'network' | 'timeout' | 'http' | 'parse' | 'abort',
    message: string,
    public status?: number,
  ) { super(message); this.name = 'FetchError'; }
}

async function safeFetch<T>(url: string, options: RequestInit, timeoutMs = 30_000): Promise<T> {
  const signal = options.signal
    ? AbortSignal.any([options.signal, AbortSignal.timeout(timeoutMs)])
    : AbortSignal.timeout(timeoutMs);
  // ... error classification, JSON parse, runtime validation
}
```

### API Layer Structure (Dummy Data During Development)

- **Decision:** Separate API files in `src/lib/api/`: `client.ts` (fetch wrapper), `validate-code.ts`, `analyze-frames.ts`, `types.ts`. Each method returns dummy data during development until the n8n webhooks are available.
- **Rationale:** Frontend development proceeds independently of backend. Switching from dummy data to real API calls requires changing only the implementation, not the interface.

```ts
// src/lib/api/validate-code.ts
import type { ValidateCodeResponse } from './types';
import { safeFetch } from './client';

const USE_DUMMY = !import.meta.env.PUBLIC_N8N_BASE_URL;

export async function validateCode(code: string): Promise<ValidateCodeResponse> {
  if (USE_DUMMY) {
    await new Promise(r => setTimeout(r, 800));
    return { valid: code.length >= 4 };
  }
  return safeFetch<ValidateCodeResponse>(
    `${import.meta.env.PUBLIC_N8N_BASE_URL}/webhook/validate-code`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) },
    30_000,
  );
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Zustand persist hydration mismatch in Astro islands | `skipHydration: true` + manual rehydration in `useEffect` + `useHydratedStore` guards |
| AuthGuard flash of redirect on valid sessions during hydration | Spinner shown during hydration, redirect only after hydration resolves |
| invitation code security is minimal (static codes) | Acceptable for MVP; codes rotate by updating n8n Static Data |
| `navigate()` from `astro:transitions/client` requires `ClientRouter` | `ClientRouter` is included in `Layout.astro` from Phase 1 |

## Open Questions

- What is the n8n webhook URL format? (Will be configured via `PUBLIC_N8N_BASE_URL` environment variable)