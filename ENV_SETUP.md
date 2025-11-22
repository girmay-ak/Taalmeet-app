# Environment Configuration Setup

This document explains how to set up and use environment variables in the TaalMeet app.

## Overview

The app supports three environments:
- **Development** - Local development
- **Staging** - Pre-production testing
- **Production** - Live production environment

## Initial Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.development
   ```

2. **Fill in your actual values** in `.env.development`:
   - Get your Supabase credentials from https://supabase.com/dashboard
   - Add your API keys for maps and external services

3. **Repeat for other environments** as needed:
   ```bash
   cp .env.example .env.staging
   cp .env.example .env.production
   ```

## Environment Files

### `.env.development`
- Used for local development
- Mock data enabled by default
- Logging enabled
- Analytics disabled

### `.env.staging`
- Used for staging/pre-production
- Mock data disabled
- All features enabled
- Uses staging Supabase project

### `.env.production`
- Used for production builds
- Mock data disabled
- Optimized settings (shorter timeouts, no logging)
- Uses production Supabase project

## Required Variables

### Supabase (Required)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

### Optional Variables
All other variables have defaults and are optional. See `.env.example` for the full list.

## Usage in Code

### Access Environment Variables

```typescript
import { env } from '@config/env';

// Access variables
const supabaseUrl = env.SUPABASE_URL;
const isDev = env.NODE_ENV === 'development';
const enableLogging = env.ENABLE_LOGGING;
```

### Access App Configuration

```typescript
import { appConfig } from '@config/app.config';

// API configuration
const timeout = appConfig.api.timeout;
const baseURL = appConfig.api.baseURL;

// Feature flags
const analyticsEnabled = appConfig.features.analytics;

// Pagination
const pageSize = appConfig.pagination.defaultPageSize;

// Map settings
const mapCenter = appConfig.map.defaultCenter;
```

## Running the App

### Development
```bash
npm run start:dev
npm run android:dev
npm run ios:dev
```

### Staging
```bash
npm run start:staging
npm run android:staging
npm run ios:staging
```

### Production
```bash
npm run start:prod
npm run android:prod
npm run ios:prod
```

## Environment Variable Validation

The configuration system validates required variables on app startup. If a required variable is missing, you'll see a clear error message indicating which variables need to be set.

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to version control
- `.env` files are already in `.gitignore`
- Use `.env.example` as a template (no secrets)
- Keep production secrets secure
- Rotate keys regularly

## Troubleshooting

### Variables not loading?
1. Check that your `.env` file exists
2. Verify `NODE_ENV` is set correctly
3. Restart the Metro bundler after changing `.env` files

### Type errors?
Run type checking:
```bash
npm run type-check
```

### Missing variables error?
Check that required variables are set in your `.env` file. See the error message for specific missing variables.

## Configuration Files

- `src/config/env.ts` - Environment variable access and validation
- `src/config/app.config.ts` - Application configuration
- `app.config.js` - Expo configuration (loads .env files)

