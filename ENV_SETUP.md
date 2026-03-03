# Environment Setup Guide

## Overview

This project requires environment variables for GitHub integration and Supabase database connectivity. Never commit actual secrets to the repository.

## Local Development Setup

1. **Copy the template:**

   ```bash
   cp .env.example .env
   ```

2. **Fill in your actual values:**
   - `GITHUB_USERNAME`: Your GitHub username
   - `GITHUB_TOKEN`: A GitHub personal access token (with appropriate scopes)
   - All `NEXT_PUBLIC_SUPABASE_*`: From your Supabase project settings
   - All `SUPA_POSTGRES_*`: Database connection strings from Supabase
   - All `SUPABASE_*`: Secret keys from Supabase project settings

3. **Important Security Notes:**
   - The `.env` file is in `.gitignore` and should NEVER be committed
   - Variables starting with `NEXT_PUBLIC_` are safe to expose (frontend only)
   - All other variables are sensitive and should only be in `.env` locally or Vercel secrets
   - GitHub will block pushes if secrets are detected in commits

## Getting Supabase Variables

### Public Keys (safe for `.env`)

1. Go to your Supabase project dashboard
2. Settings → API
3. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy `Web public key (anon)` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Secret Keys (server-side only)

1. Settings → API
2. Copy `Service role key` → `SUPABASE_SERVICE_ROLE_KEY`
3. Settings → Project Settings → JWT Secret → `SUPABASE_JWT_SECRET`

### Database Connection

1. Settings → Database
2. Copy connection string → Update all `SUPA_POSTGRES_*` variables

## Production Deployment (Vercel)

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add all variables from your `.env.example`
4. Mark `NEXT_PUBLIC_*` variables for all environments (Development, Preview, Production)
5. Mark other variables for Production only
6. Redeploy to apply changes

## Troubleshooting

### "SSL connection error" from Supabase

- Ensure `SUPABASE_SERVICE_ROLE_KEY` is correctly set
- Verify the database connection string format

### Form submissions failing

- Check that `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure Supabase table `freelancing_inquiries` exists
- Check Vercel logs for specific error messages

### GitHub push rejected with "secret detected"

- Never commit actual `.env` file
- Use `.env.example` as template
- If accidentally committed: See git reset instructions in project docs
