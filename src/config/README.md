# Configuration

This directory contains environment and application configuration files.

## Files

- **`env.ts`** - Environment variable configuration with TypeScript types and validation
- **`app.config.ts`** - Application configuration (API endpoints, feature flags, etc.)

## Environment Variables

Environment variables are loaded from `.env` files based on `NODE_ENV`:

- **Development**: `.env.development`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

### Required Variables

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

### Optional Variables

All other variables have defaults and are optional.

## Usage

```typescript
import { env } from '@config/env';
import { appConfig } from '@config/app.config';

// Access environment variables
const supabaseUrl = env.SUPABASE_URL;
const isDevelopment = env.NODE_ENV === 'development';

// Access app configuration
const apiTimeout = appConfig.api.timeout;
const pageSize = appConfig.pagination.defaultPageSize;
```

## Running with Different Environments

```bash
# Development (default)
npm run start:dev
npm run android:dev
npm run ios:dev

# Staging
npm run start:staging
npm run android:staging
npm run ios:staging

# Production
npm run start:prod
npm run android:prod
npm run ios:prod
```

## Setup

1. Copy `.env.example` to `.env.development`
2. Fill in your actual values
3. Repeat for `.env.staging` and `.env.production` as needed

**Important**: Never commit `.env` files to version control. They are already in `.gitignore`.
