## Context

The app currently has a linear access-control flow: user enters an invite code, the code is validated against an n8n backend (or a dummy local check in dev), and if valid the user proceeds through `/instructions` → `/scanner` → `/report`. There is no consent step. Session state is managed via a Zustand store persisted to localStorage, and protected routes are guarded by the `AuthGuard` component which checks `isValid`.

The T&C checkbox needs to integrate into this existing flow with minimal disruption — no new dependencies, no backend re-architecture, and no complex state management changes.

## Goals / Non-Goals

**Goals:**
- Add a mandatory consent checkbox to the CodeForm on `/`
- Persist consent state alongside session data in localStorage
- Disable form submission until checkbox is checked
- Gate protected routes on both `isValid` AND `termsAccepted`
- Link "terms & conditions" to `https://ourlivesapp.com/our-lens-terms-and-conditions/` (external, new tab)

**Non-Goals:**
- Not building a full legal-document management system
- Not adding account registration or user profiles
- Not modifying the n8n backend
- Not retroactively requiring consent from existing sessions (they'll be prompted on next visit)
- Not hosting legal pages in-app — the T&C are external

## Decisions

### 1. Consent stored in existing session store (not a separate store)
Consent is part of the user's session lifecycle, so it belongs in `use-session-store.ts`. A separate store would add unnecessary complexity — they hydrate together, persist together, and reset together.

### 2. Consent checked alongside isValid in AuthGuard
The `AuthGuard` component already gates protected routes. Adding a `termsAccepted` check there is the simplest, most consistent approach — every protected route automatically enforces consent without per-page changes.

### 3. T&C is an external link (not in-app page)
The terms URL is `https://ourlivesapp.com/our-lens-terms-and-conditions/` and opens in a new tab. No in-app legal pages are needed — this keeps content maintenance separate and avoids duplicating legal docs.

### 4. Checkbox uses existing design patterns
The checkbox follows Tailwind classes already used in the codebase (`.rounded-accessible`, `.min-h-tap`, etc.). No new component is extracted — the checkbox is inlined in `CodeForm.tsx` since it's tightly coupled to the form's submit logic.

## Flow Diagram

```
┌──────────────────────────────────────────────┐
│              UPDATED ACCESS FLOW             │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────┐            │
│  │         / (index.astro)      │            │
│  │  ┌────────────────────────┐  │            │
│  │  │     AccessControl      │  │            │
│  │  │  ┌──────────────────┐  │  │            │
│  │  │  │     CodeForm      │  │  │            │
│  │  │  │                  │  │  │            │
│  │  │  │ [code input]     │  │  │            │
│  │  │  │ ☐ By using Ourlens│  │  │            │
│  │  │  │   you confirm... │  │  │            │
│  │  │  │ [Verify Code]    │  │  │            │
│  │  │  │  (disabled if    │  │  │            │
│  │  │  │   !code || !tc)  │  │  │            │
│  │  │  └────────┬─────────┘  │  │            │
│  │  └───────────┼────────────┘  │            │
│  └──────────────┼───────────────┘            │
│                 │                            │
│          ┌──────┴──────┐                     │
│          ▼              ▼                    │
│       valid          invalid                 │
│          │              │                    │
│          ▼              ▼                    │
│  ┌──────────────┐ ┌──────────┐              │
│  │ /instructions│ │ show err │              │
│  │ /scanner     │ │ (stay /) │              │
│  │ /report      │ └──────────┘              │
│  │ (AuthGuard   │                           │
│  │  checks both │                           │
│  │  isValid AND │                           │
│  │  termsAccept)│                           │
│  └──────────────┘                           │
│                                              │
│  T&C link → ourlivesapp.com (new tab)        │
└──────────────────────────────────────────────┘
```

## Data Model Changes

### Session Store (`use-session-store.ts`)

```
interface SessionState {
  code: string;
  isValidating: boolean;
  isValid: boolean | null;
  termsAccepted: boolean;        // NEW
  error: string | null;
  validateCodeAction: (code: string) => Promise<void>;
  setTermsAccepted: (accepted: boolean) => void;  // NEW
  reset: () => void;
}
```

Persisted fields (`partialize`): `code`, `isValid`, `termsAccepted`

Hydration logic: on rehydrate, if `termsAccepted` is `undefined`, set to `false`.

## Risks / Trade-offs

- **[Risk] Existing users with valid codes but no consent** — Their `termsAccepted` will be `undefined` (falsy), so they'll be prompted to consent on next visit. This is correct behavior — we don't silently grandfather them in.
- **[Risk] User clears localStorage** — Consent is lost. The user re-enters their code and re-accepts. Acceptable — same as any other session loss.
- **[Tradeoff] Checkbox on first screen increases friction** — The A/B test here is legal safety vs. conversion. Given this is an invite-only app, the legal safety wins.

## Open Questions

- *(none — T&C URL provided, label text provided, no in-app pages needed)*
