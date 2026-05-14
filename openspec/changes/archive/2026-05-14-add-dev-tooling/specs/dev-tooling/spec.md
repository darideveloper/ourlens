## ADDED Requirements

### Requirement: Unified Dev Script (dev.sh)

The project SHALL provide a `dev.sh` shell script at the project root that starts all development services in a single `tmux` session with a single command.

#### Scenario: First launch creates tmux session

- **WHEN** the developer runs `./dev.sh` and no `ourlens_dev` tmux session exists
- **THEN** a new tmux session named `ourlens_dev` is created with two windows: "astro" (Astro dev server on port 4321) and "tunnel" (cloudflared tunnel)
- **AND** the developer is automatically attached to the session

#### Scenario: Re-launch attaches to existing session

- **WHEN** the developer runs `./dev.sh` and an `ourlens_dev` tmux session already exists
- **THEN** the script attaches to the existing session without creating duplicate processes

#### Scenario: Detached processes keep running

- **WHEN** the developer presses `Ctrl+b d` to detach from the tmux session
- **THEN** all services (Astro dev server, cloudflared tunnel) continue running in the background

### Requirement: Fixed Port 4321

The Astro dev server SHALL always run on port 4321. No dynamic port detection is required.

#### Scenario: Dev server uses port 4321

- **WHEN** the dev script starts
- **THEN** the Astro dev server binds to port 4321

### Requirement: Cloudflare Tunnel Public Access

The project SHALL use a named `cloudflared` tunnel to expose the local dev server via the configured public HTTPS URL (`https://ourlens.darideveloper.com`) for webhook and external service testing. The tunnel SHALL proxy to `http://localhost:4321`.

#### Scenario: Public URL via named cloudflare tunnel

- **WHEN** the dev script has started and `cloudflared tunnel run ourlens` is running
- **THEN** the local dev server is accessible at `https://ourlens.darideveloper.com`

#### Scenario: Tunnel runs in separate tmux window

- **WHEN** the dev script starts the tmux session
- **THEN** the cloudflared tunnel runs in its own tmux window ("tunnel") for independent log inspection

### Requirement: Environment-Driven Allowed Hosts

The Astro dev server SHALL read `server.allowedHosts` from the `ALLOWED_HOSTS` environment variable to support the cloudflare tunnel domain (`ourlens.darideveloper.com`).

#### Scenario: Allowed hosts include tunnel domain

- **WHEN** `ALLOWED_HOSTS` is set to `localhost,127.0.0.1,ourlens.darideveloper.com`
- **THEN** the Astro dev server accepts requests from `https://ourlens.darideveloper.com` (cloudflare tunnel)
