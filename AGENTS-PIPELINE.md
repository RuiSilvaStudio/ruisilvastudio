# Hermes Agent Instructions — ruisilvastudio

> **For the dev desktop agent working on this project**
> Last updated: 2026-08-09

---

## The New Rule

**You no longer deploy directly to .229.** All deployments go through the Atlas pipeline:

```
Your push to Gitea → Atlas validates → GitHub → .229
```

Your job: **write code, push to Gitea.** That's it.

---

## Setup (One Time)

Add the Gitea remote:

```bash
cd ~/projects/ruisilvastudio
git remote add gitea git@192.168.1.98:rui/ruisilvastudio.git
```

Test it works:

```bash
git fetch gitea
```

---

## Daily Workflow

### Write Code

Edit files as usual:
- `site/src/` — Astro pages and components
- `site/backend/api/` — Deno API endpoints
- `site/backend/templates/` — Email templates

### Test Locally

```bash
# Frontend
cd site
npm run dev

# Backend API
cd site/backend
deno run --allow-net --allow-env api/main.ts
```

### Commit and Push

```bash
git add -A
git commit -m "describe your change"
git push gitea main
```

**That's it.** Atlas takes over from here.

---

## Deploy to Production

### Option A: Gitea Web UI (Recommended)

1. Open `http://192.168.1.98:3000/rui/ruisilvastudio`
2. Click **Pull Requests** → **New Pull Request**
3. **From:** `main` → **To:** `deploy`
4. Click **Create Pull Request**
5. Wait for Atlas to comment:
   - ✅ **Validation PASSED** — safe to merge
   - ❌ **Validation FAILED** — fix the error, push again
6. Click **Merge** — Atlas deploys to .229

### Option B: Command Line

```bash
git checkout deploy
git merge main
git push gitea deploy
```

Atlas validates and deploys automatically.

---

## What Atlas Checks

| Check | What It Catches |
|-------|---------------|
| **Astro build** | Build errors, missing dependencies |
| **Deno check** | Type errors, import issues |
| **Listmonk templates** | Missing `{{ template "content" . }}` or wrong syntax |
| **Secrets scan** | Hardcoded passwords, tokens, API keys |
| **Brand rules** | Blue color near Lusitano horse mark |

If any check fails, Atlas comments on the PR with the exact error.

---

## What You Must NOT Do

| ❌ Don't | Why |
|---------|-----|
| `git push origin main` | Bypasses validation, breaks pipeline |
| `ssh rui@192.168.1.229` | Desktop has no .229 access |
| `rsync` or `scp` to .229 | Atlas handles file deployment |
| `docker` commands on .229 | Atlas manages containers |
| Edit files directly on .229 | Changes overwritten by next deploy |

---

## If Something Goes Wrong

### Validation failed

1. Read the error in the Gitea PR comment
2. Fix the code locally
3. Push again to the same branch
4. Atlas re-runs validation automatically

### Site broken after deploy

Tell the Atlas agent: **"rollback ruisilvastudio"**

### Need to check production

Ask the Atlas agent to:
- Check logs: `docker logs studio-api`
- Check health: `curl https://forms.ruisilvastudio.com/health`
- Restart service: `docker restart studio-api`

---

## Key Files

| File | Purpose |
|------|---------|
| `site/src/lib/site.ts` | Content single source |
| `site/src/pages/` | Astro pages |
| `site/backend/api/main.ts` | Deno API entry |
| `site/backend/templates/listmonk/` | Newsletter templates |
| `DEPLOYMENT.md` | Server-side deployment reference |

---

## Brand Rule

Lusitano horse mark: **white or black only, never blue.**

---

## Questions?

Ask the Atlas agent. Do not guess.
