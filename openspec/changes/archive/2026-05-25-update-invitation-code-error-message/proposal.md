## Why

The current error message for an invalid invitation code is too generic. Adding "or expired" provides more accurate feedback to the user, as codes managed in the n8n backend may have expired. This improves the user experience by clarifying why a previously working code might no longer function.

## What Changes

- `src/stores/use-session-store.ts`: Update the error message displayed when `validateCode` returns `valid: false`. The message changes from `'That invitation code is not recognised. Please check and try again.'` to `'That invitation code is not recognised or expired. Please check and try again.'`.

## Capabilities

### New Capabilities
- (none)

### Modified Capabilities
- `access-control`: Update the requirement for the error message shown during failed validation to include "expired" status.

## Impact

- **Stores**: `src/stores/use-session-store.ts` (updated error string)
- **Specs**: `openspec/specs/access-control/spec.md` (requirement update)
