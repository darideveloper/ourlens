## MODIFIED Requirements

### Requirement: API Service Architecture

All API calls SHALL use the native browser `fetch` API via a typed `safeFetch<T>()` wrapper with a timeout implemented via basic `AbortController` + `setTimeout` (replacing `AbortSignal.timeout()` for broader device compatibility), configurable base URL (via `PUBLIC_N8N_BASE_URL` environment variable), `FetchError` classification, and retry logic for transient errors (network, timeout, 5xx). The `PUBLIC_N8N_BASE_URL` variable SHALL be documented in `.env.example` so all developers know it is required for live operation.

#### Scenario: API base URL configuration
- **WHEN** the application initializes
- **THEN** all API functions SHALL use the base URL from `PUBLIC_N8N_BASE_URL`
- **AND** SHALL apply a 30-second timeout for validation calls and 60-second timeout for analysis calls

#### Scenario: Timeout via basic AbortController
- **WHEN** `attemptFetch` is called
- **THEN** the system SHALL create a fresh `AbortController` and schedule timeout via `setTimeout`
- **AND** if an external signal is provided, SHALL forward its abort to the controller via `addEventListener`
- **AND** SHALL `clearTimeout` after the fetch settles (success, error, or abort)
- **AND** SHALL throw `FetchError('timeout')` when the timeout fires before the fetch completes
- **AND** SHALL throw `FetchError('abort')` when the external signal aborts

#### Scenario: Transient error retry
- **WHEN** an API call fails with a network error, timeout, or 5xx status
- **THEN** `submitFrames` SHALL retry up to 2 times with exponential backoff (1s base, 8s max, 10% jitter)
- **AND** SHALL NOT retry on 4xx errors, parse errors, or abort errors
