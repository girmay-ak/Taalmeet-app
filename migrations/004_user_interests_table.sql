/**
 * User Interests Table
 * 
 * Stores user interests/hobbies for matching.
 * Maximum 8 interests per user.
 * 
 * Used to:
 * - Find partners with common interests
 * - Calculate match score
 * - Show on profile
 */

DROP TABLE IF EXISTS user_interests CASCADE;

CREATE TABLE user_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  interest VARCHAR(50) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, interest)  -- Can't add same interest twice
);

-- Indexes
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_interest ON user_interests(interest);

COMMENT ON TABLE user_interests IS 'User interests for matching and profile display';

