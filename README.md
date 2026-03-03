# Anurag Mishra — Dark‑Mode OS‑Themed Portfolio

A backend‑less, OS‑themed portfolio built with Next.js 14, Tailwind, Framer Motion. Deploys free on Vercel.

## Quick Start

```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:3000
```

## Deploy

Push to GitHub → Import in Vercel → Deploy.

## Personalize

- Update data in `/data/*.json`
- Replace `/public/resume.pdf` with your resume
- Set email/links in `profile.json` & `ContactPanel.tsx`

## GitHub Projects (Free API)

Projects now support live sync from GitHub via `GET /api/projects` with a static JSON fallback.

### Optional environment variables

Create `.env.local`:

```bash
GITHUB_USERNAME=your-github-username
# Optional but recommended to avoid rate limits
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
# Optional: prioritize these repos in display order
GITHUB_FEATURED_REPOS=notifications-platform,geo-search-api
# Optional: exclude repos from portfolio list
GITHUB_EXCLUDED_REPOS=sandbox-repo
```

### Behavior

- If `GITHUB_USERNAME` is set, portfolio fetches public repos from GitHub.
- If missing, it tries to infer username from `data/profile.json` GitHub URL.
- If API fails or rate-limits, it falls back to `data/projects.json`.
- Repo data is cached on the server (`revalidate: 3600`).
- Portfolio surfaces source status (`Live` vs `Fallback`) in the Projects window.
