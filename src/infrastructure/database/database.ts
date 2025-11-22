/**
 * Database Instance
 * 
 * Singleton instance of the Supabase adapter.
 * This is the main entry point for all database operations.
 * 
 * @module infrastructure/database/database
 */

import { SupabaseAdapter } from './supabase/SupabaseAdapter';
import { getDatabaseConfig } from './config/database.config';
import { IDatabase } from '@/core/interfaces/IDatabase';
import { Logger } from '@/shared/utils/logger';

/**
 * Database adapter singleton instance
 */
let databaseInstance: IDatabase | null = null;
const logger = new Logger('Database');

/**
 * Get or create the database adapter instance
 * 
 * Implements the Singleton pattern to ensure only one database
 * adapter is created and reused throughout the application.
 * 
 * @returns Database adapter instance
 * @throws {Error} If database configuration is invalid
 * 
 * @example
 * ```typescript
 * import { getDatabase } from '@/infrastructure/database';
 * 
 * const db = getDatabase();
 * const users = await db.query('users').select().execute();
 * ```
 */
export function getDatabase(): IDatabase {
  if (!databaseInstance) {
    try {
      const config = getDatabaseConfig();
      databaseInstance = new SupabaseAdapter(config);
      logger.info('Database adapter initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize database adapter', error);
      throw error;
    }
  }

  return databaseInstance;
}

/**
 * Reset the database adapter instance
 * 
 * Useful for testing or when configuration changes.
 * This will force a new adapter to be created on the next getDatabase() call.
 * 
 * @example
 * ```typescript
 * resetDatabase();
 * const newDb = getDatabase(); // Creates new instance
 * ```
 */
export function resetDatabase(): void {
  if (databaseInstance) {
    // Cleanup resources if adapter has cleanup method
    if ('cleanup' in databaseInstance && typeof databaseInstance.cleanup === 'function') {
      (databaseInstance as any).cleanup();
    }
    databaseInstance = null;
    logger.info('Database adapter reset');
  }
}

/**
 * Check if database is initialized
 * 
 * @returns True if database is initialized
 */
export function isDatabaseInitialized(): boolean {
  return databaseInstance !== null;
}

