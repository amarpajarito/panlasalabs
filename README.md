<div align="center">
  <img src="public/images/logo.svg" alt="PanlasaLabs Logo" width="200"/>

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

PanlasaLabs is an intelligent recipe generation platform powered by artificial intelligence. Built with modern web technologies, it provides users with a sophisticated conversational interface to create, customize, and manage culinary recipes through natural language interactions.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Installation Guide](#installation-guide)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

PanlasaLabs leverages Google's Gemini AI to deliver an interactive recipe generation experience. The platform combines secure authentication, cloud-based data storage, and real-time AI capabilities to help users discover and create personalized recipes.

### Key Capabilities

- Generate custom recipes through conversational AI interactions
- Refine and iterate on recipe variations based on user preferences
- Manage user profiles with secure authentication
- Store and retrieve recipes from a centralized database
- Access a public gallery of community-generated recipes

## ✨ Features

### Core Functionality

- **AI-Powered Recipe Generation**
  - Natural language conversation interface with AI chat system
  - Recipe refinement and variation generation
  - Context-aware suggestions and modifications
  - Quick prompt suggestions for faster interactions
- **User Authentication & Authorization**
  - Credential-based authentication (email/password)
  - OAuth 2.0 integration with Google Sign-In
  - Secure session management via NextAuth.js
- **Database & Cloud Storage**
  - PostgreSQL database powered by Supabase
  - Cloud storage for user avatars and media assets
  - Real-time data synchronization
- **User Profile Management**
  - Editable user information and preferences
  - Profile picture upload and management
  - Personal recipe history and favorites
- **Public Recipe Gallery**
  - Browse community-generated recipes at `/allrecipes`
  - View trending and most prompted recipes
  - Search and filter functionality
  - Responsive grid layout with recipe cards
- **Responsive Design**
  - Mobile-first approach using Tailwind CSS with DaisyUI
  - Optimized for desktop, tablet, and mobile devices
  - Accessible UI components

## 🛠️ Technology Stack

| Category               | Technology                                                   | Version |
| ---------------------- | ------------------------------------------------------------ | ------- |
| **Frontend Framework** | [Next.js](https://nextjs.org/)                               | 15.5.6  |
| **React**              | [React](https://react.dev/)                                  | 19.1.0  |
| **Styling**            | [Tailwind CSS](https://tailwindcss.com/)                     | 4.x     |
| **UI Components**      | [DaisyUI](https://daisyui.com/)                              | 5.3.7   |
| **Icons**              | [React Icons](https://react-icons.github.io/react-icons/)    | 5.5.0   |
| **Backend Services**   | [Supabase](https://supabase.io/) (PostgreSQL, Storage, Auth) | 2.76.1  |
| **Authentication**     | [NextAuth.js](https://next-auth.js.org/)                     | 4.24.7  |
| **AI Integration**     | [Google Gemini API](https://ai.google.dev/)                  | 1.27.0  |
| **Language**           | [TypeScript](https://www.typescriptlang.org/)                | 5.x     |
| **Package Manager**    | npm/yarn/pnpm                                                | -       |

## 💻 System Requirements

Before beginning the installation process, ensure your development environment meets the following requirements:

### Required Software

- **Node.js**: Version 20.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.0.0 or higher (included with Node.js)
  - _Alternative_: yarn 1.22+ or pnpm 8.0+
- **Git**: Latest stable version ([Download](https://git-scm.com/))

### Recommended Tools

- **Code Editor**: Visual Studio Code with recommended extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
- **Database Client**: Supabase Studio (web-based) or pgAdmin for database management

### External Service Accounts

You will need accounts with the following services:

1. **Supabase** - Database and storage backend ([Sign up](https://supabase.com/))
2. **Google Cloud Platform** - OAuth authentication ([Console](https://console.cloud.google.com/))
3. **Google AI Studio** - Gemini API access ([Get started](https://ai.google.dev/))

## 📦 Installation Guide

Follow these steps carefully to set up the project on your local development environment.

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-username/panlasalabs.git

# Or clone via SSH (if configured)
git clone git@github.com:your-username/panlasalabs.git

# Navigate to project directory
cd panlasalabs
```

### Step 2: Install Dependencies

Install all required packages defined in `package.json`:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

**Note**: This process may take several minutes depending on your internet connection.

### Step 3: Database Setup

#### Configure Supabase Database

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or select an existing one
3. Navigate to **SQL Editor**
4. Execute the provided schema file (if available) or create required tables:

```sql
-- Example table structure (adjust based on your actual schema)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB,
  instructions JSONB,
  difficulty TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add other necessary tables
```

5. Set up **Storage Buckets** for user avatars:
   - Navigate to Storage → Create bucket → Name: `avatars`
   - Set appropriate access policies

## ⚙️ Configuration

### Environment Variables Setup

Create a `.env.local` file in the project root directory. This file stores sensitive configuration data and should **never** be committed to version control.

```bash
# Create the environment file
touch .env.local
```

Add the following variables with your actual credentials:

```env
# ========================================
# Supabase Configuration
# ========================================
# Your Supabase project URL (found in Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase anonymous public key (found in Project Settings → API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# ========================================
# NextAuth.js Configuration
# ========================================
# Google OAuth 2.0 Client ID (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Google OAuth 2.0 Client Secret (from Google Cloud Console)
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth secret key - generate using: openssl rand -base64 32
AUTH_SECRET=your-generated-secret-key-minimum-32-characters

# Application URL (change for production deployment)
NEXTAUTH_URL=http://localhost:3000

# ========================================
# Google Gemini AI Configuration
# ========================================
# Gemini API key (from Google AI Studio)
GEMINI_API_KEY=your-gemini-api-key
```

### Obtaining Required API Keys

#### 1. Supabase Credentials

1. Navigate to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 2. Google OAuth Credentials

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen (if first time)
6. Select **Web application** as application type
7. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google  # For production
   ```
8. Copy **Client ID** and **Client Secret**

#### 3. Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **Get API key** in the top navigation
3. Create a new API key or use existing
4. Copy the generated API key

#### 4. Generate AUTH_SECRET

Run the following command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `AUTH_SECRET` value.

## 🚀 Running the Application

### Development Mode

Start the development server with Turbopack enabled for faster compilation:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The application will be available at **http://localhost:3000**

**Development Features:**

- Hot module replacement (HMR) with Turbopack
- Detailed error messages
- Source maps for debugging
- React Developer Tools support
- Fast refresh for instant updates

### Production Build

Create an optimized production build:

```bash
# Build the application (with Turbopack)
npm run build

# Start the production server
npm run start
```

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Create production build with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint code analysis
```

## 📁 Project Structure

```
panlasalabs/
├── .env.local                    # Environment variables (not in repo)
├── .git/                         # Git repository
├── .gitignore                    # Git ignore rules
├── .next/                        # Next.js build output
├── app/                          # Next.js 15 app directory
│   ├── (auth)/                   # Auth route group
│   │   ├── layout.tsx           # Auth layout wrapper
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── profile/
│   │   │   └── page.tsx         # User profile page
│   │   └── signup/
│   │       └── page.tsx         # Sign up page
│   ├── (public)/                # Public route group
│   │   ├── layout.tsx           # Public layout wrapper
│   │   ├── page.tsx             # Home page
│   │   ├── about/
│   │   │   └── page.tsx         # About page
│   │   ├── allrecipes/
│   │   │   └── page.tsx         # All recipes gallery
│   │   ├── contact/
│   │   │   └── page.tsx         # Contact page
│   │   └── recipe/
│   │       └── page.tsx         # Recipe page
│   ├── api/                     # API routes
│   │   ├── ai/
│   │   │   ├── generate/
│   │   │   │   └── route.ts     # AI recipe generation endpoint
│   │   │   └── prompted/
│   │   │       └── route.ts     # AI prompted recipes endpoint
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts     # NextAuth.js configuration
│   │   ├── feedback/
│   │   │   └── route.ts         # Feedback submission endpoint
│   │   ├── recipes/
│   │   │   └── [id]/
│   │   │       └── route.ts     # Recipe CRUD operations
│   │   ├── storage/
│   │   │   └── create-avatar-bucket/
│   │   │       └── route.ts     # Avatar storage management
│   │   └── users/
│   │       ├── route.ts         # User operations
│   │       ├── history/
│   │       │   └── route.ts     # User recipe history
│   │       └── profile/
│   │           └── route.ts     # Profile management
│   ├── favicon.ico              # Site favicon
│   ├── globals.css              # Global CSS styles
│   ├── layout.tsx               # Root layout component
│   └── providers.tsx            # Context providers wrapper
├── components/                  # Reusable React components
│   ├── auth/
│   │   ├── AuthFormContainer.tsx    # Auth form wrapper
│   │   ├── LoginSection.tsx         # Login form section
│   │   ├── SignupSection.tsx        # Signup form section
│   │   ├── SocialButtons.tsx        # OAuth buttons
│   │   └── TextInput.tsx            # Input field component
│   ├── features/
│   │   ├── about/
│   │   │   ├── AboutCTASection.tsx
│   │   │   ├── AboutHeroSection.tsx
│   │   │   ├── StorySection.tsx
│   │   │   ├── TeamSection.tsx
│   │   │   └── ValuesSection.tsx
│   │   ├── contact/
│   │   │   ├── ContactFormSection.tsx
│   │   │   ├── ContactHeroSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   └── FeedbackSection.tsx
│   │   ├── home/
│   │   │   ├── AIRecipeGeneratorSection.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── FeedbackReviewsSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── TrendingRecipeSection.tsx
│   │   │   └── WhatWeDoSection.tsx
│   │   └── recipe/
│   │       ├── ai-chat/          # AI chat implementation
│   │       │   ├── AIRecipeChat.tsx
│   │       │   └── components/
│   │       │       ├── ChatHeader.tsx
│   │       │       ├── MessageList.tsx
│   │       │       ├── MessageBubble.tsx
│   │       │       ├── LoadingIndicator.tsx
│   │       │       ├── QuickPrompts.tsx
│   │       │       ├── ChatInput.tsx
│   │       │       └── RecipePanel.tsx
│   │       ├── AllRecipesSection.tsx
│   │       ├── DifficultyBadge.tsx
│   │       ├── GenerateRecipeSection.tsx
│   │       ├── MostPromptedRecipeSection.tsx
│   │       ├── MustTryRecipesSection.tsx
│   │       ├── PublicGenerateRecipe.tsx
│   │       └── RecipeCard.tsx
│   └── layout/
│       ├── Footer.tsx               # Site footer
│       ├── NavWrapper.tsx           # Navigation wrapper
│       ├── PrivateNavbar.tsx        # Authenticated navbar
│       └── PublicNavbar.tsx         # Public navbar
├── hooks/                       # Custom React hooks
│   ├── useRecipeHistory.ts      # Recipe history management
│   ├── useScrollManagement.ts   # Scroll behavior
│   └── useRecipeEvents.ts       # Recipe event handling
├── lib/                         # Utility functions and configs
│   ├── auth.ts                  # Auth utilities
│   └── supabase/
│       └── client.ts            # Supabase client initialization
├── middleware.ts                # Next.js middleware
├── next-env.d.ts               # Next.js TypeScript declarations
├── next.config.ts              # Next.js configuration
├── package-lock.json           # Dependency lock file
├── package.json                # Project dependencies
├── postcss.config.mjs          # PostCSS configuration
├── public/                     # Static assets
│   └── images/
│       ├── gemini-logo.svg
│       ├── logo.svg
│       ├── testimonial-user-logo.png
│       ├── about/
│       │   ├── Aaron San Pedro.png
│       │   ├── about-1.jpg
│       │   ├── Amar Pajarito.png
│       │   └── Jae Gatmaitan.png
│       ├── home/
│       │   ├── hero-1.jpg
│       │   ├── hero-2.jpg
│       │   ├── hero-3.jpg
│       │   └── hero-4.jpg
│       └── recipe/
│           ├── Adobo.png
│           ├── Bagnet.png
│           ├── BicolExpress.jpg
│           ├── ChickenInasal.jpeg
│           ├── HaloHalo.jpg
│           ├── Kare-Kare.png
│           ├── LumpiaShanghai.jpg
│           ├── PancitBihon.png
│           ├── recipe-1.png
│           ├── recipe-2.png
│           ├── recipe-3.png
│           ├── recipe-4.png
│           ├── Sinigang.png
│           └── Sisig.png
├── README.md                   # This file
├── tsconfig.json              # TypeScript configuration
├── types/                     # TypeScript type definitions
│   ├── chat.ts                # Chat-related types
│   ├── next-auth.d.ts         # NextAuth type extensions
│   ├── recipe.ts              # Recipe types
│   └── user.ts                # User types
├── utils/                     # Utility helpers
│   └── recipe/
│       └── recipeNormalizer.ts # Recipe data normalization
└── node_modules/              # Dependencies (not tracked)
```

### Key Directories Explained

- **`app/`**: Next.js 15 App Router with route groups for organized routing
- **`components/`**: Organized into `auth/`, `features/`, and `layout/` for better separation
- **`hooks/`**: Custom React hooks for shared logic
- **`lib/`**: Configuration and initialization files for external services
- **`types/`**: TypeScript type definitions for type safety
- **`utils/`**: Helper functions and utilities
- **`public/images/`**: Static image assets organized by section

## 🌐 Deployment

### Vercel Deployment (Recommended)

PanlasaLabs is optimized for deployment on [Vercel](https://vercel.com/), the platform created by Next.js developers.

#### Quick Deploy

1. Push your code to GitHub, GitLab, or Bitbucket
2. Visit [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Configure environment variables from `.env.local`
5. Click **Deploy**

#### Manual Configuration

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from your terminal
vercel

# Deploy to production
vercel --prod
```

### Environment Variables for Production

Ensure all environment variables are properly configured in your deployment platform:

- Update `NEXTAUTH_URL` to your production domain
- Add production Google OAuth redirect URI
- Verify all API keys are production-ready
- Enable appropriate CORS settings in Supabase
- Configure proper Row Level Security (RLS) policies

### Build Optimization

Next.js 15 with Turbopack provides significant performance improvements:

- Faster cold starts
- Improved incremental builds
- Better memory usage
- Optimized production bundles

### Other Deployment Options

- **Netlify**: Supports Next.js with build plugins
- **AWS Amplify**: Full-stack deployment option
- **Digital Ocean App Platform**: Container-based deployment
- **Self-hosted**: Use `npm run build` and `npm run start` with a Node.js server

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Installation Issues

**Problem**: `npm install` fails with permission errors

```bash
# Solution: Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Turbopack build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Authentication Issues

**Problem**: Google OAuth redirect not working

- Verify redirect URI matches exactly in Google Cloud Console
- Check `NEXTAUTH_URL` is set correctly
- Ensure OAuth consent screen is published (not in testing)

**Problem**: NextAuth session not persisting

- Verify `AUTH_SECRET` is properly set and sufficiently complex
- Check browser cookies are enabled
- Clear browser cache and cookies
- Ensure NextAuth version 4.24.7 compatibility

#### Database Connection Issues

**Problem**: Cannot connect to Supabase

- Verify `NEXT_PUBLIC_SUPABASE_URL` format is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the public `anon` key
- Ensure project is not paused in Supabase dashboard
- Check Row Level Security (RLS) policies if queries fail
- Verify Supabase client version compatibility (2.76.1)

#### API Issues

**Problem**: Gemini API requests failing

- Verify `GEMINI_API_KEY` is valid and active
- Check API quota limits in Google AI Studio
- Ensure API is enabled for your project
- Review rate limiting and implement backoff strategies
- Check @google/genai package version (1.27.0)

#### Build Errors

**Problem**: Production build fails

```bash
# Check for TypeScript errors
npm run lint

# Verify all dependencies are installed
npm install

# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

**Problem**: React 19 compatibility issues

- Ensure all packages support React 19.1.0
- Check for peer dependency warnings
- Update incompatible packages

#### Styling Issues

**Problem**: Tailwind CSS classes not working

- Verify Tailwind CSS 4.x configuration
- Check DaisyUI theme settings
- Clear browser cache
- Rebuild the project

### Getting Help

If you encounter issues not covered here:

1. Check the [Next.js 15 Documentation](https://nextjs.org/docs)
2. Review [Supabase Documentation](https://supabase.com/docs)
3. Check [React 19 Documentation](https://react.dev/)
4. Search existing [GitHub Issues](https://github.com/your-username/panlasalabs/issues)
5. Create a new issue with:
   - Detailed problem description
   - Steps to reproduce
   - Environment information (Node.js version, OS, etc.)
   - Error messages or logs
   - Package versions

## 🤝 Contributing

Contributions are welcome and appreciated! To contribute to PanlasaLabs:

### Contribution Process

1. **Fork the repository**

   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/your-username/panlasalabs.git
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

   - Follow existing code style and conventions
   - Write clear, descriptive commit messages
   - Add tests if applicable
   - Ensure TypeScript types are properly defined

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: descriptive commit message"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Wait for code review

### Coding Standards

- Follow the existing code style
- Use TypeScript for type safety (TypeScript 5.x)
- Write meaningful variable and function names
- Comment complex logic
- Keep components small and focused
- Use React 19 best practices
- Run linting before committing: `npm run lint`
- Utilize route groups for organized routing
- Follow Next.js 15 App Router conventions

### Commit Message Format

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Areas for Contribution

- 🐛 Bug fixes and issue resolution
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements with DaisyUI
- ✅ Test coverage expansion
- 🌐 Internationalization (i18n)
- ♿ Accessibility improvements
- 🚀 Performance optimizations

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Team

### Project Lead - Full Stack Developer

- **Amar Pajarito** - Lead Developer & Architecture

### UI/UX Designers

- **Jae Gatmaitan** - UI/UX Designer
- **Aaron San Pedro** - UI/UX Designer

## 📞 Contact & Support

- **Project Repository**: [GitHub](https://github.com/your-username/panlasalabs)
- **Issue Tracker**: [GitHub Issues](https://github.com/your-username/panlasalabs/issues)
- **Documentation**: [Wiki](https://github.com/your-username/panlasalabs/wiki)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework with App Router
- [React](https://react.dev/) - UI library
- [Supabase](https://supabase.io/) - Backend infrastructure
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication solution
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
