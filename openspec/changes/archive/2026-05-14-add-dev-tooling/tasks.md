## 0. Prerequisites

- [x] 0.1 Verify `~/.cloudflared/config.yml` has tunnel `ourlens` with credentials file

## 1. Environment Variables

- [x] 1.1 Create `.env.example` with `ALLOWED_HOSTS=localhost,127.0.0.1,ourlens.darideveloper.com`
- [x] 1.2 Update `astro.config.mjs` to read `server.allowedHosts` from `ALLOWED_HOSTS` environment variable

## 2. dev.sh Script

- [x] 2.1 Create `dev.sh` at project root with:
  - [x] Project name detection from working directory
  - [x] Existing tmux session check and re-attachment
  - [x] Fixed port 4321 for Astro dev server
  - [x] `tmux` session with two windows:
    - Window 0 ("astro"): Astro dev server (`npx astro dev --port 4321`)
    - Window 1 ("tunnel"): Cloudflared named tunnel (`cloudflared tunnel run ourlens`)
  - [x] Auto-attach to session on launch
- [x] 2.2 Make `dev.sh` executable (`chmod +x`)

## 3. Documentation

- [x] 3.1 Document prerequisites in script comments or README: `tmux`, `cloudflared`
- [x] 3.2 Document tmux keybindings in script comments: Ctrl+b n/p to switch windows, Ctrl+b d to detach

## 4. Validation

- [x] 4.1 Run `./dev.sh` — verify tmux session `ourlens_dev` is created with two windows
- [x] 4.2 Navigate to `https://ourlens.darideveloper.com` — verify cloudflare tunnel proxies to local dev server
- [x] 4.3 Run `./dev.sh` again — verify it attaches to the existing session instead of creating a new one
- [x] 4.4 Verify `Ctrl+b d` detaches and processes keep running
