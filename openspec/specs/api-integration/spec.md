# api-integration Specification

## Purpose
TBD - created by archiving change add-ourlens-pwa-phase-2. Update Purpose after archive.
## Requirements
### Requirement: Invitation Code Validation API
The system SHALL provide a `validateCode` function in `src/lib/api/validate-code.ts` that sends an invitation code to the n8n webhook endpoint via `safeFetch` POST and returns a typed `ValidateCodeResponse`. During development (when `PUBLIC_N8N_BASE_URL` is unset), the function SHALL return realistic dummy data.

#### Scenario: Valid code sent to API
- **WHEN** `validateCode` is called with a valid invitation code
- **THEN** the system SHALL POST the code to the n8n webhook URL via `safeFetch`
- **AND** SHALL return `{ valid: true }` on a successful response

#### Scenario: Invalid code sent to API
- **WHEN** `validateCode` is called with an invalid invitation code
- **THEN** the system SHALL return `{ valid: false }` from the API response

#### Scenario: Dummy data during development
- **WHEN** `PUBLIC_N8N_BASE_URL` environment variable is not set
- **THEN** `validateCode` SHALL return dummy data simulating an 800ms delay
- **AND** SHALL return `{ valid: true }` for codes of 4+ characters

### Requirement: Frame Submission API
The system SHALL provide a `submitFrames` function in `src/lib/api/analyze-frames.ts` that sends an array of Base64-encoded JPEG frames along with the invitation code to the n8n webhook for AI analysis. If the response indicates an invalid or expired invitation code via `[ { "valid": false } ]`, the function SHALL throw a dedicated `FetchError` of type `'http'` with status code `401` and message `"Session expired"` to enable downstream components to handle session expiration.

#### Scenario: Frames submitted for analysis
- **WHEN** `submitFrames` is called with a valid invitation code and an array of Base64 frames
- **THEN** the system SHALL POST a JSON payload `{ code, images }` to the n8n webhook via `safeFetch`
- **AND** SHALL handle the response as a hazard analysis result with 60-second timeout

#### Scenario: API call fails
- **WHEN** the n8n webhook is unreachable or returns an error
- **THEN** `submitFrames` SHALL throw a `FetchError` with a descriptive type (`network`, `timeout`, `http`, `parse`, or `abort`)
- **AND** the calling component SHALL handle the error with a user-facing message

#### Scenario: Dummy data during development
- **WHEN** `PUBLIC_N8N_BASE_URL` environment variable is not set
- **THEN** `submitFrames` SHALL return dummy hazard data simulating a 2000ms delay
- **AND** the dummy data SHALL include realistic `Hazard` objects with name, risk level, and recommendation

#### Scenario: Expired or invalid invitation code returned
- **WHEN** the n8n webhook returns a response payload of `[ { "valid": false } ]` indicating the invitation code is expired or invalid
- **THEN** the system SHALL throw a custom `FetchError` with type `'http'`, status `401`, and message `"Session expired"`

### Requirement: API Service Architecture
All API calls SHALL use the native browser `fetch` API via a typed `safeFetch<T>()` wrapper with `AbortSignal.timeout()`, configurable base URL (via `PUBLIC_N8N_BASE_URL` environment variable), `FetchError` classification, and retry logic for transient errors (network, timeout, 5xx). The `PUBLIC_N8N_BASE_URL` variable SHALL be documented in `.env.example` so all developers know it is required for live operation.

#### Scenario: API base URL configuration
- **WHEN** the application initializes
- **THEN** all API functions SHALL use the base URL from `PUBLIC_N8N_BASE_URL`
- **AND** SHALL apply a 30-second timeout for validation calls and 60-second timeout for analysis calls

#### Scenario: Transient error retry
- **WHEN** an API call fails with a network error, timeout, or 5xx status
- **THEN** `submitFrames` SHALL retry up to 2 times with exponential backoff (1s base, 8s max, 10% jitter)
- **AND** SHALL NOT retry on 4xx errors, parse errors, or abort errors

#### Scenario: Runtime response validation
- **WHEN** the n8n API returns an unexpected response shape, such as a single-element array `[{ output: ... }]`
- **THEN** `parseSafetyReport()` SHALL unwrap the array and attempt to parse the inner object
- **AND** SHALL log a diagnostic warning with the raw response if parsing fails
- **AND** SHALL wrap the response in a safe default hazard entry if it still cannot be parsed: `{ name: "Analysis Complete", riskLevel: "Low", recommendation: "We couldn't parse the detailed results. Please try scanning again." }`

#### Scenario: Environment variable documented
- **WHEN** a developer clones the repository and reads `.env.example`
- **THEN** `PUBLIC_N8N_BASE_URL` SHALL appear with a descriptive comment explaining its purpose and format

### Requirement: Hazard Data Type
The `riskLevel` field on `Hazard` SHALL accept `"High"`, `"Medium"`, or `"Low"`. The system SHALL normalize risk level values from the API (e.g., lowercase "high" becomes "High") before validation. Any response where a hazard contains a value that cannot be normalized to these three levels SHALL fail `isSafetyReport()` validation and be replaced by the safe default.

#### Scenario: Medium riskLevel accepted
- **WHEN** n8n returns a hazard with `riskLevel` set to `"Medium"` or `"medium"`
- **THEN** `isSafetyReport()` SHALL return `true`
- **AND** `parseSafetyReport()` SHALL include the hazard in the report with normalized casing

#### Scenario: Invalid riskLevel rejected
- **WHEN** n8n returns a hazard with `riskLevel` set to any value that cannot be normalized to `"High"`, `"Medium"`, or `"Low"`
- **THEN** `isSafetyReport()` SHALL return `false` for the entire report
- **AND** `parseSafetyReport()` SHALL return the safe default hazard entry instead of crashing

