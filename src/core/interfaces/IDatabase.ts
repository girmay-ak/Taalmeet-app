/**
 * Database Interface
 * 
 * Defines the contract for database operations.
 * This interface allows the application to be database-agnostic.
 * 
 * Implementations can use Supabase, Firebase, PostgreSQL, etc.
 * 
 * @module core/interfaces/IDatabase
 */

/**
 * Database operation result
 * 
 * @template T - Data type
 */
export interface DatabaseResult<T> {
  data: T | null;
  error: DatabaseError | null;
}

/**
 * Database error type
 */
export interface DatabaseError {
  message: string;
  code: string;
  table?: string;
}

/**
 * Query builder interface
 * 
 * Provides a fluent API for building database queries.
 */
export interface IQueryBuilder {
  /**
   * Select columns
   */
  select(columns?: string): this;

  /**
   * Insert data
   */
  insert<T = any>(data: Partial<T> | Partial<T>[]): this;

  /**
   * Update data
   */
  update<T = any>(data: Partial<T>): this;

  /**
   * Delete rows
   */
  delete(): this;

  /**
   * Filter: equal to
   */
  eq(column: string, value: any): this;

  /**
   * Filter: not equal to
   */
  neq(column: string, value: any): this;

  /**
   * Filter: greater than
   */
  gt(column: string, value: any): this;

  /**
   * Filter: greater than or equal
   */
  gte(column: string, value: any): this;

  /**
   * Filter: less than
   */
  lt(column: string, value: any): this;

  /**
   * Filter: less than or equal
   */
  lte(column: string, value: any): this;

  /**
   * Filter: pattern matching
   */
  like(column: string, pattern: string): this;

  /**
   * Filter: value in array
   */
  in(column: string, values: any[]): this;

  /**
   * Order results
   */
  order(column: string, ascending?: boolean): this;

  /**
   * Limit results
   */
  limit(count: number): this;

  /**
   * Expect single result
   */
  single(): this;

  /**
   * Execute query
   */
  execute<T = any>(): Promise<DatabaseResult<T>>;

  /**
   * Execute query with retry
   */
  executeWithRetry<T = any>(
    maxRetries?: number,
    retryDelay?: number
  ): Promise<DatabaseResult<T>>;
}

/**
 * Authentication result
 */
export interface AuthResult {
  user: any | null;
  session: any | null;
  error: any | null;
}

/**
 * Authentication provider interface
 */
export interface IAuthProvider {
  /**
   * Sign up new user
   */
  signUp(email: string, password: string, metadata?: Record<string, any>): Promise<AuthResult>;

  /**
   * Sign in user
   */
  signIn(email: string, password: string): Promise<AuthResult>;

  /**
   * Sign in with OAuth provider
   */
  signInWithOAuth?(provider: 'google' | 'apple' | 'facebook'): Promise<AuthResult>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Get current user
   */
  getUser(): Promise<any | null>;

  /**
   * Get current session
   */
  getSession(): Promise<any | null>;

  /**
   * Request password reset
   */
  resetPassword?(email: string): Promise<{ error: any | null }>;

  /**
   * Update user password
   */
  updatePassword?(newPassword: string): Promise<{ error: any | null }>;

  /**
   * Refresh session token
   */
  refreshSession?(): Promise<{ session: any | null; error: any | null }>;

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void): { unsubscribe: () => void };
}

/**
 * Storage provider interface
 */
export interface IStorageProvider {
  /**
   * Upload file
   */
  upload(bucket: string, path: string, file: any): Promise<string>;

  /**
   * Download file
   */
  download(bucket: string, path: string): Promise<Blob>;

  /**
   * Get public URL
   */
  getPublicUrl(bucket: string, path: string): string;

  /**
   * Delete file
   */
  delete(bucket: string, path: string): Promise<void>;

  /**
   * Create signed URL for private file (optional)
   */
  createSignedUrl?(bucket: string, path: string, expiresIn?: number): Promise<string>;
}

/**
 * Database interface
 * 
 * Main interface for database operations.
 * Provides query building, RPC calls, real-time subscriptions, etc.
 */
export interface IDatabase {
  /**
   * Get authentication provider
   */
  readonly auth: IAuthProvider;

  /**
   * Get storage provider
   */
  readonly storage: IStorageProvider;

  /**
   * Create query builder for table
   */
  query<T = any>(table: string): IQueryBuilder;

  /**
   * Call remote procedure (SQL function)
   */
  rpc<T = any>(functionName: string, params?: Record<string, any>): Promise<DatabaseResult<T>>;

  /**
   * Subscribe to real-time changes
   */
  subscribe(
    table: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    filter?: string,
    callback?: (payload: any) => void
  ): { unsubscribe: () => void };
}

