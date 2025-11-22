/**
 * Supabase Authentication Provider
 * 
 * Handles all authentication operations.
 * Implements IAuthProvider interface.
 * 
 * Supports:
 * - Email/password authentication
 * - OAuth (Google, Apple)
 * - Session management
 * - Token refresh
 * 
 * @implements {IAuthProvider}
 * 
 * @module infrastructure/database/supabase/SupabaseAuthProvider
 */

import { SupabaseClient, Session, User, AuthError } from '@supabase/supabase-js';
import { IAuthProvider, AuthResult } from '@/core/interfaces/IDatabase';
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
   * Sign up with email and password
   * 
   * @param email - User email
   * @param password - User password
   * @param metadata - Additional user data (name, etc.)
   * @returns Auth result with user and session
   * 
   * @throws {AuthError} If signup fails
   * 
   * @example
   * ```typescript
   * const result = await auth.signUp(
   *   'test@example.com',
   *   'SecurePass123!',
   *   { name: 'Test User' }
   * );
   * ```
   */
  async signUp(
    email: string,
    password: string,
    metadata?: Record<string, any>
  ): Promise<AuthResult> {
    this.logger.info('Signing up user', { email });

    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: undefined, // Not needed for mobile
        },
      });

      if (error) {
        this.logger.error('Signup failed', {
          email,
          error: error.message,
          code: error.status,
        });
        return { user: null, session: null, error };
      }

      this.logger.info('Signup successful', {
        userId: data.user?.id,
        emailConfirmed: data.user?.email_confirmed_at != null,
      });

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      this.logger.error('Signup exception', { error });
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in with email and password
   * 
   * @param email - User email
   * @param password - User password
   * @returns Auth result with user and session
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    this.logger.info('Signing in user', { email });

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.logger.error('Sign in failed', {
          email,
          error: error.message,
        });
        return { user: null, session: null, error };
      }

      this.logger.info('Sign in successful', { userId: data.user?.id });

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      this.logger.error('Sign in exception', { error });
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in with OAuth provider
   * 
   * @param provider - OAuth provider (google, apple, facebook)
   * @returns Auth result
   * 
   * @example
   * ```typescript
   * const result = await auth.signInWithOAuth('google');
   * ```
   */
  async signInWithOAuth(
    provider: 'google' | 'apple' | 'facebook'
  ): Promise<AuthResult> {
    this.logger.info('OAuth sign in', { provider });

    try {
      const { data, error } = await this.client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: undefined, // Not needed for mobile
          skipBrowserRedirect: true, // Mobile handles redirect differently
        },
      });

      if (error) {
        this.logger.error('OAuth sign in failed', { provider, error: error.message });
        return { user: null, session: null, error };
      }

      // Note: For mobile, OAuth requires additional handling with deep links
      // This returns the OAuth URL that should be opened in a browser
      this.logger.info('OAuth initiated', { provider, url: data.url });

      return {
        user: null,
        session: null,
        error: null,
      };
    } catch (error) {
      this.logger.error('OAuth exception', { provider, error });
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign out current user
   * 
   * Clears session and tokens.
   */
  async signOut(): Promise<void> {
    this.logger.info('Signing out user');

    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        this.logger.error('Sign out failed', { error: error.message });
        throw error;
      }

      this.logger.info('Sign out successful');
    } catch (error) {
      this.logger.error('Sign out exception', { error });
      throw error;
    }
  }

  /**
   * Get current session
   * 
   * @returns Current session or null if not authenticated
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await this.client.auth.getSession();

      if (error) {
        this.logger.error('Get session failed', { error: error.message });
        return null;
      }

      return data.session;
    } catch (error) {
      this.logger.error('Get session exception', { error });
      return null;
    }
  }

  /**
   * Get current user
   * 
   * @returns Current user or null if not authenticated
   */
  async getUser(): Promise<User | null> {
    try {
      const { data, error } = await this.client.auth.getUser();

      if (error) {
        this.logger.error('Get user failed', { error: error.message });
        return null;
      }

      return data.user;
    } catch (error) {
      this.logger.error('Get user exception', { error });
      return null;
    }
  }

  /**
   * Request password reset
   * 
   * Sends password reset email to user.
   * 
   * @param email - User email
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    this.logger.info('Requesting password reset', { email });

    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: 'taalmeet://reset-password', // Deep link for mobile
      });

      if (error) {
        this.logger.error('Password reset request failed', {
          email,
          error: error.message,
        });
        return { error };
      }

      this.logger.info('Password reset email sent', { email });
      return { error: null };
    } catch (error) {
      this.logger.error('Password reset exception', { error });
      return { error: error as AuthError };
    }
  }

  /**
   * Update user password
   * 
   * @param newPassword - New password
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    this.logger.info('Updating password');

    try {
      const { error } = await this.client.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        this.logger.error('Password update failed', { error: error.message });
        return { error };
      }

      this.logger.info('Password updated successfully');
      return { error: null };
    } catch (error) {
      this.logger.error('Password update exception', { error });
      return { error: error as AuthError };
    }
  }

  /**
   * Refresh session token
   * 
   * Called automatically by Supabase client, but can be called manually.
   */
  async refreshSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    this.logger.debug('Refreshing session');

    try {
      const { data, error } = await this.client.auth.refreshSession();

      if (error) {
        this.logger.error('Session refresh failed', { error: error.message });
        return { session: null, error };
      }

      this.logger.debug('Session refreshed');
      return { session: data.session, error: null };
    } catch (error) {
      this.logger.error('Session refresh exception', { error });
      return { session: null, error: error as AuthError };
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
