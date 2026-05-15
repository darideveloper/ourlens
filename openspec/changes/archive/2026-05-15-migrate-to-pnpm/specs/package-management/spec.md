## ADDED Requirements

### Requirement: pnpm as Canonical Package Manager
The project SHALL use pnpm as its only package manager. The `"packageManager"` field in `package.json` SHALL pin the exact pnpm version (e.g., `"pnpm@10.x.x"`) so Corepack can auto-activate the correct version without a global install step. `pnpm-lock.yaml` SHALL be committed to version control. `package-lock.json` SHALL NOT exist in the repository.

#### Scenario: Developer installs dependencies
- **WHEN** a developer runs `pnpm install` on a fresh clone
- **THEN** all dependencies are installed from the pnpm content-addressable store
- **AND** `pnpm-lock.yaml` is respected for deterministic installs
- **AND** no `package-lock.json` or `yarn.lock` is generated or present

#### Scenario: Corepack activates pnpm automatically
- **WHEN** a developer (or CI) has Corepack enabled and runs any `pnpm` command
- **THEN** Corepack reads `"packageManager"` from `package.json`
- **AND** automatically uses the pinned pnpm version without manual installation

#### Scenario: Wrong package manager attempted
- **WHEN** a developer attempts `npm install` on the project
- **THEN** Corepack (if enabled) emits an error indicating pnpm is the required package manager
- **AND** no `node_modules/` state is modified by npm

### Requirement: pnpm Build and Dev Commands
All developer-facing scripts and tooling configurations SHALL invoke package commands via `pnpm` instead of `npm` or `npx`. The `dev.sh` script SHALL use `pnpm astro dev` to start the development server. Documentation (README.md) SHALL reflect pnpm commands.

#### Scenario: Development server starts via pnpm
- **WHEN** the developer runs `./dev.sh`
- **THEN** the Astro dev server is started using `pnpm astro dev --port 4321`
- **AND** the server runs correctly on port 4321 as required by the dev-tooling spec

#### Scenario: Build produces identical output
- **WHEN** the developer or Coolify CI runs `pnpm build`
- **THEN** the `dist/` directory is populated with the same static output as the previous `npm run build`
- **AND** no application behavior is changed

### Requirement: Coolify Deployment via pnpm
The Coolify project settings SHALL use pnpm commands for install and build phases. The Nginx static serving configuration and `dist/` output directory SHALL remain unchanged.

#### Scenario: Coolify deploys the site
- **WHEN** Coolify triggers a deploy (push to main or manual trigger)
- **THEN** Coolify runs `pnpm install` to restore dependencies
- **AND** runs `pnpm build` to generate the `dist/` folder
- **AND** Nginx serves the static files from `dist/` as before
- **AND** the site is accessible at `https://ourlens.darideveloper.com`
