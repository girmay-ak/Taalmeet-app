# Supabase Setup Guide

This guide will walk you through setting up your Supabase account, creating a project, and connecting it to the TaalMeet application.

## Table of Contents

1. [Supabase Account Setup](#1-supabase-account-setup)
2. [Project Configuration](#2-project-configuration)
3. [Getting Credentials](#3-getting-credentials)
4. [Saving Credentials Securely](#4-saving-credentials-securely)
5. [Verification](#5-verification)

---

## 1. Supabase Account Setup

### Step 1.1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"** button
3. Choose one of the following sign-up methods:
   - **GitHub** (Recommended - easiest)
   - **Google**
   - **Email** (requires email verification)

### Step 1.2: Verify Your Account

- If you signed up with email, check your inbox for verification email
- Click the verification link to activate your account
- You'll be redirected to the Supabase dashboard

---

## 2. Project Configuration

### Step 2.1: Create New Project

1. In the Supabase dashboard, click **"New Project"** button (top right)
2. Fill in the project details:

   **Project Name:**
   ```
   taalmeet-production
   ```
   *(You can also create separate projects for staging and development)*

   **Database Password:**
   - Click **"Generate a password"** or create your own
   - **IMPORTANT:** Save this password securely! You'll need it to connect to the database
   - Password requirements:
     - Minimum 12 characters
     - Mix of uppercase, lowercase, numbers, and special characters
     - Example: `TaalMeet2024!Secure#Pass`

   **Region:**
   - Select **"Europe West (London)"** or **"Europe West (Frankfurt)"**
   - Choose the region closest to your target users (Netherlands)
   - This affects database latency

   **Pricing Plan:**
   - Start with **"Free"** plan (good for development)
   - Upgrade later if needed

3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be provisioned

---

## 3. Getting Credentials

Once your project is created, you need to get the following credentials:

### Step 3.1: Get Project URL

1. In your project dashboard, go to **Settings** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. Under **"Project URL"**, you'll see:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
4. **Copy this URL** - you'll need it for your `.env` files

### Step 3.2: Get Anon (Public) Key

1. Still in **Settings > API**
2. Under **"Project API keys"**, find **"anon"** key
3. Click the **eye icon** to reveal the key
4. Click **"Copy"** button next to the key
5. This key is safe to use in client-side code (React Native app)

### Step 3.3: Get Service Role Key (Secret)

1. Still in **Settings > API**
2. Under **"Project API keys"**, find **"service_role"** key
3. Click the **eye icon** to reveal the key
4. Click **"Copy"** button next to the key
5. **⚠️ WARNING:** This key has admin privileges. **NEVER** commit it to git or use it in client-side code
6. Only use this key in secure server-side environments

### Step 3.4: Get Database Connection String (Optional)

1. Go to **Settings > Database**
2. Under **"Connection string"**, select **"URI"** tab
3. Copy the connection string (you may need this for migrations or direct database access)
4. Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

---

## 4. Saving Credentials Securely

### Step 4.1: Update .env.development

Open `.env.development` and add your credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Replace:**
- `xxxxxxxxxxxxx` with your actual project reference ID
- The keys with your actual keys from Supabase dashboard

### Step 4.2: Update .env.staging

If you have a separate staging project, update `.env.staging`:

```env
# Supabase Configuration (Staging)
SUPABASE_URL=https://xxxxxxxxxxxxx-staging.supabase.co
SUPABASE_ANON_KEY=your-staging-anon-key-here
SUPABASE_SERVICE_KEY=your-staging-service-key-here
```

### Step 4.3: Update .env.production

Update `.env.production` with your production credentials:

```env
# Supabase Configuration (Production)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key-here
SUPABASE_SERVICE_KEY=your-production-service-key-here
```

### Step 4.4: Verify .gitignore

Make sure your `.gitignore` includes:

```gitignore
# Environment variables
.env
.env.local
.env.development
.env.staging
.env.production
.env*.local
```

**⚠️ NEVER commit `.env` files to git!**

---

## 5. Verification

### Step 5.1: Run Connection Test

Run the connection test to verify everything works:

```bash
npm run test:connection
```

Or run the test directly:

```bash
npm test -- src/infrastructure/database/__tests__/connection.test.ts
```

### Step 5.2: Expected Output

If successful, you should see:

```
✓ Connection test (1234ms)
  ✓ Should connect to Supabase successfully
  ✓ Should query database successfully

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

### Step 5.3: Troubleshooting

**Error: "Invalid API key"**
- Check that you copied the keys correctly
- Make sure there are no extra spaces
- Verify you're using the correct key (anon vs service_role)

**Error: "Failed to fetch"**
- Check your internet connection
- Verify the SUPABASE_URL is correct
- Check if your Supabase project is paused (free tier projects pause after inactivity)

**Error: "Connection timeout"**
- Check your firewall settings
- Verify the region is correct
- Try accessing the Supabase dashboard to ensure the project is active

---

## Quick Reference: Where to Find Credentials

| Credential | Location in Supabase Dashboard |
|------------|-------------------------------|
| Project URL | Settings → API → Project URL |
| Anon Key | Settings → API → Project API keys → anon |
| Service Role Key | Settings → API → Project API keys → service_role |
| Database Password | Set during project creation (cannot be retrieved, only reset) |
| Connection String | Settings → Database → Connection string |

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use anon key** in client-side code (React Native app)
3. **Use service_role key** only in secure server environments
4. **Rotate keys** if they're accidentally exposed
5. **Use different projects** for development, staging, and production
6. **Enable Row Level Security (RLS)** on all tables
7. **Use environment-specific keys** for each environment

---

## Next Steps

After verifying the connection:

1. Set up database schema (tables, relationships)
2. Configure Row Level Security (RLS) policies
3. Set up authentication
4. Create database migrations
5. Set up real-time subscriptions (if needed)

---

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

