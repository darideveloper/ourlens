## Context
The CodeForm component on the Access Control page (`/`) validates user invitation codes. It interacts with the Zustand session store which uses `skipHydration: true` to defer localStorage hydration.

The current implementation has several issues that can cause the submit button to remain disabled or behave unexpectedly.

## Goals / Non-Goals
- Goals: Fix the button being disabled after typing, ensure consistent state handling, add double-submit protection
- Non-Goals: Refactor the entire state management, add new validation logic, change the API contract

## Decisions
- Decision: Use `useHydratedSessionStore()` in CodeForm
- Rationale: This hook properly waits for hydration before returning state, and converts `isValid: null` to `isValid: false` for semantic correctness. The index page currently bypasses this safeguard by using `useSessionStore()` directly.

- Decision: Set `isValid: false` in catch block
- Rationale: After a network error, the user is in an "unauthenticated" state that should be explicit. Leaving `isValid` as `null` or `true` is semantically wrong and can cause subtle bugs.

- Decision: Add guard for concurrent validation
- Rationale: The submit button is already disabled during validation via the `disabled={isValidating}` attribute, but users can still trigger validation via keyboard (Enter) or potentially via double-click on rapid connections. Adding an explicit guard prevents any edge cases.

- Decision: Only update error in store when error exists
- Rationale: The current `handleInputChange` always calls `setState({ error: null })` even when there's no error. This triggers a store update on every keystroke, causing unnecessary re-renders since the component subscribes to all state changes.

## Risks / Trade-offs
- Risk: Changing from `useSessionStore()` to `useHydratedSessionStore()` could cause a slight delay on initial render
- Mitigation: The hydration hook returns default values (`code: '', isValid: null`) until hydration completes, which matches the current behavior. The component will simply wait for the brief hydration to complete before returning real data.

## Migration Plan
- No migration needed - this is a bug fix for the existing flow
- Full page reload resets the store to defaults, so no persisted state conflict

## Open Questions
- None - the changes are straightforward bug fixes