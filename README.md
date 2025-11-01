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

PanlasaLabs is an intelligent recipe generation platform powered by artificial intelligence. Built with modern web technologies, it provides users with a sophisticated conversational interface to create, customize, and manage culinary recipes through natural language interactions.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

PanlasaLabs is a full-stack web application that enables users to generate custom recipes through conversational AI interactions. The platform integrates secure authentication, cloud-based data storage, and real-time AI capabilities powered by Google's Gemini API.

### Core Features

- AI-powered recipe generation with conversational interface
- User authentication via credentials and GitHub OAuth
- Recipe management and history tracking
- Public recipe gallery
- Profile management with avatar upload (server-side upload to bypass RLS)
- User feedback and rating system
- Responsive design with Tailwind CSS

## System Architecture

### Technology Stack

| Component          | Technology            | Version |
| ------------------ | --------------------- | ------- |
| Frontend Framework | Next.js               | 15.5.6  |
| UI Library         | React                 | 19.1.0  |
| Language           | TypeScript            | 5       |
| Styling            | Tailwind CSS          | 4       |
| Authentication     | NextAuth.js           | 4.24.7  |
| Database           | Supabase (PostgreSQL) | 2.76.1  |
| AI Service         | Google Gemini API     | 1.27.0  |
| Icons              | React Icons           | 5.5.0   |

### Authentication Flow

1. **Credential-based Authentication**: User email/password stored in Supabase Auth
2. **OAuth Authentication**: GitHub Sign-In via NextAuth.js with deterministic UUID generation
3. **Session Management**: JWT-based sessions with 30-day expiration
4. **Profile Persistence**: User profile changes are preserved across OAuth logins
5. **Middleware Protection**: Route-level authentication enforcement

**Important Note on OAuth:** When users sign in with GitHub, their custom profile changes (name, avatar) are loaded from the database, not overwritten by GitHub's profile data. This ensures profile customization persists across sessions.

### Database Schema

**Users Table** (`public.users`)

- `id` (UUID, Primary Key - deterministically generated for OAuth users)
- `email` (Text, Unique)
- `name` (Text - preserved across OAuth logins)
- `first_name` (Text)
- `last_name` (Text)
- `avatar_url` (Text - preserved across OAuth logins)
- `provider` (Text)
- `auth_provider` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Recipes Table** (`public.recipes`)

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `title` (Text)
- `description` (Text)
- `ingredients` (JSONB)
- `instructions` (JSONB)
- `difficulty` (Text)
- `prep_time` (Integer)
- `cook_time` (Integer)
- `servings` (Integer)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Feedback Table** (`public.feedback`)

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key, nullable)
- `rating` (Integer, 1-5 stars, required)
- `message` (Text, required)
- `name` (Text, optional - for display)
- `avatar_url` (Text, optional - for display)
- `created_at` (Timestamp)

## Prerequisites

### Required Software

- Node.js 20.0.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm equivalent)
- Git

### Required Accounts

- Supabase account (database and storage)
- GitHub account (OAuth credentials via GitHub Developer Settings)
- Google AI Studio account (Gemini API key)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/amarpajarito/panlasalabs.git
cd panlasalabs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Execute the following SQL in Supabase SQL Editor:

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

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You can now use the application with proper RLS policies.
--
-- KEY POINTS:
-- • API routes use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS for admin operations)
-- • Client-side code uses NEXT_PUBLIC_SUPABASE_ANON_KEY (respects RLS)
-- • Avatar uploads go through /api/storage/upload-avatar (server-side with service role)
-- • User profiles persist across OAuth logins (name/avatar saved in database)
-- • GitHub OAuth generates deterministic UUIDs from provider + account ID
```

**Verification Steps:**

After running the SQL, verify your setup in Supabase SQL Editor:

```sql
-- 1. Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
-- Expected: feedback, recipes, users

-- 2. Check RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- Expected: All should show rowsecurity = true

-- 3. Check all policies exist
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
-- Expected: 9 policies total (2 users, 4 recipes, 2 feedback, 1 storage)

-- 4. Check storage bucket exists and is configured correctly
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'avatars';
-- Expected: 1 row with 5MB limit and allowed image types

-- 5. Check storage policies
SELECT policyname, operation
FROM storage.policies
WHERE bucket_id = 'avatars'
ORDER BY policyname;
-- Expected: 2 policies (view and manage)

-- 6. Check indexes exist
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
-- Expected: Indexes on user_id, created_at, email

-- 7. Check triggers exist
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
-- Expected: Triggers for updated_at on users and recipes
```

**Important Notes:**

- ✅ API routes use `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS for admin operations
- ✅ Client-side operations use `NEXT_PUBLIC_SUPABASE_ANON_KEY` which respects RLS policies
- ✅ RLS policies ensure users can only modify their own data
- ✅ Avatar uploads use server-side API route (`/api/storage/upload-avatar`) with service role key
- ✅ Storage policies allow public viewing but restrict uploads to authenticated requests via API
- ✅ Profile changes (name, avatar) persist across OAuth login sessions

## Configuration

### Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration (Required for both server and client)
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase

# NextAuth Configuration (Required for authentication)
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google Gemini AI (Required for recipe generation)
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
GEMINI_MODEL=gemini-2.5-flash
```

**Environment Variable Breakdown:**

| Variable                        | Purpose                        | Usage                         |
| ------------------------------- | ------------------------------ | ----------------------------- |
| `SUPABASE_URL`                  | Supabase project URL           | Server-side API routes        |
| `NEXT_PUBLIC_SUPABASE_URL`      | Same URL, client-accessible    | Client-side code              |
| `SUPABASE_SERVICE_ROLE_KEY`     | Admin key, bypasses RLS        | Server-side only (API routes) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key, respects RLS       | Client-side operations        |
| `GITHUB_CLIENT_ID`              | GitHub OAuth app ID            | OAuth authentication          |
| `GITHUB_CLIENT_SECRET`          | GitHub OAuth secret            | OAuth authentication          |
| `NEXTAUTH_SECRET`               | JWT signing key (min 32 chars) | Session encryption            |
| `NEXTAUTH_URL`                  | Application base URL           | Authentication callbacks      |
| `GEMINI_API_KEY`                | Google AI API key              | Recipe generation             |
| `GEMINI_MODEL`                  | Gemini model version           | AI model selection            |

**⚠️ Security Notes:**

- `SUPABASE_SERVICE_ROLE_KEY` has **full database access** - keep it secret, never expose to client
- `NEXTAUTH_SECRET` should be a **random 32+ character string** - generate with OpenSSL
- Never commit `.env.local` to version control (already in `.gitignore`)

### Obtaining Credentials

#### Supabase

1. Navigate to [Supabase Dashboard](https://app.supabase.com/)
2. Select project → Settings → API
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (Keep this secret!)

**Important:** The service role key has full database access and bypasses Row Level Security.

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in application details:
   - **Application name**: PanlasaLabs (or your choice)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** → `GITHUB_CLIENT_ID`
6. Click "Generate a new client secret" → Copy the secret → `GITHUB_CLIENT_SECRET`

**Important Notes:**

- For production, update your GitHub OAuth app with production callback URL (e.g., `https://yourdomain.com/api/auth/callback/github`)
- GitHub returns numeric user IDs, but our system generates deterministic UUIDs from them
- User profile changes (name, avatar) are saved to the database and preserved across logins
- GitHub profile data is only used for initial account creation, not for subsequent logins

#### Google Gemini API

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key" → Create API key
3. Copy the generated key → `GEMINI_API_KEY`
4. Use model name: `gemini-1.5-flash` → `GEMINI_MODEL`

**Model Options:**

- `gemini-1.5-flash` - Fast, cost-effective (recommended for development)
- `gemini-1.5-pro` - More capable, higher quality responses
- `gemini-2.0-flash-exp` - Experimental, latest features

#### Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output → `NEXTAUTH_SECRET`

**Why 32+ characters?** NextAuth.js requires a minimum of 32 characters for secure JWT token encryption.

## Running the Application

### Development Mode

```bash
npm run dev
```

Application will start on `http://localhost:3000` (or `http://localhost:3001` if port 3000 is in use)

**First Run Checklist:**

- ✅ Database tables created (run SQL from Step 3)
- ✅ `.env.local` file created with all required variables
- ✅ GitHub OAuth app configured with correct callback URL
- ✅ Supabase service role key added (required for API routes)
- ✅ Gemini API key is valid and has quota

**Testing the Setup:**

1. Visit `http://localhost:3000`
2. Click "Sign Up" and create an account
3. Try logging in with GitHub OAuth
4. Upload a profile avatar
5. Change your display name
6. Generate a recipe using AI
7. Submit feedback

If any step fails, check the [Troubleshooting](#troubleshooting) section below.

### Production Build

```bash
npm run build
npm run start
```

### Available Scripts

```bash
npm run dev     # Start development server with Turbopack
npm run build   # Create production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Project Structure

```
panlasalabs/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── profile/
│   ├── (public)/            # Public routes
│   │   ├── page.tsx         # Home
│   │   ├── about/
│   │   ├── allrecipes/
│   │   ├── contact/
│   │   └── recipe/
│   └── api/                 # API routes
│       ├── auth/            # NextAuth endpoints
│       ├── ai/              # AI generation endpoints
│       ├── recipes/         # Recipe CRUD
│       ├── users/           # User management
│       │   ├── profile/     # Profile update (PATCH/GET)
│       │   └── history/     # User recipe history
│       ├── feedback/        # Feedback submission (POST/GET)
│       └── storage/         # File storage
│           ├── upload-avatar/    # Server-side avatar upload
│           └── create-avatar-bucket/  # Bucket creation
├── components/
│   ├── auth/                # Authentication components
│   ├── features/            # Feature-specific components
│   │   ├── about/
│   │   ├── contact/
│   │   ├── home/
│   │   ├── profile/
│   │   └── recipe/
│   └── layout/              # Layout components
├── hooks/                   # Custom React hooks
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   └── supabase/
│       └── client.ts        # Supabase client
├── types/                   # TypeScript definitions
├── utils/                   # Utility functions
├── middleware.ts            # Next.js middleware
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies
```

## API Endpoints

### Authentication

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Sign up
- `GET /api/auth/session` - Get session
- `POST /api/auth/signout` - Sign out

### AI Generation

- `POST /api/ai/generate` - Generate recipe from prompt
- `GET /api/ai/prompted` - Get most prompted recipes

### Recipes

- `GET /api/recipes` - List recipes
- `POST /api/recipes` - Create recipe
- `GET /api/recipes/[id]` - Get recipe by ID
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe

### Users

- `GET /api/users/profile` - Get user profile (requires authentication)
- `PATCH /api/users/profile` - Update user profile (requires authentication)
- `GET /api/users/history` - Get recipe history (requires authentication)

### Storage

- `POST /api/storage/upload-avatar` - Upload avatar (server-side, bypasses RLS)
- `POST /api/storage/create-avatar-bucket` - Create avatars bucket (admin)

### Feedback

- `POST /api/feedback` - Submit feedback (anonymous or authenticated)
- `GET /api/feedback` - Get all feedback (enriched with user data)

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com/new)
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Update these variables for production deployment:

```env
# Production URLs
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Keep these secret (use Vercel environment variables)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GITHUB_CLIENT_SECRET=your-github-secret
NEXTAUTH_SECRET=your-nextauth-secret
GEMINI_API_KEY=your-gemini-key
```

**Production Checklist:**

- ✅ Update GitHub OAuth app with production callback URL: `https://yourdomain.com/api/auth/callback/github`
- ✅ Enable CORS in Supabase for your production domain
- ✅ Set all environment variables in Vercel dashboard
- ✅ Ensure RLS policies are properly configured
- ✅ Test authentication flow in production
- ✅ Verify avatar uploads work (server-side route)
- ✅ Check Gemini API quota and rate limits

### Manual Deployment

```bash
npm install -g vercel
vercel --prod
```

## Troubleshooting

### Installation Issues

**npm install fails**

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Turbopack build errors**

```bash
rm -rf .next
npm run dev
```

### Authentication Issues

**GitHub OAuth redirect not working**

1. Verify callback URL in GitHub OAuth app matches exactly:
   - Development: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://yourdomain.com/api/auth/callback/github`
2. Check `NEXTAUTH_URL` in `.env.local` matches your current URL
3. Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
4. Clear browser cookies and try again

**Session not persisting**

1. Verify `NEXTAUTH_SECRET` is set and is **at least 32 characters**:
   ```bash
   openssl rand -base64 32
   ```
2. Clear browser cookies (Application → Cookies in DevTools)
3. Restart dev server after changing `NEXTAUTH_SECRET`
4. Check browser console for NextAuth errors

**"You must be logged in to upload an avatar" error**

This error now should **NOT occur** because:

- Avatar uploads use server-side API route (`/api/storage/upload-avatar`)
- The route checks NextAuth session (not Supabase Auth session)
- Upload happens server-side with service role key (bypasses RLS)

If you still see this error:

1. Ensure you're logged in (check navbar shows your name)
2. Try logging out and back in to refresh session
3. Check browser console for network errors
4. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`

### Database Issues

**Cannot connect to Supabase**

1. Verify environment variables in `.env.local`:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```
2. Check if Supabase project is active (not paused)
3. Verify API keys are correct (from Project Settings → API)
4. Restart dev server after adding/changing environment variables

**Row Level Security (RLS) policy violation**

If you encounter "new row violates row-level security policy" errors:

1. **Verify all environment variables are set:**

   - `SUPABASE_URL` (server-side)
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side, bypasses RLS)
   - `NEXT_PUBLIC_SUPABASE_URL` (client-side)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-side, respects RLS)

2. **Check policies exist:**

   ```sql
   SELECT tablename, policyname, cmd
   FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename, policyname;
   ```

   Should return 9 policies (2 users, 4 recipes, 2 feedback, 1 storage)

3. **Verify storage policies:**

   ```sql
   SELECT policyname, operation
   FROM storage.policies
   WHERE bucket_id = 'avatars';
   ```

   Should return 2 policies (view and manage)

4. **For avatar upload issues specifically:**
   - Avatar uploads now use `/api/storage/upload-avatar` (server-side API route)
   - This route uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS
   - Ensure you're logged in (NextAuth session) before uploading
   - Check browser console for detailed error messages

**Common RLS Solutions:**

| Error                                                             | Solution                                                                            |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| "new row violates row-level security policy" on `storage.objects` | Avatar uploads now go through API route - ensure `SUPABASE_SERVICE_ROLE_KEY` is set |
| "new row violates row-level security policy" on `users`           | Service role policy should allow inserts - verify policy exists                     |
| "authentication required"                                         | Check NextAuth session is active - try logging out and back in                      |

**Profile changes not persisting after logout**

This is now **FIXED**. The issue was that OAuth logins were overwriting saved profile data with GitHub's profile.

**How it works now:**

- When you sign in with GitHub for the first time, your GitHub profile data is used
- When you change your name/avatar in profile settings, it's saved to the database
- On subsequent GitHub logins, your **saved database data** is used, not GitHub's data
- Your custom profile changes persist across all future logins

**To verify the fix:**

1. Change your name in profile settings
2. Log out completely
3. Log back in with GitHub
4. Your custom name should still appear (not the GitHub name)

**Email verification not working**

- Check Supabase Dashboard → Authentication → Email Templates
- Ensure SMTP is configured (or use Supabase's default email service)
- For development: Disable email confirmation in Auth Settings
- Check Supabase logs for email delivery issues

### API Issues

**Gemini API failing**

- Verify `GEMINI_API_KEY` is valid
- Check API quota in Google AI Studio
- Review rate limits

**Build fails**

```bash
npm run lint
rm -rf .next
npm run build
```

### Common Error Messages

| Error                                            | Cause                           | Solution                                                  |
| ------------------------------------------------ | ------------------------------- | --------------------------------------------------------- |
| `Module not found`                               | Missing dependencies            | Run `npm install`                                         |
| `Authentication failed`                          | Invalid credentials or env vars | Check `.env.local` has all required variables             |
| `Database connection error`                      | Wrong Supabase URL/keys         | Verify Supabase credentials from dashboard                |
| `new row violates row-level security policy`     | RLS blocking operation          | Use service role key in API routes; verify policies exist |
| `You must be logged in to upload an avatar`      | Session not detected            | Fixed - should not occur with current implementation      |
| `API quota exceeded`                             | Gemini API limit reached        | Check quota in Google AI Studio                           |
| `NEXTAUTH_SECRET must be at least 32 characters` | Secret too short                | Generate with `openssl rand -base64 32`                   |
| `Bucket not found`                               | Avatar bucket doesn't exist     | Run storage setup SQL or use bucket creation endpoint     |
| `GitHub OAuth user ID must be UUID`              | UUID type mismatch              | Fixed - deterministic UUID generation now implemented     |

### Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [GitHub Issues](https://github.com/amarpajarito/panlasalabs/issues)

---

## License

MIT License. See LICENSE file for details.

## Team

- **Amar Pajarito** - Lead Developer
- **Jae Gatmaitan** - UI/UX Designer
- **Aaron San Pedro** - UI/UX Designer
