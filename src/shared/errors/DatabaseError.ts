/**
 * Database Error
 * 
 * Custom error class for database-related errors.
 * Provides structured error information including error code and table name.
 * 
 * @module shared/errors/DatabaseError
 */

/**
 * Database error class
 * 
 * Extends Error with additional database-specific information.
 * 
 * @example
 * ```typescript
 * throw new DatabaseError('User not found', 'PGRST116', 'users');
 * ```
 */
export class DatabaseError extends Error {
  /**
   * Error code from database (e.g., 'PGRST116' for not found)
   */
  public readonly code: string;

  /**
   * Table name where error occurred
   */
  public readonly table?: string;

  /**
   * Original error (if any)
   */
  public readonly originalError?: Error;

  /**
   * Creates a new DatabaseError
   * 
   * @param message - Error message
   * @param code - Error code
   * @param table - Table name (optional)
   * @param originalError - Original error (optional)
   */
  constructor(
    message: string,
    code: string = 'UNKNOWN',
    table?: string,
    originalError?: Error
  ) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.table = table;
    this.originalError = originalError;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }

  /**
   * Check if error is a "not found" error
   */
  isNotFound(): boolean {
    return this.code === 'PGRST116';
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return this.code === 'PGRST301' || this.code === 'PGRST302';
  }

  /**
   * Check if error is a constraint violation
   */
  isConstraintError(): boolean {
    return this.code.startsWith('23505') || this.code.startsWith('23503');
  }

  /**
   * Convert error to JSON
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      table: this.table,
      stack: this.stack,
    };
  }
}

