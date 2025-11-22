/**
 * Supabase Query Builder
 * 
 * Wraps Supabase query builder with our IQueryBuilder interface.
 * Provides type-safe queries and consistent error handling.
 * 
 * @implements {IQueryBuilder}
 * 
 * @module infrastructure/database/supabase/SupabaseQueryBuilder
 * 
 * @example
 * ```typescript
 * const query = new SupabaseQueryBuilder(client, 'users');
 * const result = await query
 *   .select('id, name, email')
 *   .eq('id', userId)
 *   .single()
 *   .execute();
 * ```
 */

import { PostgrestFilterBuilder, SupabaseClient } from '@supabase/supabase-js';
import { IQueryBuilder, DatabaseResult } from '@/core/interfaces/IDatabase';
import { DatabaseError } from '@/shared/errors/DatabaseError';
import { Logger } from '@/shared/utils/logger';

/**
 * Supabase query builder implementation
 * 
 * @template T - Row type
 */
export class SupabaseQueryBuilder<T = any> implements IQueryBuilder {
  private query: any;
  private tableName: string;
  private logger = new Logger('SupabaseQueryBuilder');

  /**
   * Creates a new SupabaseQueryBuilder
   * 
   * @param client - Supabase client instance
   * @param table - Table name
   */
  constructor(
    private client: SupabaseClient,
    table: string
  ) {
    this.tableName = table;
    this.query = client.from(table);
  }

  /**
   * Select columns from table
   * 
   * @param columns - Columns to select (default: all)
   * @returns Query builder for chaining
   * 
   * @example
   * ```typescript
   * query.select('id, name, email')
   * query.select('*, user_languages(*)')  // With relations
   * ```
   */
  select(columns?: string): this {
    this.query = this.query.select(columns || '*');
    return this;
  }

  /**
   * Insert data into table
   * 
   * @param data - Data to insert (single object or array)
   * @returns Query builder for chaining
   */
  insert(data: Partial<T> | Partial<T>[]): this {
    this.query = this.query.insert(data);
    return this;
  }

  /**
   * Update data in table
   * 
   * @param data - Data to update
   * @returns Query builder for chaining
   */
  update(data: Partial<T>): this {
    this.query = this.query.update(data);
    return this;
  }

  /**
   * Delete from table
   * 
   * @returns Query builder for chaining
   */
  delete(): this {
    this.query = this.query.delete();
    return this;
  }

  /**
   * Filter: equal to
   * 
   * @param column - Column name
   * @param value - Value to match
   */
  eq(column: string, value: any): this {
    this.query = this.query.eq(column, value);
    return this;
  }

  /**
   * Filter: not equal to
   */
  neq(column: string, value: any): this {
    this.query = this.query.neq(column, value);
    return this;
  }

  /**
   * Filter: greater than
   */
  gt(column: string, value: any): this {
    this.query = this.query.gt(column, value);
    return this;
  }

  /**
   * Filter: greater than or equal
   */
  gte(column: string, value: any): this {
    this.query = this.query.gte(column, value);
    return this;
  }

  /**
   * Filter: less than
   */
  lt(column: string, value: any): this {
    this.query = this.query.lt(column, value);
    return this;
  }

  /**
   * Filter: less than or equal
   */
  lte(column: string, value: any): this {
    this.query = this.query.lte(column, value);
    return this;
  }

  /**
   * Filter: pattern matching
   * 
   * @example
   * ```typescript
   * query.like('name', '%john%')  // Contains "john"
   * query.like('email', 'test@%')  // Starts with "test@"
   * ```
   */
  like(column: string, pattern: string): this {
    this.query = this.query.like(column, pattern);
    return this;
  }

  /**
   * Filter: value in array
   * 
   * @example
   * ```typescript
   * query.in('status', ['active', 'pending'])
   * ```
   */
  in(column: string, values: any[]): this {
    this.query = this.query.in(column, values);
    return this;
  }

  /**
   * Order results
   * 
   * @param column - Column to sort by
   * @param ascending - Sort direction (default: true)
   */
  order(column: string, ascending: boolean = true): this {
    this.query = this.query.order(column, { ascending });
    return this;
  }

  /**
   * Limit number of results
   */
  limit(count: number): this {
    this.query = this.query.limit(count);
    return this;
  }

  /**
   * Expect single row result
   * 
   * Throws error if multiple rows returned.
   */
  single(): this {
    this.query = this.query.single();
    return this;
  }

  /**
   * Execute query and return result
   * 
   * Handles errors and logging.
   * 
   * @returns Promise with data and error
   * 
   * @throws {DatabaseError} If query fails
   */
  async execute<R = T>(): Promise<DatabaseResult<R>> {
    const startTime = Date.now();

    try {
      // Log query in development
      if (__DEV__) {
        this.logger.debug(`Executing query on ${this.tableName}`);
      }

      const { data, error } = await this.query;

      const duration = Date.now() - startTime;

      if (__DEV__) {
        this.logger.debug(`Query completed in ${duration}ms`, {
          table: this.tableName,
          rowCount: Array.isArray(data) ? data.length : data ? 1 : 0,
        });
      }

      if (error) {
        this.logger.error('Query failed', {
          table: this.tableName,
          error: error.message,
          code: error.code,
        });

        throw new DatabaseError(
          error.message,
          error.code,
          this.tableName
        );
      }

      return { data: data as R, error: null };
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error('Query execution failed', {
        table: this.tableName,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof DatabaseError) {
        return { data: null, error };
      }

      return {
        data: null,
        error: new DatabaseError(
          'Query execution failed',
          'UNKNOWN',
          this.tableName
        ),
      };
    }
  }

  /**
   * Execute query with automatic retry on failure
   * 
   * Useful for network issues or transient errors.
   * 
   * @param maxRetries - Maximum retry attempts (default: 3)
   * @param retryDelay - Delay between retries in ms (default: 1000)
   * 
   * @returns Promise with data and error
   */
  async executeWithRetry<R = T>(
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<DatabaseResult<R>> {
    let lastError: DatabaseError | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.execute<R>();

      if (!result.error) {
        return result;
      }

      lastError = result.error;

      // Don't retry on certain errors
      const noRetryErrors = ['PGRST116', 'PGRST301']; // Not found, auth errors
      if (noRetryErrors.includes(result.error.code)) {
        break;
      }

      if (attempt < maxRetries) {
        this.logger.warn(`Query failed, retrying (${attempt}/${maxRetries})`, {
          table: this.tableName,
          error: result.error.message,
        });

        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }

    return { data: null, error: lastError };
  }
}

