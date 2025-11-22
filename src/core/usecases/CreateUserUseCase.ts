/**
 * Create user use case
 * 
 * Implements the business logic for creating a new user account.
 * This use case orchestrates the creation process, validates business rules,
 * and coordinates with repositories.
 * 
 * @module core/usecases/CreateUserUseCase
 */

import { User } from '../entities/User';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';

/**
 * Input data for creating a user
 */
export interface CreateUserInput {
  email: string;
  displayName: string;
  nativeLanguages: string[];
  learningLanguages: Array<{
    code: string;
    proficiency: string;
  }>;
  bio?: string;
  avatarUrl?: string;
}

/**
 * Result of user creation operation
 */
export interface CreateUserResult {
  user: User;
  success: boolean;
  message?: string;
}

/**
 * Create user use case
 * 
 * Handles the business logic for user registration. This includes:
 * - Validating input data
 * - Checking if user already exists
 * - Creating the user entity
 * - Persisting to repository
 * 
 * This use case follows the Single Responsibility Principle by focusing
 * solely on user creation logic.
 * 
 * @example
 * const useCase = new CreateUserUseCase(userRepository);
 * const result = await useCase.execute({
 *   email: 'user@example.com',
 *   displayName: 'John Doe',
 *   nativeLanguages: ['en'],
 *   learningLanguages: [{ code: 'es', proficiency: 'beginner' }],
 * });
 * 
 * if (result.success) {
 *   console.log('User created:', result.user.id);
 * }
 */
export class CreateUserUseCase {
  /**
   * Creates a new instance of CreateUserUseCase
   * 
   * @param userRepository - Repository for user data operations
   */
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the user creation use case
   * 
   * This method orchestrates the entire user creation process:
   * 1. Validates that user doesn't already exist
   * 2. Creates user entity with business rules validation
   * 3. Persists user to repository
   * 4. Returns result with created user
   * 
   * @param input - User creation input data
   * @returns Result containing created user or error information
   * @throws {Error} If repository operation fails unexpectedly
   * @example
   * const result = await createUserUseCase.execute({
   *   email: 'newuser@example.com',
   *   displayName: 'Jane Smith',
   *   nativeLanguages: ['fr'],
   *   learningLanguages: [{ code: 'en', proficiency: 'intermediate' }],
   * });
   */
  async execute(input: CreateUserInput): Promise<CreateUserResult> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        return {
          user: existingUser,
          success: false,
          message: 'User with this email already exists',
        };
      }

      // Generate user ID (in real implementation, this might come from auth system)
      const userId = this.generateUserId();

      // Create user entity (this will validate business rules)
      const user = new User(
        userId,
        input.email,
        input.displayName,
        input.nativeLanguages,
        input.learningLanguages.map(lang => ({
          code: lang.code,
          proficiency: lang.proficiency as any, // Type assertion for enum
        })),
        input.bio,
        input.avatarUrl,
        new Date(),
        new Date()
      );

      // Persist to repository
      const createdUser = await this.userRepository.create(user);

      return {
        user: createdUser,
        success: true,
        message: 'User created successfully',
      };
    } catch (error) {
      // Re-throw with context
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates a unique user ID
   * 
   * In a real implementation, this might use UUID or come from
   * an authentication system. This is a placeholder implementation.
   * 
   * @returns Generated user ID
   * @private
   */
  private generateUserId(): string {
    // TODO: Replace with proper UUID generation or use auth system ID
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

