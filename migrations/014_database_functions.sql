/**
 * Custom Database Functions
 * 
 * Reusable SQL functions for complex queries.
 * Called from application code via Supabase RPC.
 * 
 * ⚠️ NOTE: Some functions reference tables that don't exist yet:
 * - blocks, connections, messages, reviews
 * Uncomment those functions after creating the tables.
 * 
 * @see https://supabase.com/docs/guides/database/functions
 */

-- ============================================
-- FUNCTION: Get Nearby Users
-- ============================================

/**
 * Find users within specified radius
 * 
 * Uses PostGIS ST_DWithin for efficient geographic queries.
 * Returns users sorted by distance (closest first).
 * Excludes: Self, blocked users, offline users
 * 
 * @param user_lat - Current user latitude
 * @param user_lng - Current user longitude  
 * @param radius_km - Search radius in kilometers
 * @param user_id - Current user ID (to exclude self)
 * @param limit_count - Max results to return
 * 
 * @returns Table of nearby users with distance
 * 
 * @example
 * SELECT * FROM nearby_users(52.37, 4.89, 10, 'user-uuid', 20);
 */

CREATE OR REPLACE FUNCTION nearby_users(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_km FLOAT DEFAULT 10,
  current_user_id UUID DEFAULT NULL,
  limit_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  age INTEGER,
  avatar_url TEXT,
  city VARCHAR,
  country VARCHAR,
  verified BOOLEAN,
  premium BOOLEAN,
  online_status VARCHAR,
  distance_km FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.age,
    u.avatar_url,
    u.city,
    u.country,
    u.verified,
    u.premium,
    u.online_status,
    -- Calculate distance in kilometers
    ROUND(
      ST_Distance(
        u.location::geography,
        ST_MakePoint(user_lng, user_lat)::geography
      ) / 1000, 
      1
    )::FLOAT AS distance_km
  FROM users u
  WHERE 
    -- User has location set
    u.location IS NOT NULL
    -- Within radius
    AND ST_DWithin(
      u.location::geography,
      ST_MakePoint(user_lng, user_lat)::geography,
      radius_km * 1000  -- Convert km to meters
    )
    -- Not yourself
    AND (current_user_id IS NULL OR u.id != current_user_id)
    -- Not offline
    AND u.online_status != 'offline'
    -- Not blocked (check in both directions) - uncomment when blocks table exists
    -- AND NOT EXISTS (
    --   SELECT 1 FROM blocks b
    --   WHERE (b.blocker_id = current_user_id AND b.blocked_id = u.id)
    --      OR (b.blocker_id = u.id AND b.blocked_id = current_user_id)
    -- )
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION nearby_users IS 'Find users within specified radius, sorted by distance';

-- ============================================
-- FUNCTION: Calculate Match Score
-- ============================================

/**
 * Calculate compatibility score between two users
 * 
 * Algorithm:
 * - Language match: 60% (teaching/learning compatibility)
 * - Distance: 20% (closer = better)
 * - Interest overlap: 20% (common interests)
 * 
 * @param user1_id - First user ID
 * @param user2_id - Second user ID
 * 
 * @returns Score from 0-100
 * 
 * @example
 * SELECT calculate_match_score('uuid1', 'uuid2');
 */

CREATE OR REPLACE FUNCTION calculate_match_score(
  user1_id UUID,
  user2_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  language_score FLOAT := 0;
  distance_score FLOAT := 0;
  interest_score FLOAT := 0;
  total_score INTEGER;
  distance_km FLOAT;
BEGIN
  -- 1. Language Compatibility (60%)
  SELECT COUNT(*) * 30 INTO language_score
  FROM user_languages ul1
  JOIN user_languages ul2 
    ON ul1.language_code = ul2.language_code
    AND ul1.type != ul2.type  -- One teaching, one learning
  WHERE ul1.user_id = user1_id 
    AND ul2.user_id = user2_id;
  
  language_score := LEAST(language_score, 60);  -- Cap at 60%
  
  -- 2. Distance Score (20%)
  SELECT 
    ROUND(
      ST_Distance(u1.location::geography, u2.location::geography) / 1000,
      1
    ) INTO distance_km
  FROM users u1, users u2
  WHERE u1.id = user1_id AND u2.id = user2_id
    AND u1.location IS NOT NULL 
    AND u2.location IS NOT NULL;
  
  IF distance_km IS NOT NULL THEN
    distance_score := GREATEST(0, 20 - (distance_km * 2));  -- Lose 2% per km
  END IF;
  
  -- 3. Interest Overlap (20%)
  SELECT COUNT(*) * 2.5 INTO interest_score
  FROM user_interests ui1
  JOIN user_interests ui2 
    ON ui1.interest = ui2.interest
  WHERE ui1.user_id = user1_id 
    AND ui2.user_id = user2_id;
  
  interest_score := LEAST(interest_score, 20);  -- Cap at 20%
  
  -- Total score
  total_score := ROUND(language_score + distance_score + interest_score);
  
  RETURN GREATEST(0, LEAST(100, total_score));  -- Clamp between 0-100
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION calculate_match_score IS 'Calculate compatibility score (0-100) between two users';

-- ============================================
-- FUNCTION: Get Unread Message Count
-- (Uncomment when messages table is created)
-- ============================================

/**
 * Get total unread message count for a user
 * 
 * @param user_id - User ID
 * @returns Number of unread messages
 */

/*
CREATE OR REPLACE FUNCTION get_unread_count(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO unread_count
  FROM messages
  WHERE receiver_id = user_id
    AND is_read = FALSE
    AND deleted_by_receiver = FALSE;
  
  RETURN unread_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_unread_count IS 'Get total unread message count for a user';
*/

-- ============================================
-- FUNCTION: Get User Statistics
-- (Uncomment when connections, messages, reviews tables are created)
-- ============================================

/**
 * Get aggregated statistics for a user
 * 
 * Returns:
 * - Total connections
 * - Total exchanges (conversations with messages)
 * - Average rating
 * - Total reviews
 * 
 * @param user_id - User ID
 * @returns JSON object with stats
 */

/*
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_connections', (
      SELECT COUNT(*)
      FROM connections
      WHERE (user1_id = user_id OR user2_id = user_id)
        AND status = 'accepted'
    ),
    'total_exchanges', (
      SELECT COUNT(DISTINCT conversation_id)
      FROM messages
      WHERE sender_id = user_id OR receiver_id = user_id
    ),
    'average_rating', (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE reviewed_user_id = user_id
    ),
    'total_reviews', (
      SELECT COUNT(*)
      FROM reviews
      WHERE reviewed_user_id = user_id
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_user_stats IS 'Get aggregated user statistics as JSON';
*/

-- ============================================
-- FUNCTION: Check if Users Can Message
-- (Uncomment when blocks, connections tables are created)
-- ============================================

/**
 * Check if two users can message each other
 * 
 * Rules:
 * - Not blocked (either direction)
 * - Have accepted connection OR premium user
 * 
 * @param user1_id - First user ID
 * @param user2_id - Second user ID
 * @returns Boolean
 */

/*
CREATE OR REPLACE FUNCTION can_message(
  user1_id UUID,
  user2_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  is_blocked BOOLEAN;
  are_connected BOOLEAN;
  either_premium BOOLEAN;
BEGIN
  -- Check if blocked
  SELECT EXISTS (
    SELECT 1 FROM blocks
    WHERE (blocker_id = user1_id AND blocked_id = user2_id)
       OR (blocker_id = user2_id AND blocked_id = user1_id)
  ) INTO is_blocked;
  
  IF is_blocked THEN
    RETURN FALSE;
  END IF;
  
  -- Check if connected
  SELECT EXISTS (
    SELECT 1 FROM connections
    WHERE ((user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1))
      AND status = 'accepted'
  ) INTO are_connected;
  
  IF are_connected THEN
    RETURN TRUE;
  END IF;
  
  -- Check if either user is premium
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id IN (user1_id, user2_id) AND premium = TRUE
  ) INTO either_premium;
  
  RETURN either_premium;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION can_message IS 'Check if two users can message each other';
*/

-- ============================================
-- VERIFY FUNCTIONS
-- ============================================

-- List all functions
SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- ============================================
-- TEST FUNCTIONS
-- ============================================

-- Test nearby_users (will work if you have users with locations)
-- SELECT * FROM nearby_users(52.37, 4.89, 10, NULL, 5);

-- Test calculate_match_score (will work if you have users with languages/interests)
-- SELECT calculate_match_score('uuid1', 'uuid2');

