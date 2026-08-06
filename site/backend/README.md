# Rui Silva Studio — Backend

Backend for [ruisilvastudio.com](https://www.ruisilvastudio.com) — contact form, newsletter, booking.

## ⚠️ Isolation — READ BEFORE TOUCHING ANYTHING

This backend is **fully isolated** from every other project on the `.229` server.

- **Its own Postgres database:** `studio` on the self-hosted Supabase (`supabase-db` container).
- **Not a schema in the shared `postgres` database.** It is a separate database entirely.
- The shared `postgres` DB (used by career-kb / Atlas Path's *self-hosted* data, rootlink, immich, etc.) is **off-limits**. Nothing here touches it, and nothing there should touch `studio`.

> **If you are an agent working on a DIFFERENT project (career-kb, atlaspath.eu, rootlink, immich, …): do NOT connect to, query, or modify the `studio` database.** It is not part of your project. Stop and ask Rui first.

Conversely, this project's code must never connect to the career-kb Supabase Cloud project (`*.supabase.co`) or the shared `postgres` DB.

## Components

| Piece | Where | Notes |
|---|---|---|
| Database | `studio` DB, `supabase-db` container | contacts + subscribers tables, RLS on |
| Edge functions | `~/rui-silva-studio/functions/` | Deno, run by `supabase-edge-functions` |
| Email | Brevo SMTP relay | creds in `~/rui-silva-studio/smtp.env` (root-only) |
| Newsletter | Listmonk (Docker) | `newsletter.ruisilvastudio.com` via Caddy |
| Booking | Cal.com (Docker) | `book.ruisilvastudio.com` via Caddy (later) |
| Static site | Astro `dist/` → Caddy | `www.ruisilvastudio.com` |

## Conventions

- Everything named `studio_*` or under the `studio` DB.
- Never commit secrets. `.env` files are gitignored and root-only on the server.
- DB metadata carries `COMMENT ON DATABASE studio IS '…do not touch…'` — visible to any agent inspecting the DB.
