/**
 * Enable Required Extensions
 * 
 * PostGIS: For geographic location queries (find users nearby)
 * pgcrypto: For UUID generation
 * 
 * Run this FIRST before creating any tables.
 */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geography
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify extensions
SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'postgis');

