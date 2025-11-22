# Generate TypeScript Types from Supabase Schema

This guide shows you how to generate TypeScript types from your Supabase database schema.

## Prerequisites

1. Supabase project created
2. Database tables created
3. Supabase CLI installed

## Steps

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

Or use npx (no global install needed):

```bash
npx supabase --version
```

### 2. Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate. After successful login, you'll be authenticated in the CLI.

### 3. Get Your Project Reference ID

1. Go to your Supabase Dashboard
2. Go to **Settings** → **General**
3. Find **Reference ID** (looks like: `abcdefghijklmnop`)
4. Copy this ID

### 4. Generate Types

Run this command (replace `your-project-ref` with your actual project reference ID):

```bash
supabase gen types typescript --project-id "your-project-ref" > src/types/database.types.ts
```

**Example:**
```bash
supabase gen types typescript --project-id "abcdefghijklmnop" > src/types/database.types.ts
```

### 5. Verify Generated Types

Check that `src/types/database.types.ts` was created and contains type definitions for your tables.

## Alternative: Using Supabase Link

If you prefer to link your local project to Supabase:

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Generate types from linked project
supabase gen types typescript --linked > src/types/database.types.ts
```

## Updating Types

When you add new tables or modify schema:

1. Run the generate command again
2. Types will be updated automatically
3. Commit the updated types file

## Troubleshooting

### Error: "Not authenticated"
- Run `supabase login` again
- Make sure you're logged in with the correct account

### Error: "Project not found"
- Verify your project reference ID is correct
- Check that you have access to the project

### Types not generating
- Make sure your tables exist in Supabase
- Check that you have the correct permissions
- Try using the `--linked` flag if you've linked your project

## Usage in Code

After generating types, import and use them:

```typescript
import { Database } from '@/types/database.types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];
```

