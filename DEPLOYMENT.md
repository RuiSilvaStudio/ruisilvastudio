# Rui Silva Studio — Deployment Guide

**Last updated:** 2026-08-07 · **Repo:** [RuiSilvaStudio/ruisilvastudio](https://github.com/RuiSilvaStudio/ruisilvastudio)

This document describes how the ruisilvastudio.com stack is deployed and how to operate it.
It is written for two audiences: Rui, and any future agent/session working on this project.

> ⚠️ **Server-side details marked `⚠ UNVERIFIED`** were written from repo sources and session
> notes, not re-confirmed live on the server (SSH was unavailable at write time). Verify on
> next server access and remove the marker.

---

## 1. Architecture at a glance

```
                          Internet
                             │
                    Cloudflare (DNS + proxy)
                             │
              ┌──────────────┼──────────────────┐
              │              │                  │
     www.ruisilvastudio.com  │   newsletter.ruisilvastudio.com
     forms.ruisilvastudio.com│   (CF tunnel: cloudflared-studio)
              │              │                  │
        ┌─────┴──────┐  ┌────┴─────┐     ┌──────┴──────┐
        │   Caddy    │  │studio-api│     │  Listmonk   │
        │  (static)  │  │  (Deno)  │     │  :9000      │
        │  dist/     │  │  :3700   │     └──────┬──────┘
        └────────────┘  └────┬─────┘            │
                             │            ┌─────┴──────┐
                      ┌──────┴──────┐     │listmonk-db │
                      │  supabase-db │     │ postgres:16│
                      │  DB: studio  │     └───────────┘
                      │  (contacts)  │
                      └─────────────┘

All backend pieces run on the home server ("**229**", `rui@192.168.1.229`)
in Docker on the isolated `studio-net` network.
Mail for both services goes out via the **Brevo** SMTP relay.
```

| Hostname | Service | Route in |
|---|---|---|
| `www.ruisilvastudio.com` | Static Astro site (`dist/`) served by Caddy | CF tunnel (main `cloudflared`) `⚠ UNVERIFIED` |
| `forms.ruisilvastudio.com` | studio-api (Deno, :3700) | CF tunnel `cloudflared-studio` |
| `newsletter.ruisilvastudio.com` | Listmonk admin + public pages (:9000) | CF tunnel `cloudflared-studio` |
| `book.ruisilvastudio.com` | Booking — **planned, not deployed** | — |

---

## 2. Components

### 2.1 Static site (Astro)

| | |
|---|---|
| Source | `site/` in this repo (Astro 7 + Tailwind v4 + GSAP/Lenis) |
| Content single source | `site/src/lib/site.ts` |
| Build | `npm run build` → `site/dist/` |
| Dev | `npx astro dev --port 5176` |
| Served from | `~/rui-silva-studio/www/` on 229, via Caddy `⚠ UNVERIFIED` |

**Deploy:**
```bash
cd site
npm ci
npm run build
rsync -av --delete dist/ rui@192.168.1.229:~/rui-silva-studio/www/
```
No service restart needed — Caddy serves the files directly.

### 2.2 studio-api (forms & email API)

| | |
|---|---|
| Source | `site/backend/api/` (Deno 1.46) |
| Image | built locally from `site/backend/Dockerfile` |
| Container | `studio-api` |
| Port | `127.0.0.1:3700` (loopback only — reached via CF tunnel) |
| Env file | `~/rui-silva-studio/api.env` on 229 (root-only, **never committed**) |
| Endpoints | `GET /health` · `POST /api/contact` · `POST /api/newsletter` |

**What it does:**
- `/api/contact` — validates, inserts into `studio.public.contacts`, sends
  autoreply to the sender + notification to the studio (fire-and-forget; SMTP
  failures never fail the request). Honeypot field: `company`.
- `/api/newsletter` — validates, forwards to Listmonk's public subscription API.
  **Listmonk owns the subscriber record and sends the double opt-in email.**
- CORS is allow-listed via `ALLOWED_ORIGINS` env (production origins + localhost dev).

**Environment variables** (in `api.env`):

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Postgres DSN to the `studio` DB on `supabase-db` |
| `STUDIO_EMAIL` | Notification recipient (default `rui.silva@ruisilvastudio.com`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS allow-list |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Brevo relay (465, implicit TLS) |
| `MAIL_FROM` / `MAIL_FROM_NAME` | Sender identity |
| `LISTMONK_URL` | Internal URL, `http://studio-listmonk:9000` |
| `LISTMONK_LIST_UUID` | UUID of the newsletter list in Listmonk |

**Deploy / update:**
```bash
cd site/backend
docker build -t studio-api .
# then on 229 (or build there): recreate the container with the same env file
docker rm -f studio-api
docker run -d --name studio-api --network studio-net \
  --restart unless-stopped \
  -p 127.0.0.1:3700:3700 \
  --env-file ~/rui-silva-studio/api.env \
  studio-api
```
`⚠ UNVERIFIED` — exact run command on 229 (env file path, any extra flags).
Confirm with `docker inspect studio-api` and update this doc.

**Health check:**
```bash
curl -s https://forms.ruisilvastudio.com/health   # {"ok":true}
```

### 2.3 Listmonk (newsletter)

| | |
|---|---|
| Compose file | `site/backend/listmonk/docker-compose.yml` |
| Containers | `studio-listmonk` (app) · `studio-listmonk-db` (postgres:16-alpine) |
| Port | `127.0.0.1:9000` (loopback only — reached via CF tunnel) |
| Config | `listmonk-config.toml` (mounted read-only) |
| Volumes | `listmonk-db-data` (DB) · `listmonk-uploads` (campaign images) |
| Version in use | **v6.2.0** |

**Key facts:**
- Subscribers live **only** in Listmonk's own DB (`listmonk` DB in `studio-listmonk-db`).
  Double opt-in is handled by Listmonk itself.
- Admin credentials live in the DB (Settings → Users), not in the config file.
- SMTP: Brevo relay, port **465 implicit TLS**, from
  `Rui Silva Studio <rui.silva@ruisilvastudio.com>`.
  > ℹ️ Session note: Listmonk stores SMTP in its DB `settings` table (`key='smtp'`),
  > which **overrides `config.toml`** at runtime. If mail breaks, check
  > Settings → SMTP in the admin first. `⚠ UNVERIFIED` whether the DB row currently
  > uses 465/tls or 587/starttls — if changing, prefer matching `config.toml`.
- `root_url` is `https://newsletter.ruisilvastudio.com` — this is what appears in
  opt-in/unsubscribe links, so the tunnel must stay healthy.

**Operate:**
```bash
cd ~/rui-silva-studio/listmonk        # on 229  ⚠ UNVERIFIED path
docker compose up -d                  # start
docker compose logs -f listmonk       # logs
docker compose pull && docker compose up -d   # upgrade
```

### 2.4 Campaign email templates (newsletter builder)

| | |
|---|---|
| Source | `site/backend/templates/listmonk/` |
| Files | `campaign-newsletter-en.html` · `campaign-newsletter-pt.html` · `campaign-announcement-en.html` · `campaign-announcement-pt.html` |
| Installed in | Listmonk admin → Campaigns → Templates (imported manually, stored in Listmonk DB) |

**Design system:** ivory `#FCFBF8` body on sand `#F1EEE7`, night `#141312` header,
brass `#AE8C57` accents, ink `#1F1E1C` headings, ash `#5A564E` body text.
600px table layout, fully inline styles (email-client safe). The horse/wordmark
follows the brand rule: white or black only, never blue.

**Template syntax (Listmonk v6.2.0 — Go templates):**

| Token | Meaning |
|---|---|
| `{{ template "content" . }}` | **Required exactly once** — where the composed campaign body lands |
| `{{ ManageURL . }}` | Manage-subscription page link |
| `{{ UnsubscribeURL . }}` | One-click unsubscribe link |
| `{{ MessageURL . }}` | View-in-browser link |
| `{{ OptinURL . }}` | Opt-in page (valid but not used in our footers) |

> ⚠️ These are **function calls**, not fields. `{{ .UnsubscribeURL }}` (field syntax)
> fails at render time with `can't evaluate field … in type *manager.CampaignMessage`.
> This bit us once — see commit history.

**Importing / updating a template:**
1. Open the HTML file from the repo in a **text editor** (never copy from a chat
   window or rendered preview — smart quotes / mangled `{{ }}` braces break the
   Go template parser).
2. Listmonk admin → Campaigns → Templates → edit (or Create new).
3. Editor must be in **raw HTML mode** (the `</>` toggle), not rich text.
4. Paste, save. Listmonk validates the content placeholder on save.
5. Test: Campaigns → create campaign → pick the template → **Preview (F9)** →
   then "Send test" to your own address before any real send.

**Sending a campaign:** Campaigns → New → name, subject, pick template, choose the
list, write body in the content editor (Rich text format recommended), Preview,
Send test, then Send/Schedule.

The hero image and title are baked into each template. Per-campaign editable
hero/title via template variables is a known future improvement.

### 2.5 Email templates for studio-api (transactional)

| | |
|---|---|
| Source | `site/backend/templates/` (baked into the Docker image) |
| Files | `contact-autoreply.html` · `contact-notification.html` · `newsletter-confirmation.html` (newsletter confirmation is legacy — Listmonk's own double opt-in mail is what actually sends) |

These are loaded by `api/templates.ts`, escaped and interpolated in `api/main.ts`.
Changing them = rebuild + recreate the `studio-api` container (see 2.2).

---

## 3. Networking & access

- **Cloudflare Tunnels** are the only public ingress (the ISP gives a dynamic IPv4;
  direct 80/443 is unreliable). Two tunnels:
  - main `cloudflared` — older routes `⚠ UNVERIFIED which hostnames remain here`
  - `cloudflared-studio` — `forms.` and `newsletter.` (systemd unit on 229)
- Both app containers bind to **127.0.0.1** — not reachable from LAN, only via tunnel.
- **Caddy** terminates/serves the static site `⚠ UNVERIFIED — exact Caddyfile
  location and whether it proxies or only serves static`.
- Check tunnel status on 229:
  ```bash
  systemctl status cloudflared-studio
  journalctl -u cloudflared-studio -n 50
  ```

---

## 4. Isolation rules (read before touching anything on 229)

1. The `studio` database on `supabase-db` is a **separate database**, not a schema
   in the shared `postgres` DB. The shared `postgres` DB (career-kb, rootlink,
   immich…) is **off-limits**.
2. Listmonk has its **own Postgres container** (`studio-listmonk-db`) — subscribers
   never touch Supabase at all.
3. Everything studio-related is on the `studio-net` Docker network and named
   `studio-*`.
4. Nothing in this project may connect to the career-kb Supabase Cloud project
   (`*.supabase.co`).
5. Secrets live only in env files on 229 (root-only). **Never commit them.**
   Repo config files carry `REPLACE_*` placeholders.

---

## 5. Backups `⚠ UNVERIFIED — no backup routine is currently documented`

Things worth backing up, in priority order:

| Data | Where | Suggested method |
|---|---|---|
| Listmonk DB (subscribers, templates, campaigns) | volume `listmonk-db-data` | `docker exec studio-listmonk-db pg_dump -U listmonk listmonk > backup.sql` |
| `studio` DB (contact form entries) | `supabase-db` container | `pg_dump -d studio` |
| Env files / configs | `~/rui-silva-studio/` on 229 | copy off-server (contains secrets — handle accordingly) |
| Listmonk uploads | volume `listmonk-uploads` | tar the volume |
| This repo | GitHub | already off-site |

---

## 6. Common tasks cheat sheet

| Task | Command / where |
|---|---|
| Site content change | edit `site/src/lib/site.ts`, rebuild, rsync `dist/` |
| Rebuild + redeploy API | see §2.2 |
| Check API health | `curl https://forms.ruisilvastudio.com/health` |
| API logs | `docker logs -f studio-api` (on 229) |
| Listmonk logs | `docker compose logs -f listmonk` (on 229) |
| Send a newsletter | Listmonk admin → Campaigns (see §2.4) |
| Export subscribers | Listmonk admin → Subscribers → Export |
| Tunnel status | `systemctl status cloudflared-studio` |

---

## 7. Known gaps / planned work

- [ ] Booking system (`book.ruisilvastudio.com`) — Cal.com vs alternatives undecided
- [ ] Multi-language site (PT/EN/ES/IT/FR/GR)
- [ ] Per-campaign editable hero/title in newsletter templates
- [ ] Gitea on 229 as primary git remote + GitHub as read-only mirror (decided 2026-08-07, not yet implemented)
- [ ] Documented backup routine (§5)
- [ ] `site/backend/AGENTS.md` — could not be loaded by the agent's safety
      filter on 2026-08-07 (flagged as potential prompt injection). It's our own
      file; review its wording, then reconcile with this doc.
