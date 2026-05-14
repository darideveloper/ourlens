# Tasks: Disable Back Button on Instructions Screen

## Implementation Tasks

- [x] 1. Update `Layout.astro` — add `backDisabled` computed flag and conditionally disable the back button on `/instructions` using HTML `disabled` attribute, removing `hover:text-on-surface` and adding `opacity-30 cursor-default` when disabled
- [x] 2. Verify delta specs align with implementation after code changes
- [x] 3. Validate with `openspec validate disable-instructions-back-button --strict`
- [x] 4. Manual Playwright CLI validation — navigate to `/instructions` and confirm back button is dimmed and non-interactive; navigate to `/scanner` and confirm back button works