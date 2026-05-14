## ADDED Requirements

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
The system SHALL provide a `submitFrames` function in `src/lib/api/analyze-frames.ts` that sends an array of Base64-encoded JPEG frames along with the invitation code to the n8n webhook for AI analysis.

#### Scenario: Frames submitted for analysis
- **WHEN** `submitFrames` is called with a valid invitation code and an array of Base64 frames
- **THEN** the system SHALL POST a JSON payload `{ code, images }` to the n8n webhook via `safeFetch`
- **AND** SHALL handle the response as a hazard analysis result with 45-second timeout

#### Scenario: API call fails
- **WHEN** the n8n webhook is unreachable or returns an error
- **THEN** `submitFrames` SHALL throw a `FetchError` with a descriptive type (`network`, `timeout`, `http`, `parse`, or `abort`)
- **AND** the calling component SHALL handle the error with a user-facing message

#### Scenario: Dummy data during development
- **WHEN** `PUBLIC_N8N_BASE_URL` environment variable is not set
- **THEN** `submitFrames` SHALL return dummy hazard data simulating a 2000ms delay
- **AND** the dummy data SHALL include realistic `Hazard` objects with name, risk level, and recommendation

### Requirement: API Service Architecture
All API calls SHALL use the native browser `fetch` API via a typed `safeFetch<T>()` wrapper with `AbortSignal.timeout()`, configurable base URL (via `PUBLIC_N8N_BASE_URL` environment variable), `FetchError` classification, and retry logic for transient errors (network, timeout, 5xx).

#### Scenario: API base URL configuration
- **WHEN** the application initializes
- **THEN** all API functions SHALL use the base URL from `PUBLIC_N8N_BASE_URL`
- **AND** SHALL apply a 30-second timeout for validation calls and 45-second timeout for analysis calls

#### Scenario: Transient error retry
- **WHEN** an API call fails with a network error, timeout, or 5xx status
- **THEN** `submitFrames` SHALL retry up to 2 times with exponential backoff (1s base, 8s max, 10% jitter)
- **AND** SHALL NOT retry on 4xx errors, parse errors, or abort errors

#### Scenario: Runtime response validation
- **WHEN** the n8n API returns an unexpected response shape
- **THEN** `parseSafetyReport()` SHALL wrap the response in a safe default hazard entry
- **AND** SHALL NOT crash the application