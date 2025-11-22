/**
 * User data source interface
 *
 * Defines the contract for low-level data operations.
 * This interface is implemented by specific data sources (Supabase, REST API, etc.)
 * and is used by repositories to perform actual data operations.
 *
 * @module data/datasources/IUserDataSource
 */

import { UserModel } from '../models/UserModel';

/**
 * User data source interface
 *
 * This interface abstracts the actual data source implementation.
 * It provides methods for CRUD operations at the data layer level,
 * working with data models rather than domain entities.
 *
 * @example
 * class SupabaseUserDataSource implements IUserDataSource {
 *   async getById(id: string): Promise<UserModel | null> {
 *     // Supabase query implementation
 *   }
 * }
 */
export interface IUserDataSource {
  /**
   * Retrieves a user by ID from the data source
   *
   * @param id - User's unique identifier
   * @returns User data model or null if not found
   * @throws {Error} If data source operation fails
   */
  getById(id: string): Promise<UserModel | null>;

  /**
   * Retrieves a user by email from the data source
   *
   * @param email - User's email address
   * @returns User data model or null if not found
   * @throws {Error} If data source operation fails
   */
  getByEmail(email: string): Promise<UserModel | null>;

  /**
   * Creates a new user in the data source
   *
   * @param user - User data model to create
   * @returns Created user data model
   * @throws {Error} If creation fails
   */
  create(user: UserModel): Promise<UserModel>;

  /**
   * Updates an existing user in the data source
   *
   * @param user - User data model with updated data
   * @returns Updated user data model
   * @throws {Error} If update fails
   */
  update(user: UserModel): Promise<UserModel>;

  /**
   * Deletes a user from the data source
   *
   * @param id - User's unique identifier
   * @returns True if deletion was successful
   * @throws {Error} If deletion fails
   */
  delete(id: string): Promise<boolean>;

  /**
   * Finds users matching specific criteria
   *
   * @param criteria - Search criteria
   * @returns Array of matching user data models
   * @throws {Error} If search fails
   */
  findByCriteria(criteria: {
    nativeLanguages?: string[];
    learningLanguages?: string[];
    limit?: number;
    offset?: number;
  }): Promise<UserModel[]>;
}
