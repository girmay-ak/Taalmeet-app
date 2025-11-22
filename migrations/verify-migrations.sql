/**
 * Verification Queries
 * 
 * Run these queries in Supabase SQL Editor to verify your migrations were successful.
 * 
 * Copy and paste each section into SQL Editor and run to check:
 */

-- ============================================
-- 1. Check Extensions
-- ============================================
-- Should return 2 rows: uuid-ossp and postgis
SELECT 
  extname AS extension_name,
  extversion AS version
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'postgis');

-- ============================================
-- 2. Check Tables Exist
-- ============================================
-- Should return 3 rows: users, user_languages, user_interests
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'user_languages', 'user_interests')
ORDER BY table_name;

-- ============================================
-- 3. Check Users Table Structure
-- ============================================
-- Should show all columns in users table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- ============================================
-- 4. Check Indexes
-- ============================================
-- Should show all indexes created
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_languages', 'user_interests')
ORDER BY tablename, indexname;

-- ============================================
-- 5. Check Foreign Keys
-- ============================================
-- Should show foreign key relationships
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('user_languages', 'user_interests')
ORDER BY tc.table_name;

-- ============================================
-- 6. Test PostGIS Geography
-- ============================================
-- Should return: true (PostGIS is working)
SELECT ST_IsValid(
  ST_GeogFromText('POINT(4.3528 52.0705)')  -- Amsterdam coordinates
) AS postgis_working;

-- ============================================
-- 7. Test UUID Generation
-- ============================================
-- Should return a valid UUID
SELECT uuid_generate_v4() AS test_uuid;

-- ============================================
-- 8. Check Triggers
-- ============================================
-- Should show the updated_at trigger
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'users';

