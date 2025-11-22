# Database Migrations

This directory contains SQL migration scripts for setting up the TaalMeet database schema in Supabase.

## How to Run Migrations

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy and paste the contents of each migration file
5. Run them **in order** (001, 002, 003, etc.)
6. Verify each migration completes successfully

### Option 2: Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Migration Order

**⚠️ IMPORTANT: Run migrations in numerical order!**

1. `001_extensions.sql` - Enable PostGIS and UUID extensions (run FIRST)
2. `002_users_table.sql` - Create users table
3. `003_user_languages_table.sql` - Create user_languages table
4. `004_user_interests_table.sql` - Create user_interests table
5. *(More migrations will be added as needed)*

## Migration Files

### 001_extensions.sql
- Enables `uuid-ossp` for UUID generation
- Enables `postgis` for geographic location queries
- **Must be run first** before any other migrations

### 002_users_table.sql
- Creates the core `users` table
- Includes location data using PostGIS GEOGRAPHY type
- Adds indexes for performance
- Creates trigger for `updated_at` timestamp

### 003_user_languages_table.sql
- Creates `user_languages` table
- Stores teaching and learning languages
- Links to users table with foreign key

### 004_user_interests_table.sql
- Creates `user_interests` table
- Stores user interests/hobbies
- Used for matching algorithm

## Development vs Production

### Development
- Migrations include `DROP TABLE IF EXISTS` for easy reset
- Safe to run multiple times
- Can drop and recreate tables

### Production
- Remove `DROP TABLE IF EXISTS` statements before running
- Test migrations on staging first
- Always backup database before migrations
- Run migrations during maintenance window

## Verifying Migrations

After running migrations, verify in Supabase:

1. **Tables**: Go to **Table Editor** - should see all tables
2. **Extensions**: Go to **Database > Extensions** - should see `postgis` and `uuid-ossp`
3. **Indexes**: Go to **Database > Indexes** - should see all created indexes

## Troubleshooting

### Error: "extension postgis does not exist"
- Make sure you ran `001_extensions.sql` first
- Check that PostGIS is available in your Supabase plan

### Error: "relation already exists"
- This is normal if running migrations multiple times
- The `DROP TABLE IF EXISTS` will handle this in development

### Error: "permission denied"
- Check that you're using the correct database user
- Service role key may be needed for some operations

## Next Steps

After running these initial migrations:
1. Set up Row Level Security (RLS) policies
2. Create additional tables (matches, messages, sessions, etc.)
3. Set up database functions and triggers
4. Create views for common queries

## Security Notes

- Never commit production database credentials
- Use environment variables for connection strings
- Enable Row Level Security (RLS) on all tables
- Review and test all migrations before production deployment

