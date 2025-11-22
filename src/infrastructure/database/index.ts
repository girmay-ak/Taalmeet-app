/**
 * Database Infrastructure Exports
 * 
 * Central export point for database infrastructure.
 * 
 * @module infrastructure/database
 */

// Main database instance (recommended)
export { getDatabase, resetDatabase, isDatabaseInitialized } from './database';
export type { IDatabase } from '@/core/interfaces/IDatabase';

// Adapter and configuration
export { SupabaseAdapter } from './supabase/SupabaseAdapter';
export { getDatabaseConfig } from './config/database.config';
export type { DatabaseConfig } from './config/database.config';

// Legacy exports (for backward compatibility)
export { getSupabaseClient, resetSupabaseClient } from './supabaseClient';

