/**
 * User repository interface
 *
 * Defines the contract for user data access operations.
 * This interface follows the Repository pattern and Dependency Inversion principle,
 * allowing the core domain to remain independent of data layer implementations.
 *
 * @module core/interfaces/repositories/IUserRepository
 */

import { User } from '../../entities/User';

/**
 * User repository interface
 *
 * This interface abstracts data access operations for users.
 * Implementations can use Supabase, Firebase, REST APIs, or any other data source.
 * The core domain depends on this interface, not on concrete implementations.
 *
 * @example
 * class SupabaseUserRepository implements IUserRepository {
 *   async findById(id: string): Promise<User | null> {
 *     // Supabase implementation
 *   }
 * }
 */
export interface IUserRepository {
  /**
   * Finds a user by their unique identifier
   *
   * @param id - User's unique identifier
   * @returns User entity or null if not found
   * @throws {Error} If database operation fails
   * @example
   * const user = await userRepository.findById('user-123');
   * if (user) {
   *   console.log(user.displayName);
   * }
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their email address
   *
   * @param email - User's email address
   * @returns User entity or null if not found
   * @throws {Error} If database operation fails
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Creates a new user
   *
   * @param user - User entity to create
   * @returns Created user entity with generated ID
   * @throws {Error} If user creation fails or validation errors occur
   * @example
   * const newUser = new User({...});
   * const created = await userRepository.create(newUser);
   */
  create(user: User): Promise<User>;

  /**
   * Updates an existing user
   *
   * @param user - User entity with updated data
   * @returns Updated user entity
   * @throws {Error} If user not found or update fails
   */
  update(user: User): Promise<User>;

  /**
   * Deletes a user by ID
   *
   * @param id - User's unique identifier
   * @returns True if deletion was successful
   * @throws {Error} If user not found or deletion fails
   */
  delete(id: string): Promise<boolean>;

  /**
   * Finds users that match specific criteria
   *
   * @param criteria - Search criteria (language codes, proficiency, etc.)
   * @returns Array of matching users
   * @throws {Error} If search operation fails
   * @example
   * const users = await userRepository.findByCriteria({
   *   nativeLanguages: ['en'],
   *   learningLanguages: ['es'],
   * });
   */
  findByCriteria(criteria: {
    nativeLanguages?: string[];
    learningLanguages?: string[];
    limit?: number;
    offset?: number;
  }): Promise<User[]>;
}
