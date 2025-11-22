/**
 * Supabase Authentication Provider
 * 
 * Implements IAuthProvider interface using Supabase Auth.
 * 
 * @implements {IAuthProvider}
 * 
 * @module infrastructure/database/supabase/SupabaseAuthProvider
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { IAuthProvider, DatabaseResult } from '@/core/interfaces/IDatabase';
import { DatabaseError } from '@/shared/errors/DatabaseError';
import { Logger } from '@/shared/utils/logger';

/**
 * Supabase authentication provider
 */
export class SupabaseAuthProvider implements IAuthProvider {
  private logger = new Logger('SupabaseAuthProvider');

  /**
   * Creates a new SupabaseAuthProvider
   * 
   * @param client - Supabase client instance
   */
  constructor(private client: SupabaseClient) {}

  /**
   * Sign up new user
   * 
   * @param email - User email
   * @param password - User password
   * @param metadata - Additional user metadata
   * @returns Sign up result
   */
  async signUp(
    email: string,
    password: string,
    metadata?: Record<string, any>
  ): Promise<DatabaseResult<any>> {
    try {
      this.logger.debug('Signing up user', { email });

      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        this.logger.error('Sign up failed', { error: error.message });
        return {
          data: null,
          error: {
            message: error.message,
            code: error.status?.toString() || 'AUTH_ERROR',
          },
        };
      }

      this.logger.info('User signed up successfully', { userId: data.user?.id });
      return { data, error: null };
    } catch (error) {
      this.logger.error('Sign up exception', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Sign up failed',
          code: 'UNKNOWN',
        },
      };
    }
  }

  /**
   * Sign in user
   * 
   * @param email - User email
   * @param password - User password
   * @returns Sign in result
   */
  async signIn(email: string, password: string): Promise<DatabaseResult<any>> {
    try {
      this.logger.debug('Signing in user', { email });

      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.logger.error('Sign in failed', { error: error.message });
        return {
          data: null,
          error: {
            message: error.message,
            code: error.status?.toString() || 'AUTH_ERROR',
          },
        };
      }

      this.logger.info('User signed in successfully', { userId: data.user?.id });
      return { data, error: null };
    } catch (error) {
      this.logger.error('Sign in exception', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Sign in failed',
          code: 'UNKNOWN',
        },
      };
    }
  }

  /**
   * Sign out current user
   * 
   * @returns Sign out result
   */
  async signOut(): Promise<DatabaseResult<void>> {
    try {
      this.logger.debug('Signing out user');

      const { error } = await this.client.auth.signOut();

      if (error) {
        this.logger.error('Sign out failed', { error: error.message });
        return {
          data: null,
          error: {
            message: error.message,
            code: error.status?.toString() || 'AUTH_ERROR',
          },
        };
      }

      this.logger.info('User signed out successfully');
      return { data: undefined, error: null };
    } catch (error) {
      this.logger.error('Sign out exception', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Sign out failed',
          code: 'UNKNOWN',
        },
      };
    }
  }

  /**
   * Get current user
   * 
   * @returns Current user or null
   */
  async getUser(): Promise<DatabaseResult<any>> {
    try {
      const { data, error } = await this.client.auth.getUser();

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.status?.toString() || 'AUTH_ERROR',
          },
        };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Get user failed',
          code: 'UNKNOWN',
        },
      };
    }
  }

  /**
   * Get current session
   * 
   * @returns Current session or null
   */
  async getSession(): Promise<DatabaseResult<any>> {
    try {
      const { data, error } = await this.client.auth.getSession();

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.status?.toString() || 'AUTH_ERROR',
          },
        };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Get session failed',
          code: 'UNKNOWN',
        },
      };
    }
  }

  /**
   * Listen to auth state changes
   * 
   * @param callback - Callback function
   * @returns Subscription object with unsubscribe method
   */
  onAuthStateChange(
    callback: (event: string, session: any) => void
  ): { unsubscribe: () => void } {
    const { data } = this.client.auth.onAuthStateChange((event, session) => {
      this.logger.debug('Auth state changed', { event });
      callback(event, session);
    });

    return {
      unsubscribe: () => {
        data.subscription.unsubscribe();
      },
    };
  }
}

