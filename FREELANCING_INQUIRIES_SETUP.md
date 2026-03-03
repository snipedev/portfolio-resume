# Freelancing Inquiry Collection System

## Overview

The freelancing services page includes a complete inquiry collection system that captures leads from potential clients interested in various services.

## Features

### Services Offered
1. **Full-Stack Development** - Web applications, APIs, databases, scalable architecture
2. **Backend Systems** - REST APIs, microservices, databases, optimization
3. **Cloud & DevOps** - AWS/GCP/Azure, Kubernetes, CI/CD pipelines, infrastructure
4. **Frontend Development** - React, Vue, Angular, responsive design, optimization
5. **Technical Architecture** - System design, scalability, performance planning
6. **Code Review & Mentoring** - Best practices, design patterns, team guidance

### Form Fields

The inquiry form collects:
- **Name** (required) - Client name
- **Email** (required) - Contact email
- **Company** (optional) - Company/organization name
- **Project Description** (required) - What they need built
- **Services Interested** (multi-select) - Which services they're interested in
- **Budget Range** (optional) - $0-25k, $25k-50k, $50k-100k, $100k+
- **Timeline** (optional) - Immediate, 1-3 months, 3-6 months, 6+ months

## Data Flow

```
User submits form
       ↓
Frontend validation (name, email, description required)
       ↓
POST /api/freelancing/inquiries
       ↓
Server-side validation
       ↓
Insert into Supabase freelancing_inquiries table
       ↓
Return success/error to frontend
       ↓
User sees confirmation message
```

## Components

### FreelancingServices (Main Page)
- Location: `components/FreelancingServices.tsx`
- Renders service grid with descriptions
- Displays inquiry form
- Shows success/error messages

### FreelancingInquiryForm
- Location: `components/FreelancingInquiryForm.tsx`
- Captures all inquiry data
- Validates required fields
- Handles multi-select for services
- Shows loading state while submitting
- Displays result messages with icons

### API Endpoint
- Location: `app/api/freelancing/inquiries/route.ts`
- **POST**: Submits new inquiry
  - Validates name, email, project_description
  - Saves to Supabase
  - Returns inserted record or error
- **GET**: Retrieves all inquiries (admin use)
  - Returns sorted by creation date (newest first)
  - Requires proper authentication setup

## Database Schema

```typescript
interface FreelancingInquiry {
  id: string;                          // UUID primary key
  created_at: string;                  // ISO timestamp
  name: string;                        // Required
  email: string;                       // Required
  company?: string;                    // Optional
  project_description: string;         // Required
  services_interested: string[];       // Array of service names
  budget_range?: string;               // One of: "$0-25k", "$25k-50k", "$50k-100k", "$100k+"
  timeline?: string;                   // One of: "Immediate", "1-3 months", "3-6 months", "6+ months"
  status: 'new' | 'contacted' | 'in_discussion' | 'won' | 'lost';  // Default: 'new'
}
```

## Setup Instructions

### 1. Create Supabase Table

Execute this SQL in your Supabase SQL Editor:

```sql
-- Create the freelancing_inquiries table
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

-- Create indexes for performance
CREATE INDEX idx_freelancing_inquiries_created_at 
ON freelancing_inquiries(created_at DESC);

CREATE INDEX idx_freelancing_inquiries_status 
ON freelancing_inquiries(status);

-- Enable RLS
ALTER TABLE freelancing_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (anyone can submit inquiries)
CREATE POLICY "Allow public inserts"
ON freelancing_inquiries
FOR INSERT
WITH CHECK (true);

-- Policy: Allow service role (server) to read all
CREATE POLICY "Allow service role to read"
ON freelancing_inquiries
FOR SELECT
USING (true);
```

### 2. Update Environment Variables

In your `.env` file, add:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Test the Form

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Click "Freelancing" in the dock or command palette
4. Fill out and submit the inquiry form
5. Verify data appears in Supabase: Database → freelancing_inquiries table

## API Usage Examples

### Submit an Inquiry

```bash
curl -X POST http://localhost:3000/api/freelancing/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Client",
    "email": "john@company.com",
    "company": "Tech Corp",
    "projectDescription": "Build a real-time dashboard with WebSockets",
    "servicesInterested": ["Full-Stack Development", "Backend Systems"],
    "budgetRange": "$50k-100k",
    "timeline": "3-6 months"
  }'
```

Response (Success):
```json
{
  "data": {
    "id": "uuid-here",
    "created_at": "2024-01-15T10:30:00Z",
    "name": "John Client",
    "email": "john@company.com",
    "company": "Tech Corp",
    "project_description": "Build a real-time dashboard with WebSockets",
    "services_interested": ["Full-Stack Development", "Backend Systems"],
    "budget_range": "$50k-100k",
    "timeline": "3-6 months",
    "status": "new"
  }
}
```

### Retrieve All Inquiries

```bash
curl http://localhost:3000/api/freelancing/inquiries
```

Response:
```json
{
  "data": [
    { "id": "uuid1", "name": "Client 1", ... },
    { "id": "uuid2", "name": "Client 2", ... }
  ]
}
```

## Error Handling

The form validates and shows clear error messages:

- **Missing name/email/description**: "Please fill in all required fields"
- **Invalid email format**: "Please enter a valid email address"
- **Server error**: "Error creating inquiry. Please try again."
- **Network error**: "Failed to connect. Please check your connection."

## Next Steps

### Short-term
1. ✅ Form submits inquiries to database
2. ✅ Inquiries stored with proper schema
3. ✅ Error handling implemented

### Medium-term
- Email notifications when inquiry submitted
- Email sent to your address with inquiry details
- Auto-acknowledgment email to client

### Long-term
- Admin dashboard to view/manage inquiries
- Filter and search inquiries
- Update inquiry status (contacted, won, lost)
- Export inquiries to CSV/report
- Analytics dashboard

## File Structure

```
data/
  freelancing.json              # Service configuration (titles, descriptions)

components/
  FreelancingServices.tsx       # Main page component
  FreelancingInquiryForm.tsx    # Form with validation

app/api/freelancing/
  inquiries/
    route.ts                    # POST (submit) / GET (retrieve) endpoints

lib/
  database.types.ts             # TypeScript interfaces for schema
  supabase.ts                   # Supabase client initialization
```

## Maintenance

### Monitor Inquiries
- Check Supabase dashboard regularly
- Review status of inquiries
- Follow up with promising leads

### Update Services
- Edit `data/freelancing.json` to add/remove services
- Update service descriptions as needed
- Form will automatically reflect changes

### Troubleshooting
- Check browser console for errors
- Review Vercel logs for server errors
- Check Supabase logs for database issues
- Verify environment variables are set correctly
