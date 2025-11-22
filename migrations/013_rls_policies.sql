/**
 * Row Level Security (RLS) Policies
 * 
 * Security rules that restrict data access at database level.
 * 
 * HOW IT WORKS:
 * 1. Enable RLS on table
 * 2. Create policies (SELECT, INSERT, UPDATE, DELETE)
 * 3. Policies check: auth.uid() = current logged-in user
 * 
 * POLICY TYPES:
 * - SELECT: Who can read data
 * - INSERT: Who can create data
 * - UPDATE: Who can modify data
 * - DELETE: Who can delete data
 * 
 * ⚠️ NOTE: Some tables (connections, conversations, messages, reviews, blocks)
 * don't exist yet. Those policies are included for when you create those tables.
 * 
 * @see https://supabase.com/docs/guides/auth/row-level-security
 */

-- ============================================
-- ENABLE RLS ON EXISTING TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ENABLE RLS ON FUTURE TABLES
-- (Uncomment when you create these tables)
-- ============================================

-- ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Anyone can view public profile data
CREATE POLICY "Anyone can view user profiles"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can delete their own account
CREATE POLICY "Users can delete own account"
  ON users FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- USER_LANGUAGES TABLE POLICIES
-- ============================================

-- Anyone can view languages (public info)
CREATE POLICY "Anyone can view user languages"
  ON user_languages FOR SELECT
  USING (true);

-- Users can manage their own languages
CREATE POLICY "Users can manage own languages"
  ON user_languages FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- USER_INTERESTS TABLE POLICIES
-- ============================================

-- Anyone can view interests
CREATE POLICY "Anyone can view user interests"
  ON user_interests FOR SELECT
  USING (true);

-- Users can manage their own interests
CREATE POLICY "Users can manage own interests"
  ON user_interests FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- AVAILABILITY_SLOTS TABLE POLICIES
-- ============================================

-- Anyone can view availability (for scheduling)
CREATE POLICY "Anyone can view availability"
  ON availability_slots FOR SELECT
  USING (true);

-- Users can manage their own availability
CREATE POLICY "Users can manage own availability"
  ON availability_slots FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- System can create notifications (service role only)
-- No policy needed - service role bypasses RLS

-- ============================================
-- REPORTS TABLE POLICIES
-- ============================================

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Users can create reports
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Only admins can update/delete reports
-- No policies needed - handled by service role

-- ============================================
-- CONNECTIONS TABLE POLICIES
-- (Uncomment when connections table is created)
-- ============================================

/*
-- Users can view their own connections
CREATE POLICY "Users can view own connections"
  ON connections FOR SELECT
  USING (
    auth.uid() = user1_id OR 
    auth.uid() = user2_id
  );

-- Users can create connections
CREATE POLICY "Users can create connections"
  ON connections FOR INSERT
  WITH CHECK (
    auth.uid() = user1_id OR 
    auth.uid() = user2_id
  );

-- Users can update connections (accept/decline)
CREATE POLICY "Users can update connections"
  ON connections FOR UPDATE
  USING (
    auth.uid() = user1_id OR 
    auth.uid() = user2_id
  );

-- Users can delete connections
CREATE POLICY "Users can delete connections"
  ON connections FOR DELETE
  USING (
    auth.uid() = user1_id OR 
    auth.uid() = user2_id
  );
*/

-- ============================================
-- CONVERSATIONS TABLE POLICIES
-- (Uncomment when conversations table is created)
-- ============================================

/*
-- Users can view their own conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (
    auth.uid() = user1_id OR 
    auth.uid() = user2_id
  );

-- Users can create conversations
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (
    auth.uid() = user1_id OR 
    auth.uid() = user2_id
  );

-- Users can update conversations (archive)
CREATE POLICY "Users can update conversations"
  ON conversations FOR UPDATE
  USING (
    auth.uid() = user1_id OR 
    auth.uid() = user2_id
  );
*/

-- ============================================
-- MESSAGES TABLE POLICIES
-- (Uncomment when messages table is created)
-- ============================================

/*
-- Users can view messages in their conversations
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

-- Users can send messages
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update message read status
CREATE POLICY "Users can update messages"
  ON messages FOR UPDATE
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

-- Users can delete their own messages
CREATE POLICY "Users can delete messages"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id);
*/

-- ============================================
-- REVIEWS TABLE POLICIES
-- (Uncomment when reviews table is created)
-- ============================================

/*
-- Anyone can view non-anonymous reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

-- Users can leave reviews
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Users can update their own reviews (within 24 hours)
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (
    auth.uid() = reviewer_id AND
    created_at > NOW() - INTERVAL '24 hours'
  );

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = reviewer_id);
*/

-- ============================================
-- BLOCKS TABLE POLICIES
-- (Uncomment when blocks table is created)
-- ============================================

/*
-- Users can view their own blocks
CREATE POLICY "Users can view own blocks"
  ON blocks FOR SELECT
  USING (auth.uid() = blocker_id);

-- Users can block others
CREATE POLICY "Users can create blocks"
  ON blocks FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

-- Users can unblock
CREATE POLICY "Users can delete blocks"
  ON blocks FOR DELETE
  USING (auth.uid() = blocker_id);
*/

-- ============================================
-- VERIFY RLS IS ENABLED
-- ============================================

-- Check which tables have RLS enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true
ORDER BY tablename;

-- ============================================
-- VERIFY POLICIES ARE CREATED
-- ============================================

-- List all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- TEST RLS POLICIES FUNCTION
-- ============================================

-- Create a test function to verify RLS
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE(table_name TEXT, policy_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pol.tablename::TEXT,
    COUNT(*)::BIGINT
  FROM pg_policies pol
  WHERE pol.schemaname = 'public'
  GROUP BY pol.tablename
  ORDER BY pol.tablename;
END;
$$ LANGUAGE plpgsql;

-- Run test to see policy counts per table
SELECT * FROM test_rls_policies();

