# Change: Fix Access Control Hydration Bugs

## Why
The Access Control form (CodeForm component) has multiple bugs related to Zustand store hydration handling that cause the "Verify Code" button to sometimes be disabled after the user types an invitation code:

1. **Primary Bug**: `CodeForm` uses `useSessionStore()` directly instead of the hydration-safe `useHydratedSessionStore()` hook, causing the component to render with stale or inconsistent state when navigating between pages via Astro View Transitions.

2. **Secondary Bug**: The `validateCodeAction` doesn't set `isValid` to `false` in its catch block, leaving `isValid` at `null` or its previous value after network errors, causing semantic inconsistencies.

3. **Tertiary Bug**: No double-submit protection - users can click the submit button multiple times rapidly, potentially triggering duplicate validation requests.

4. **Performance Bug**: Using `useSessionStore()` without a selector subscribes to ALL state changes, causing unnecessary re-renders on every keystroke when `handleInputChange` calls `useSessionStore.setState({ error: null })`.

## What Changes
- Modify `CodeForm` component to use `useHydratedSessionStore()` instead of `useSessionStore()` directly
- Update `validateCodeAction` catch block to explicitly set `isValid: false` after network errors
- Add guard in `handleSubmit` to prevent concurrent validation requests when `isValidating` is already true
- Optionally optimize `handleInputChange` to only call store update when `error` is truthy

## Impact
- Affected specs: `access-control`
- Affected code: `src/components/molecules/CodeForm.tsx`, `src/stores/use-session-store.ts`
- Breaking: No - these are bug fixes that restore intended behavior