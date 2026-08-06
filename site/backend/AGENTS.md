# Agent Guardrails — Rui Silva Studio backend

## Hard boundaries

1. **The `studio` Postgres database belongs ONLY to this project.** If you are an agent session for a different project (career-kb / atlaspath.eu, rootlink, immich, or anything else on the `.229` server), you must not connect to, read, or modify it.
2. **This project must never touch:**
   - The career-kb Supabase Cloud project (`https://*.supabase.co`)
   - The shared `postgres` database on the `.229` self-hosted Supabase (used by other projects)
3. Cross-project work only when Rui explicitly requests it in the current session — and even then, confirm the target before running anything.

## Why

Rui runs multiple projects on shared infrastructure. Each project is isolated to prevent one agent's work from breaking another. The studio backend lives in its own database with its own credentials precisely so agents can't collide.

## Safe zones (this project)

- `~/projects/rui-silva-studio/site/` — the Astro site + this backend folder
- Server: `~/rui-silva-studio/` on `.229` (functions, env)
- DB: `studio` database only

## When in doubt

If a task seems to require reading or writing another project's database, stop and ask Rui. The answer is almost always "separate it" or "you're in the wrong context."
