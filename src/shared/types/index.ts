/**
 * Shared TypeScript types and interfaces
 * 
 * Contains common types used across multiple layers of the application.
 * These types are framework-agnostic and can be used in core, data, and presentation layers.
 * 
 * @module shared/types
 */

/**
 * Result type for operations that can succeed or fail
 * 
 * This type is useful for operations that need to return either
 * a success value or an error, without throwing exceptions.
 * 
 * @template T - Type of the success value
 * @example
 * type CreateUserResult = Result<User, string>;
 * const result: CreateUserResult = { success: true, data: user };
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Optional type utility
 * 
 * Makes all properties of a type optional recursively.
 * 
 * @template T - Type to make optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Paginated response
 * 
 * @template T - Type of items in the paginated list
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

