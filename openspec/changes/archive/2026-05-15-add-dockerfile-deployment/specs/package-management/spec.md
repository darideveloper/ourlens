## MODIFIED Requirements

### Requirement: Coolify Deployment via pnpm

The Coolify project SHALL deploy the application via a versioned multi-stage `Dockerfile` at the repository root. The Dockerfile SHALL use `node:22-alpine` with Corepack-activated pnpm (pinned to the version in `package.json`'s `packageManager` field) for the build stage, and `nginx:alpine` for the runtime stage. Build-time `PUBLIC_*` environment variables (notably `PUBLIC_N8N_BASE_URL`) SHALL be declared as Docker `ARG`s and passed from Coolify's Build-time Environment Variables (not runtime env), so Vite inlines them into the static bundle at build time. The nginx configuration SHALL live in a versioned `nginx.conf` file at the repository root and SHALL be baked into the image; Coolify's inline "Custom Nginx Configuration" field SHALL be empty.

#### Scenario: Coolify deploys the site
- **WHEN** Coolify triggers a deploy (push to main or manual trigger)
- **THEN** Coolify builds the image from the repo-root `Dockerfile` using the Dockerfile Build Pack
- **AND** the build stage runs `pnpm install --frozen-lockfile` followed by `pnpm build`
- **AND** the runtime stage serves `dist/` from `nginx:alpine` using the repo-root `nginx.conf`
- **AND** the site is accessible at `https://ourlens.apps.darideveloper.com`

#### Scenario: Clean image on every deploy
- **WHEN** a new Coolify deployment completes
- **THEN** the served `/_astro/` directory SHALL contain only files produced by the current build
- **AND** no files from previous builds (e.g., orphaned hashed asset filenames) SHALL be reachable on the deployed origin

#### Scenario: Build-time env vars reach the build
- **WHEN** Coolify starts a build with `PUBLIC_N8N_BASE_URL` set in Build-time Environment Variables
- **THEN** the Docker build receives the value via `--build-arg PUBLIC_N8N_BASE_URL=<value>`
- **AND** the corresponding `ARG`/`ENV` lines in the Dockerfile expose the value to `pnpm build`
- **AND** Vite inlines the value into the produced JS chunks

#### Scenario: nginx config is reviewable in git
- **WHEN** a developer needs to change nginx routing, caching, or security headers
- **THEN** the change is made by editing `nginx.conf` at the repository root and opening a pull request
- **AND** the change is NOT made by editing a field in the Coolify UI
