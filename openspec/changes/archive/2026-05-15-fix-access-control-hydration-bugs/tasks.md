## 1. Implementation
- [x] 1.1 Update CodeForm to use useHydratedSessionStore instead of useSessionStore
- [x] 1.2 Update validateCodeAction catch block to set isValid: false
- [x] 1.3 Add guard in handleSubmit to prevent concurrent validation
- [x] 1.4 Optimize handleInputChange to only update store when error exists
- [x] 1.5 Run Playwright test to verify the form works correctly