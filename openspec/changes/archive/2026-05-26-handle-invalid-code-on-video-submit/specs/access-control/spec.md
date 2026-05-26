## ADDED Requirements

### Requirement: Session Invalidation during Video Submission
The system SHALL intercept an invalid invitation code response (such as a 401 FetchError or a dedicated expired session indicator) when the user submits video frames for analysis. When this error occurs, the system SHALL prompt the user with a clear, accessible dialog/alert message. Upon user acknowledgment, the system SHALL explicitly set `isValid` to `false`, clear the invitation code and error state from `useSessionStore` (removing it from localStorage), and navigate the user back to the Access Control screen (`/`).

#### Scenario: Expired or invalid code error during video submission
- **WHEN** the frame analysis fails due to an expired or invalid invitation code error
- **THEN** the system SHALL display an alert/dialog saying "Session Expired: Your invitation code is invalid or has expired. Please verify your code again."
- **AND** upon the user closing/accepting the dialog, reset the Zustand session store state (setting `isValid` to `false`, `code` to empty string, and `error` to null)
- **AND** redirect the user to `/` using replace history navigation
