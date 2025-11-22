/**
 * Supabase client configuration
 * 
 * Sets up and exports the Supabase client singleton instance.
 * This follows the Singleton pattern to ensure only one database
 * connection is created and reused throughout the application.
 * 
 * @module infrastructure/database/supabaseClient
 * @see {@link https://supabase.com/docs/reference/javascript/introduction} Supabase JS Client
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@config/env';

/**
 * Supabase client singleton instance
 * 
 * This instance is created once and reused throughout the application
 * to maintain connection pooling and avoid multiple client initializations.
 */
let supabaseClient: SupabaseClient | null = null;

/**
 * Gets or creates the Supabase client instance
 * 
 * Implements the Singleton pattern to ensure only one Supabase client
 * is created. The client is configured using environment variables.
 * 
 * @returns Supabase client instance
 * @throws {Error} If Supabase configuration is invalid
 * @example
 * const client = getSupabaseClient();
 * const { data, error } = await client.from('users').select('*');
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      throw new Error('Supabase URL and Anon Key must be configured');
    }

    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClient;
};

/**
 * Resets the Supabase client instance
 * 
 * Useful for testing or when configuration changes.
 * This will force a new client to be created on the next getSupabaseClient() call.
 * 
 * @example
 * resetSupabaseClient();
 * const newClient = getSupabaseClient(); // Creates new instance
 */
export const resetSupabaseClient = (): void => {
  supabaseClient = null;
};

