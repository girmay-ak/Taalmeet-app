/**
 * Supabase Database Adapter
 * 
 * Main adapter implementing IDatabase interface.
 * Translates generic database operations to Supabase-specific calls.
 * 
 * To switch from Supabase to another database:
 * 1. Create new adapter (FirebaseAdapter, PostgresAdapter, etc.)
 * 2. Implement IDatabase interface
 * 3. Update DIContainer to use new adapter
 * 4. No changes needed in business logic!
 * 
 * @implements {IDatabase}
 * 
 * @module infrastructure/database/supabase/SupabaseAdapter
 * 
 * @example
 * ```typescript
 * const db = new SupabaseAdapter(config);
 * const users = await db.query('users')
 *   .select()
 *   .eq('id', userId)
 *   .execute();
 * ```
 */

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { IDatabase, IQueryBuilder, IAuthProvider, IStorageProvider } from '@/core/interfaces/IDatabase';
import { SupabaseQueryBuilder } from './SupabaseQueryBuilder';
import { SupabaseAuthProvider } from './SupabaseAuthProvider';
import { SupabaseStorageProvider } from './SupabaseStorageProvider';
import { DatabaseConfig } from '../config/database.config';
import { Logger } from '@/shared/utils/logger';

/**
 * Supabase database adapter
 * 
 * Implements IDatabase interface using Supabase as the backend.
 */
export class SupabaseAdapter implements IDatabase {
  private client: SupabaseClient;
  private authProvider: IAuthProvider;
  private storageProvider: IStorageProvider;
  private logger = new Logger('SupabaseAdapter');
  private channels: Map<string, RealtimeChannel> = new Map();

  /**
   * Creates a new SupabaseAdapter
   * 
   * @param config - Database configuration
   */
  constructor(config: DatabaseConfig) {
    this.logger.info('Initializing Supabase client', {
      url: config.url,
      hasServiceKey: !!config.serviceKey,
    });

    this.client = createClient(config.url, config.anonKey, config.options);
    this.authProvider = new SupabaseAuthProvider(this.client);
    this.storageProvider = new SupabaseStorageProvider(this.client);

    // Set up auth state listener
    this.setupAuthListener();
  }

  /**
   * Get authentication provider
   */
  get auth(): IAuthProvider {
    return this.authProvider;
  }

  /**
   * Get storage provider
   */
  get storage(): IStorageProvider {
    return this.storageProvider;
  }

  /**
   * Create query builder for table
   * 
   * @param table - Table name
   * @returns Query builder instance
   * 
   * @example
   * ```typescript
   * const query = db.query('users')
   *   .select('*')
   *   .eq('email', 'test@example.com');
   * ```
   */
  query<T = any>(table: string): IQueryBuilder {
    return new SupabaseQueryBuilder<T>(this.client, table);
  }

  /**
   * Call remote procedure (SQL function)
   * 
   * @param functionName - Function name in database
   * @param params - Function parameters
   * @returns Function result
   * 
   * @example
   * ```typescript
   * const result = await db.rpc('nearby_users', {
   *   user_lat: 52.37,
   *   user_lng: 4.89,
   *   radius_km: 10
   * });
   * ```
   */
  async rpc<T = any>(
    functionName: string,
    params?: Record<string, any>
  ): Promise<{ data: T | null; error: any }> {
    this.logger.debug(`Calling RPC function: ${functionName}`, params);

    try {
      const { data, error } = await this.client.rpc(functionName, params);

      if (error) {
        this.logger.error(`RPC call failed: ${functionName}`, {
          error: error.message,
          params,
        });

        return {
          data: null,
          error: {
            message: error.message,
            code: error.code || 'RPC_ERROR',
          },
        };
      }

      this.logger.debug(`RPC call successful: ${functionName}`);
      return { data, error: null };
    } catch (error) {
      this.logger.error(`RPC call exception: ${functionName}`, error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'RPC call failed',
          code: 'UNKNOWN',
        },
      };
    }
  }

  /**
   * Subscribe to real-time changes
   * 
   * @param table - Table to subscribe to
   * @param event - Event type (INSERT, UPDATE, DELETE, *)
   * @param filter - Optional filter (e.g., 'id=eq.123')
   * @param callback - Callback function
   * @returns Subscription object with unsubscribe method
   * 
   * @example
   * ```typescript
   * const subscription = db.subscribe(
   *   'messages',
   *   'INSERT',
   *   'conversation_id=eq.123',
   *   (payload) => {
   *     console.log('New message:', payload);
   *   }
   * );
   * 
   * // Later, unsubscribe
   * subscription.unsubscribe();
   * ```
   */
  subscribe(
    table: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    filter?: string,
    callback?: (payload: any) => void
  ): { unsubscribe: () => void } {
    const channelName = `${table}:${event}:${filter || 'all'}`;

    // Reuse existing channel if available
    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.client
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: event === '*' ? '*' : event.toLowerCase() as any,
            schema: 'public',
            table,
            filter: filter ? filter : undefined,
          },
          (payload) => {
            this.logger.debug('Realtime event received', {
              table,
              event,
              payload,
            });

            if (callback) {
              callback(payload);
            }
          }
        )
        .subscribe();

      this.channels.set(channelName, channel);
    }

    return {
      unsubscribe: () => {
        if (channel) {
          this.client.removeChannel(channel);
          this.channels.delete(channelName);
          this.logger.debug('Unsubscribed from realtime channel', { channelName });
        }
      },
    };
  }

  /**
   * Set up auth state change listener
   * 
   * Logs auth state changes for debugging.
   */
  private setupAuthListener(): void {
    if (__DEV__) {
      this.client.auth.onAuthStateChange((event, session) => {
        this.logger.debug('Auth state changed', {
          event,
          userId: session?.user?.id,
        });
      });
    }
  }

  /**
   * Get underlying Supabase client
   * 
   * Use with caution - prefer using adapter methods.
   * 
   * @returns Supabase client instance
   */
  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Cleanup resources
   * 
   * Unsubscribes from all realtime channels.
   */
  cleanup(): void {
    this.channels.forEach((channel, name) => {
      this.client.removeChannel(channel);
      this.logger.debug('Cleaned up channel', { name });
    });
    this.channels.clear();
  }
}

