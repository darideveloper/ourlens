## MODIFIED Requirements

### Requirement: Invitation Code Validation API
The system SHALL provide a `validateCode` function in `src/lib/api/validate-code.ts` that sends an invitation code to the n8n webhook endpoint via `safeFetch` POST and returns a typed `ValidateCodeResponse`. The live endpoint SHALL be `${PUBLIC_N8N_BASE_URL}/validate` (resolving to `https://n8n.apps.darideveloper.com/webhook/ourlens/validate`). During development (when `PUBLIC_N8N_BASE_URL` is unset), the function SHALL return realistic dummy data.

#### Scenario: Valid code sent to API
- **WHEN** `validateCode` is called with a valid invitation code
- **THEN** the system SHALL POST `{ code }` to `${PUBLIC_N8N_BASE_URL}/validate` via `safeFetch`
- **AND** SHALL return `{ valid: true }` on a successful response

#### Scenario: Invalid code sent to API
- **WHEN** `validateCode` is called with an invalid invitation code
- **THEN** the system SHALL return `{ valid: false }` from the API response

#### Scenario: Dummy data during development
- **WHEN** `PUBLIC_N8N_BASE_URL` environment variable is not set
- **THEN** `validateCode` SHALL return dummy data simulating an 800ms delay
- **AND** SHALL return `{ valid: true }` for codes of 4+ characters

### Requirement: Frame Submission API
The system SHALL provide a `submitFrames` function in `src/lib/api/analyze-frames.ts` that sends an array of full data URL images along with the invitation code to the n8n webhook for AI analysis. The live endpoint SHALL be `${PUBLIC_N8N_BASE_URL}/analyze` (resolving to `https://n8n.apps.darideveloper.com/webhook/ourlens/analyze`).

Each image in the `images` array SHALL be a full data URL string as produced by `canvas.toDataURL('image/jpeg', 0.7)` — i.e. `data:image/jpeg;base64,<base64data>`. Images are capped at 1024px wide before encoding.

#### Scenario: Frames submitted for analysis
- **WHEN** `submitFrames` is called with a valid invitation code and an array of full data URL images
- **THEN** the system SHALL POST `{ code, images }` to `${PUBLIC_N8N_BASE_URL}/analyze` via `safeFetch`
- **AND** SHALL handle the response as a hazard analysis result with 45-second timeout

#### Scenario: Valid hazard report returned
- **WHEN** n8n returns a valid `SafetyReport`
- **THEN** `parseSafetyReport()` SHALL return it as-is
- **AND** each hazard SHALL have `name: string`, `riskLevel: "High" | "Low"`, `recommendation: string`
- **AND** `riskLevel` SHALL be exactly `"High"` or `"Low"` — any other value (including `"Medium"`) causes the entire report to fail validation

#### Scenario: No hazards found
- **WHEN** n8n returns `{ hazards: [] }`
- **THEN** `parseSafetyReport()` SHALL return the empty report as-is

#### Scenario: Invalid code on analyze endpoint
- **WHEN** n8n returns `{ valid: false }` (expired or unknown code detected by the analyze workflow's re-validation)
- **THEN** `parseSafetyReport()` SHALL fall back to the safe default hazard entry
- **AND** the user SHALL see "We couldn't parse the detailed results. Please try scanning again."

#### Scenario: API call fails
- **WHEN** the n8n webhook is unreachable or returns an error
- **THEN** `submitFrames` SHALL throw a `FetchError` with a descriptive type (`network`, `timeout`, `http`, `parse`, or `abort`)
- **AND** the calling component SHALL handle the error with a user-facing message

#### Scenario: Dummy data during development
- **WHEN** `PUBLIC_N8N_BASE_URL` environment variable is not set
- **THEN** `submitFrames` SHALL return dummy hazard data simulating a 2000ms delay
- **AND** the dummy data SHALL include realistic `Hazard` objects with `name`, `riskLevel`, and `recommendation`

## ADDED Requirements

### Requirement: Hazard Data Type
The `riskLevel` field on `Hazard` SHALL accept only `"High"` or `"Low"`. The n8n system prompt and output parser SHALL enforce this constraint at the AI level. Any response where a hazard contains any other `riskLevel` value SHALL fail `isSafetyReport()` validation and be replaced by the safe default.

#### Scenario: Invalid riskLevel rejected
- **WHEN** n8n returns a hazard with `riskLevel` set to any value other than `"High"` or `"Low"` (e.g. `"Medium"`)
- **THEN** `isSafetyReport()` SHALL return `false` for the entire report
- **AND** `parseSafetyReport()` SHALL return the safe default hazard entry instead of crashing

## MODIFIED Requirements

### Requirement: API Service Architecture
All API calls SHALL use the native browser `fetch` API via a typed `safeFetch<T>()` wrapper with `AbortSignal.timeout()`, configurable base URL (via `PUBLIC_N8N_BASE_URL` environment variable), `FetchError` classification, and retry logic for transient errors (network, timeout, 5xx). The `PUBLIC_N8N_BASE_URL` variable SHALL be documented in `.env.example` so all developers know it is required for live operation.

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
- **THEN** `parseSafetyReport()` SHALL wrap the response in a safe default hazard entry: `{ name: "Analysis Complete", riskLevel: "Low", recommendation: "We couldn't parse the detailed results. Please try scanning again." }`
- **AND** SHALL NOT crash the application

#### Scenario: Environment variable documented
- **WHEN** a developer clones the repository and reads `.env.example`
- **THEN** `PUBLIC_N8N_BASE_URL` SHALL appear with a descriptive comment explaining its purpose and format
