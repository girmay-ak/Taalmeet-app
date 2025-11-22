/**
 * Users Table
 * 
 * Stores core user profile information including:
 * - Basic info (name, email, age)
 * - Location (city, country, geographic coordinates)
 * - Status (verified, premium, online status)
 * - Onboarding progress
 * 
 * GEOGRAPHY vs GEOMETRY:
 * - We use GEOGRAPHY for real-world coordinates (lat/lng)
 * - Allows accurate distance calculations in meters/kilometers
 * - SRID 4326 = WGS 84 (standard GPS coordinates)
 * 
 * @see https://postgis.net/docs/geography.html
 */

-- Drop existing table (development only!)
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Authentication (synced with Supabase Auth)
  email VARCHAR(255) UNIQUE NOT NULL,
  
  -- Basic profile
  name VARCHAR(100) NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  avatar_url TEXT,
  bio TEXT CHECK (char_length(bio) <= 150),
  
  -- Location
  location GEOGRAPHY(POINT, 4326),  -- Stores lat/lng as geographic point
  city VARCHAR(100),
  country VARCHAR(100),
  country_code VARCHAR(2),  -- ISO country code (NL, US, etc.)
  
  -- Status
  verified BOOLEAN DEFAULT FALSE,
  premium BOOLEAN DEFAULT FALSE,
  online_status VARCHAR(20) DEFAULT 'offline' CHECK (
    online_status IN ('online', 'away', 'busy', 'offline')
  ),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  profile_completion INTEGER DEFAULT 0 CHECK (
    profile_completion >= 0 AND profile_completion <= 100
  ),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users USING GIST(location);
CREATE INDEX idx_users_online_status ON users(online_status) WHERE online_status != 'offline';
CREATE INDEX idx_users_city_country ON users(city, country);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE users IS 'Core user profiles with authentication and location data';
COMMENT ON COLUMN users.location IS 'Geographic point (latitude, longitude) using SRID 4326';
COMMENT ON COLUMN users.profile_completion IS 'Percentage (0-100) of profile completion';

