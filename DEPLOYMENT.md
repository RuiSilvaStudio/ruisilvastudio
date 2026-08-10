# Rui Silva Studio — Dev Deployment

> **For the dev desktop agent only**
> Last updated: 2026-08-09

---

## Your Job

Write code, push to Gitea. That's it.

**Never touch .229. Never deploy manually. Never push to `deploy` branch.**

---

## Setup (One Time)

```bash
cd ~/projects/ruisilvastudio
git remote set-url gitea ssh://git@192.168.1.98:2222/rui/ruisilvastudio.git
```

Test it works:
```bash
ssh -p 2222 git@192.168.1.98
# Should say "Hi rui!" or similar
```

---

## Daily Workflow

### 1. Write Code

Edit files in `site/` as usual.

### 2. Test Locally

```bash
cd site
npm run dev
```

### 3. Push to Gitea

```bash
git add -A
git commit -m "what you changed"
git push gitea main
```

**Done.** Atlas takes over.

---

## Deploy to Production

### Step 1: Create PR

Open in browser:
```
http://192.168.1.98:3000/rui/ruisilvastudio/compare/deploy...main
```

Click **"New Pull Request"** → **"Create Pull Request"**

### Step 2: Wait for Atlas

Atlas will comment on the PR:
- ✅ **PASSED** — safe to merge
- ❌ **FAILED** — read the error, fix, push again

### Step 3: Merge

Click **"Merge"** — Atlas deploys to .229 automatically.

---

## What Atlas Checks

| Check | What It Catches |
|-------|---------------|
| Astro build | Build errors |
| Deno check | API type errors |
| Listmonk templates | Missing `{{ template "content" . }}` |
| Secrets scan | Hardcoded passwords/tokens |
| Brand rules | Blue near Lusitano horse mark |

---

## Never Do

| ❌ Don't | Why |
|---------|-----|
| `git push origin main` | Bypasses validation |
| `git push gitea deploy` | Deploy only via PR |
| `ssh rui@192.168.1.229` | No access |
| `rsync` or `docker` commands | Atlas handles |
| Edit files on .229 | Overwritten by deploy |

---

## If Something Breaks

**Validation failed?**
Read the error in the PR comment. Fix. Push again.

**Site broken after deploy?**
Tell Atlas agent: "rollback ruisilvastudio"

**Need to check .229?**
Ask Atlas agent. Don't SSH.

---

## Key Files

| File | What |
|------|------|
| `site/src/lib/site.ts` | Content |
| `site/src/pages/` | Pages |
| `site/backend/api/main.ts` | API |
| `site/backend/templates/listmonk/` | Email templates |

---

## Brand Rule

Lusitano horse mark: **white or black only, never blue.**

---

## Questions?

Ask the Atlas agent. Do not guess.
