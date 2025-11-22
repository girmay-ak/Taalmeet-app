# Supabase Setup Checklist

Use this checklist to set up your Supabase database connection step by step.

## ✅ Pre-Setup

- [ ] I have a GitHub, Google, or email account ready
- [ ] I know which region is closest to my users (Europe West for Netherlands)

---

## 📋 Step 1: Create Supabase Account

- [ ] Go to https://supabase.com
- [ ] Click "Start your project" or "Sign Up"
- [ ] Sign up using GitHub (recommended), Google, or Email
- [ ] Verify email if using email sign-up
- [ ] Successfully logged into Supabase dashboard

---

## 📋 Step 2: Create Project

- [ ] Click "New Project" button
- [ ] Enter project name: `taalmeet-production`
- [ ] Generate or create a strong database password
  - [ ] Password saved securely (you cannot retrieve it later!)
  - [ ] Password is at least 12 characters
  - [ ] Password contains uppercase, lowercase, numbers, and special characters
- [ ] Select region: **Europe West (London)** or **Europe West (Frankfurt)**
- [ ] Select pricing plan: **Free** (for now)
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for project provisioning
- [ ] Project status shows "Active"

---

## 📋 Step 3: Get Credentials

### 3.1 Project URL
- [ ] Go to **Settings** (gear icon in left sidebar)
- [ ] Click **"API"** in settings menu
- [ ] Find **"Project URL"** section
- [ ] Copy the URL (format: `https://xxxxxxxxxxxxx.supabase.co`)
- [ ] URL copied to clipboard: `___________________________`

### 3.2 Anon (Public) Key
- [ ] Still in **Settings > API**
- [ ] Find **"Project API keys"** section
- [ ] Find **"anon"** key
- [ ] Click eye icon to reveal key
- [ ] Click "Copy" button
- [ ] Anon key copied to clipboard: `___________________________`

### 3.3 Service Role Key (Secret)
- [ ] Still in **Settings > API**
- [ ] Find **"service_role"** key
- [ ] Click eye icon to reveal key
- [ ] Click "Copy" button
- [ ] ⚠️ **Service role key copied** (keep this secret!)
- [ ] Service role key copied to clipboard: `___________________________`

---

## 📋 Step 4: Save Credentials

### 4.1 Update .env.development
- [ ] Open `.env.development` file
- [ ] Add/update `SUPABASE_URL` with your project URL
- [ ] Add/update `SUPABASE_ANON_KEY` with your anon key
- [ ] Add/update `SUPABASE_SERVICE_KEY` with your service role key
- [ ] Save the file
- [ ] Verify file is in `.gitignore` (should not be committed)

### 4.2 Update .env.staging (if applicable)
- [ ] If you have a staging project, open `.env.staging`
- [ ] Add staging credentials
- [ ] Save the file

### 4.3 Update .env.production
- [ ] Open `.env.production` file
- [ ] Add/update `SUPABASE_URL` with your production project URL
- [ ] Add/update `SUPABASE_ANON_KEY` with your production anon key
- [ ] Add/update `SUPABASE_SERVICE_KEY` with your production service role key
- [ ] Save the file

### 4.4 Verify .gitignore
- [ ] Open `.gitignore` file
- [ ] Verify these lines exist:
  ```
  .env
  .env.local
  .env.development
  .env.staging
  .env.production
  .env*.local
  ```
- [ ] If missing, add them

---

## 📋 Step 5: Verify Connection

### 5.1 Run Connection Test
- [ ] Open terminal in project root
- [ ] Run: `npm run test:connection`
- [ ] Check test output

### 5.2 Check Test Results
- [ ] All tests pass (✓)
- [ ] See "Connection successful" message
- [ ] No authentication errors
- [ ] No "Invalid API key" errors

### 5.3 If Tests Fail
- [ ] Check error message
- [ ] Verify credentials are correct in `.env` file
- [ ] Check for extra spaces in credentials
- [ ] Verify Supabase project is active (not paused)
- [ ] Check internet connection
- [ ] Review troubleshooting section in `docs/SUPABASE_SETUP.md`

---

## 📋 Step 6: Security Check

- [ ] Verified `.env` files are in `.gitignore`
- [ ] Ran `git status` to confirm `.env` files are not staged
- [ ] Never committed `.env` files to git
- [ ] Understand that anon key is safe for client-side
- [ ] Understand that service_role key must stay secret
- [ ] Have a secure place to store database password

---

## ✅ Completion

- [ ] All checklist items completed
- [ ] Connection test passes
- [ ] Credentials saved securely
- [ ] Ready to proceed with database schema setup

---

## 📚 Next Steps

After completing this checklist:

1. Review `docs/SUPABASE_SETUP.md` for detailed information
2. Set up database schema (tables, relationships)
3. Configure Row Level Security (RLS) policies
4. Set up authentication
5. Create database migrations

---

## 🆘 Need Help?

- Check `docs/SUPABASE_SETUP.md` for detailed instructions
- Visit [Supabase Documentation](https://supabase.com/docs)
- Join [Supabase Discord](https://discord.supabase.com)

---

**Last Updated:** November 2024

