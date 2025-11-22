/**
 * User data model (DTO)
 * 
 * Represents the user data structure as it exists in the database.
 * This is separate from the domain entity to maintain separation between
 * data layer and domain layer.
 * 
 * @module data/models/UserModel
 */

/**
 * User data model for database operations
 * 
 * This DTO (Data Transfer Object) represents how user data is stored
 * in the database. It's mapped to/from the domain User entity.
 * 
 * @example
 * const userModel: UserModel = {
 *   id: '123',
 *   email: 'user@example.com',
 *   display_name: 'John Doe',
 *   native_languages: ['en'],
 *   learning_languages: [{ code: 'es', proficiency: 'beginner' }],
 *   bio: 'Language enthusiast',
 *   avatar_url: 'https://...',
 *   created_at: '2024-01-01T00:00:00Z',
 *   updated_at: '2024-01-01T00:00:00Z',
 * };
 */
export interface UserModel {
  id: string;
  email: string;
  display_name: string;
  native_languages: string[];
  learning_languages: Array<{
    code: string;
    proficiency: string;
  }>;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

