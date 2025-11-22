#!/bin/bash

# Supabase Migration Runner
# 
# This script helps you run migrations in Supabase SQL Editor
# 
# Usage:
#   ./migrations/run-migrations.sh
# 
# This will display each migration file with instructions

set -e

MIGRATIONS_DIR="migrations"
MIGRATION_FILES=(
  "001_extensions.sql"
  "002_users_table.sql"
  "003_user_languages_table.sql"
  "004_user_interests_table.sql"
)

echo "🚀 TaalMeet Database Migration Runner"
echo "======================================"
echo ""
echo "This script will help you run migrations in Supabase SQL Editor"
echo ""
echo "📋 Steps:"
echo "1. Go to your Supabase Dashboard"
echo "2. Click 'SQL Editor' in the left sidebar"
echo "3. Click 'New query'"
echo "4. Copy and paste each migration below"
echo "5. Click 'Run' after each migration"
echo ""
echo "Press Enter to continue..."
read

for file in "${MIGRATION_FILES[@]}"; do
  filepath="${MIGRATIONS_DIR}/${file}"
  
  if [ ! -f "$filepath" ]; then
    echo "❌ Error: $filepath not found"
    continue
  fi
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📄 Migration: $file"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  cat "$filepath"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "✅ Copy the SQL above and run it in Supabase SQL Editor"
  echo ""
  echo "Press Enter to continue to next migration..."
  read
done

echo ""
echo "✅ All migrations displayed!"
echo ""
echo "📝 Next steps:"
echo "1. Verify all migrations ran successfully"
echo "2. Check Table Editor to see your tables"
echo "3. Check Database > Extensions to verify PostGIS is enabled"
echo ""

