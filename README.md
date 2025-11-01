<div align="center">
  <img src="public/images/logo.svg" alt="PanlasaLabs Logo" width="450"/>

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.76.1-green)](https://supabase.io/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-4.24.7-purple)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

PanlasaLabs is an AI-powered recipe generation platform that enables users to create, customize, and manage recipes through natural language interactions. The application features secure authentication, cloud storage, and real-time AI capabilities powered by Google's Gemini API.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Prerequisites

**Required Software**

- Node.js 20.0.0 or higher
- npm 9.0.0 or higher
- Git

**Required Accounts**

- [Supabase](https://app.supabase.com/) account
- [GitHub](https://github.com/) account (for OAuth)
- [Google AI Studio](https://aistudio.google.com/) account (for Gemini API)

## Installation

**1. Clone the Repository**

```bash
git clone https://github.com/amarpajarito/panlasalabs.git
cd panlasalabs
```

**2. Install Dependencies**

```bash
npm install
```

## Database Setup

Execute the following SQL in your Supabase SQL Editor to set up the required tables, policies, and storage:

```sql
-- ============================================
-- PANLASALABS DATABASE SETUP - FRESH INSTALL
-- ============================================

-- Step 1: Create Tables
-- ============================================

-- Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'credentials',
  auth_provider TEXT DEFAULT 'credentials',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB DEFAULT '[]'::jsonb,
  instructions JSONB DEFAULT '[]'::jsonb,
  cuisine TEXT,
  difficulty TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX idx_recipes_created_at ON public.recipes(created_at DESC);
CREATE INDEX idx_recipes_cuisine ON public.recipes(cuisine);
CREATE INDEX idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX idx_users_email ON public.users(email);

-- Step 2: Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies
-- ============================================

-- USERS TABLE POLICIES
-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow service role to insert users (for OAuth and registration)
CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT
  WITH CHECK (true);

-- RECIPES TABLE POLICIES
-- Allow anyone to read all recipes (public gallery)
CREATE POLICY "Anyone can read recipes" ON public.recipes
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own recipes
CREATE POLICY "Users can insert own recipes" ON public.recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own recipes
CREATE POLICY "Users can update own recipes" ON public.recipes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own recipes
CREATE POLICY "Users can delete own recipes" ON public.recipes
  FOR DELETE
  USING (auth.uid() = user_id);

-- FEEDBACK TABLE POLICIES
-- Allow anyone to insert feedback (even anonymous users)
CREATE POLICY "Anyone can insert feedback" ON public.feedback
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read all feedback (for public display)
CREATE POLICY "Anyone can read all feedback" ON public.feedback
  FOR SELECT
  USING (true);

-- Step 4: Setup Storage for Avatars
-- ============================================

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies for avatars bucket
-- Note: Avatar uploads are handled server-side via API route with service role key
-- This bypasses RLS and ensures consistent authentication across NextAuth sessions

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Service role can manage avatars" ON storage.objects
  FOR ALL
  USING (bucket_id = 'avatars')
  WITH CHECK (bucket_id = 'avatars');

-- Step 5: Create Helper Functions
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to recipes table
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Create Storage Bucket Trigger (Optional but recommended)
-- ============================================
-- This ensures the avatars bucket exists even if the INSERT above was skipped

CREATE OR REPLACE FUNCTION ensure_avatar_bucket()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'avatars',
      'avatars',
      true,
      5242880,
      ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Run the function to ensure bucket exists
SELECT ensure_avatar_bucket();
```

**Verify Database Setup**

Run these queries to confirm everything is configured correctly:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public';

-- Check storage bucket
SELECT id, name, public FROM storage.buckets WHERE id = 'avatars';
```

## Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth Keys
NEXTAUTH_SECRET=

# OAuth provider credentials
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Gemini API Keys
GEMINI_API_KEY=
GEMINI_MODEL=models/gemini-2.5-flash

# Optional: set to your app URL
NEXTAUTH_URL=
```

**Obtaining API Credentials**

1. **Supabase**

   - Go to [Supabase Dashboard](https://app.supabase.com/) → Project Settings → API
   - Copy Project URL to `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `service_role` key to `SUPABASE_SERVICE_ROLE_KEY`

2. **GitHub OAuth**

   - Go to [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App
   - Set Homepage URL: `http://localhost:3000`
   - Set Callback URL: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and Client Secret

3. **Google Gemini API**

   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create an API key
   - Copy the generated key

4. **NextAuth Secret**
   - Generate using: `openssl rand -base64 32`

**Next.js Image Configuration**

Update `next.config.ts` to allow images from your Supabase domain:

```typescript
const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "your-project-id.supabase.co", // Replace with your actual Supabase project ID
    ],
  },
};
```

## Running the Application

**Development Server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

**Production Build**

```bash
npm run build
npm start
```

## Troubleshooting

**Common Issues**

| Issue                     | Solution                                           |
| ------------------------- | -------------------------------------------------- |
| Module not found          | Run `npm install`                                  |
| Authentication failed     | Verify all environment variables in `.env.local`   |
| Database connection error | Check Supabase URL and keys                        |
| RLS policy violation      | Ensure `SUPABASE_SERVICE_ROLE_KEY` is set          |
| Image hostname error      | Add Supabase hostname to `next.config.ts` domains  |
| Session not persisting    | Ensure `NEXTAUTH_SECRET` is at least 32 characters |

**Image Configuration Error**

If you see "hostname not configured under images" error:

1. Open `next.config.ts`
2. Add your Supabase project hostname to the `domains` array
3. Restart the development server

**Database Verification**

```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Verify RLS policies
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

**Additional Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## License

MIT License

## Contributors

- Amar Pajarito - Lead Developer
- Jae Gatmaitan - UI/UX Designer
- Aaron San Pedro - UI/UX Designer
