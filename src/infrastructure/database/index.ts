/**
 * Database Infrastructure Exports
 * 
 * Central export point for database infrastructure.
 * 
 * @module infrastructure/database
 */

export { SupabaseAdapter } from './supabase/SupabaseAdapter';
export { getDatabaseConfig } from './config/database.config';
export type { DatabaseConfig } from './config/database.config';

// Re-export for convenience
export { getSupabaseClient, resetSupabaseClient } from './supabaseClient';

