/**
 * User Languages Table
 * 
 * Stores languages users can teach or want to learn.
 * Each user can have multiple teaching and learning languages.
 * 
 * LANGUAGE MATCHING:
 * - User A teaching Spanish + User B learning Spanish = Match
 * - Used in discovery algorithm to find compatible partners
 */

DROP TABLE IF EXISTS user_languages CASCADE;

CREATE TABLE user_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Language info
  language VARCHAR(50) NOT NULL,  -- Full name: "English", "Spanish"
  language_code VARCHAR(10) NOT NULL,  -- ISO code: "en", "es"
  flag_emoji VARCHAR(10),  -- Flag: "🇬🇧", "🇪🇸"
  
  -- Type: teaching or learning
  type VARCHAR(20) NOT NULL CHECK (type IN ('teaching', 'learning')),
  
  -- Proficiency level (only for teaching)
  level VARCHAR(20) CHECK (
    level IN ('native', 'advanced', 'intermediate', 'beginner') OR level IS NULL
  ),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, language_code, type)  -- Can't add same language twice
);

-- Indexes
CREATE INDEX idx_user_languages_user_id ON user_languages(user_id);
CREATE INDEX idx_user_languages_type ON user_languages(type);
CREATE INDEX idx_user_languages_language ON user_languages(language_code, type);

COMMENT ON TABLE user_languages IS 'Languages users can teach or want to learn';
COMMENT ON COLUMN user_languages.type IS 'Either "teaching" or "learning"';
COMMENT ON COLUMN user_languages.level IS 'Proficiency level (native/advanced/intermediate/beginner)';

