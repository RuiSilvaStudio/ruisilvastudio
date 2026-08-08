# Agent Guardrails — Rui Silva Studio backend

## Hard boundaries

1. **The `studio` Postgres database belongs ONLY to this project.** If you are an agent session for a different project (career-kb / atlaspath.eu, rootlink, immich, or anything else on the `.229` server), you must not connect to, read, or modify it.
2. **This project must never touch:** the career-kb Supabase Cloud project (`https://*.supabase.co`) — that is a separate hosted instance, not the self-hosted one on `.229`.
3. Cross-project work only when Rui explicitly requests it in the current session — and even then, confirm the target before running anything.

## Why

Rui runs multiple projects on shared infrastructure. Each project is isolated to prevent one agent's work from breaking another. The studio backend lives in its own database with its own credentials precisely so agents can't collide.

## Infrastructure owned by this project

### Self-hosted Supabase on .229
- **Location on server:** `/home/rui/supabase/` (docker-compose.yml)
- **Used by:** rui-silva-studio ONLY (the `studio` database via `supabase-pooler:6543`)
- **RootLink does NOT use Supabase** — it uses its own SQLite + Redis stack
- **career-kb uses Supabase CLOUD** (hosted at `*.supabase.co`) — completely separate
- **Access:** Kong gateway on VPN only (`10.8.0.2:18000`), Pooler on `127.0.0.1:5433/6543`
- **Port binding rule:** All Supabase ports MUST stay bound to `127.0.0.1` (or `10.8.0.2` for Kong). Never `0.0.0.0`.

### Cloudflare Tunnel — `cloudflared-studio.service`
- **Systemd unit:** `/etc/systemd/system/cloudflared-studio.service` on `.229`
- **Binary:** `/usr/local/bin/cloudflared`
- **Tunnel name:** `studio` (visible in Cloudflare DNS as Tunnel records)
- **Serves these domains (all Proxied):**
  - `forms.ruisilvastudio.com` → Studio API (Listmonk forms)
  - `newsletter.ruisilvastudio.com` → Listmonk
  - `preview.ruisilvastudio.com` → Studio preview
  - `ruisilvastudio.com` → Main site (Astro, via Vercel)
  - `www.ruisilvastudio.com` → Main site
- **Do NOT touch without Rui's explicit approval** — these tunnels were hard to configure

### Cloudflare Tunnel — `cloudflared.service` (general, NOT studio)
- **Systemd unit:** `/etc/systemd/system/cloudflared.service` on `.229`
- **Binary:** `/usr/bin/cloudflared`
- **Tunnel name:** `rootlink` (visible in Cloudflare DNS as Tunnel records)
- **Serves these domains (all Proxied):**
  - `api.ruisilvastudio.com` → RootLink backend (Caddy → localhost:8000)
  - `jellyfin.ruisilvastudio.com` → Jellyfin (Caddy → localhost:8096)
- **Owned by:** infrastructure/server-level, shared between RootLink + Jellyfin
- **This project should NOT modify this tunnel** — it belongs to RootLink/infra

## Safe zones (this project)

- `~/projects/rui-silva-studio/site/` — the Astro site + this backend folder
- Server: `~/rui-silva-studio/` on `.229` (functions, env)
- DB: `studio` database only

## When in doubt

If a task seems to require reading or writing another project's database, stop and ask Rui. The answer is almost always "separate it" or "you're in the wrong context."
