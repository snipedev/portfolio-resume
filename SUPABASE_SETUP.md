# Supabase Configuration Guide

## Project Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Choose a region close to your users
4. Set a strong database password

### 2. Get API Keys
1. Go to Settings → API
2. Note the following:
   - **Project URL**: Supabase base URL endpoint
   - **Web public key (anon)**: For client-side operations
   - **Service role key**: For server-side operations (sensitive!)
   - **JWT Secret**: Under Project Settings → JWT Secret

### 3. Initialize Client and Server Libraries

The project uses `@supabase/supabase-js` for both client and server:

**Client-side** (`lib/supabase.ts`):
```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Server-side** (in API routes):
```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
```

## Database Schema

### Required Tables

#### `freelancing_inquiries`
Stores inquiries from the freelancing services page.

```sql
CREATE TABLE freelancing_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_description TEXT NOT NULL,
  services_interested TEXT[] DEFAULT '{}',
  budget_range TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_discussion', 'won', 'lost'))
);

-- Create index for faster queries
CREATE INDEX idx_freelancing_inquiries_created_at 
ON freelancing_inquiries(created_at DESC);

CREATE INDEX idx_freelancing_inquiries_status 
ON freelancing_inquiries(status);
```

### Row Level Security (RLS)

Recommended policies:

```sql
-- Allow public to insert inquiries (no auth required)
CREATE POLICY "Allow public inserts"
ON freelancing_inquiries
FOR INSERT
WITH CHECK (true);

-- Allow authenticated admin to view all
CREATE POLICY "Allow admin to read all"
ON freelancing_inquiries
FOR SELECT
USING (auth.role() = 'authenticated');

-- Restrict updates/deletes to admin only
CREATE POLICY "Allow admin to update"
ON freelancing_inquiries
FOR UPDATE
USING (auth.role() = 'authenticated');
```

## Testing

### API Endpoints

**Submit inquiry:**
```bash
curl -X POST http://localhost:3000/api/freelancing/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "client@example.com",
    "company": "Tech Corp",
    "projectDescription": "Build a web app",
    "servicesInterested": ["Full-Stack Development"],
    "budgetRange": "$50k-$100k",
    "timeline": "3-6 months"
  }'
```

**Retrieve inquiries:**
```bash
curl http://localhost:3000/api/freelancing/inquiries
```

## Common Issues

### SSL/TLS Connection Errors
- Ensure you're using the correct `SUPABASE_SERVICE_ROLE_KEY`
- Verify the `NEXT_PUBLIC_SUPABASE_URL` format
- Check that Supabase project is active

### Table Not Found Errors
- Verify the SQL schema was executed in Supabase SQL Editor
- Check table name matches exactly (case-sensitive in some contexts)
- Ensure RLS policies aren't blocking operations

### Authentication Errors
- For public inserts: Don't use `auth.uid()` checks without RLS policies
- For admin operations: Verify service role key has correct permissions
- Check that JWT secret is configured correctly

## Optional Enhancements

- Email notifications on inquiry submission
- Automatic sorting by inquiry status
- Admin dashboard for managing inquiries
- Analytics and reporting
