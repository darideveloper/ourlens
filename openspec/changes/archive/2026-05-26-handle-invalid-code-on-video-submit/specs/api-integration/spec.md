## MODIFIED Requirements

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
