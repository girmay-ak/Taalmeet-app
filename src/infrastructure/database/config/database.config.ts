/**
 * Database Configuration
 * 
 * Centralized database configuration.
 * Environment-specific settings loaded from Config.
 * 
 * @module infrastructure/database/config/database.config
 * @see src/config/env.ts
 */

import { env } from '@config/env';
import { Platform } from 'react-native'; // eslint-disable-line import/no-extraneous-dependencies

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  url: string;
  anonKey: string;
  serviceKey?: string;
  options: {
    auth: {
      autoRefreshToken: boolean;
      persistSession: boolean;
      detectSessionInUrl: boolean;
    };
    global: {
      headers: Record<string, string>;
    };
    db: {
      schema: string;
    };
    realtime: {
      params: {
        eventsPerSecond: number;
      };
    };
  };
}

/**
 * Get database configuration for current environment
 * 
 * @returns Database configuration object
 * @throws {Error} If required environment variables are missing
 * 
 * @example
 * ```typescript
 * const config = getDatabaseConfig();
 * const adapter = new SupabaseAdapter(config);
 * ```
 */
export function getDatabaseConfig(): DatabaseConfig {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing required Supabase credentials. ' +
      'Please check SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.'
    );
  }

  return {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceKey: env.SUPABASE_SERVICE_KEY || undefined,
    options: {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Not needed for mobile app
      },
      global: {
        headers: {
          'x-app-version': '1.0.0',
          'x-platform': Platform.OS, // 'ios' or 'android'
        },
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    },
  };
}

