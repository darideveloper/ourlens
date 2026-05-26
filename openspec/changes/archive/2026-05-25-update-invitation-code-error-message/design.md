## Context

The Ourlens application uses a Zustand store (`use-session-store.ts`) to manage the invitation code validation state. When a code is invalid, a hardcoded error message is displayed to the user. The current message does not account for the possibility that a code has expired, which is a common scenario for invitation-based access.

## Goals / Non-Goals

**Goals:**
- Provide more specific feedback to users when an invitation code fails validation.
- Maintain consistency with the recently adopted UK English spelling ("recognised").

**Non-Goals:**
- Changes to the API response structure.
- Implementation of dynamic error messages from the backend.

## Decisions

### Update Hardcoded Error String
- **Decision**: Directly update the `error` string literal in the `validateCodeAction` method within `use-session-store.ts`.
- **Rationale**: The message is currently hardcoded. Given the scope and budget constraints, updating the literal is the most efficient path.
- **Alternatives**: 
    - *Fetch error from backend*: Rejected due to unnecessary complexity for a simple copy change.
    - *I18n library*: Rejected as the project does not currently use one.

## Risks / Trade-offs

- **[Risk]** E2E tests might fail if they assert the exact previous error message.
- **[Mitigation]** Search for the error string in `tests/` and update any occurrences to match the new value.
