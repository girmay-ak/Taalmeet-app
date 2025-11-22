/**
 * User entity
 * 
 * Represents a user in the domain model. This is a pure business entity
 * with no framework dependencies. It contains only business logic and
 * validation rules.
 * 
 * @module core/entities/User
 */

/**
 * User proficiency level in a language
 */
export enum LanguageProficiency {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  NATIVE = 'native',
}

/**
 * User entity representing a language exchange participant
 * 
 * This is a domain entity that encapsulates user-related business logic.
 * It has no knowledge of databases, APIs, or UI frameworks.
 * 
 * @example
 * const user = new User({
 *   id: '123',
 *   email: 'user@example.com',
 *   displayName: 'John Doe',
 *   nativeLanguages: ['en'],
 *   learningLanguages: [{ code: 'es', proficiency: LanguageProficiency.BEGINNER }],
 * });
 * 
 * if (user.canTeach('en')) {
 *   // User can teach English
 * }
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly displayName: string,
    public readonly nativeLanguages: string[],
    public readonly learningLanguages: Array<{
      code: string;
      proficiency: LanguageProficiency;
    }>,
    public readonly bio?: string,
    public readonly avatarUrl?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    this.validate();
  }

  /**
   * Validates user entity business rules
   * 
   * Ensures the user has at least one native language and one learning language,
   * which are core requirements for a language exchange platform.
   * 
   * @throws {Error} If user data violates business rules
   * @private
   */
  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Valid email is required');
    }

    if (!this.displayName || this.displayName.trim().length === 0) {
      throw new Error('Display name is required');
    }

    if (!this.nativeLanguages || this.nativeLanguages.length === 0) {
      throw new Error('At least one native language is required');
    }

    if (!this.learningLanguages || this.learningLanguages.length === 0) {
      throw new Error('At least one learning language is required');
    }
  }

  /**
   * Checks if the user can teach a specific language
   * 
   * A user can teach a language if it's in their native languages list.
   * 
   * @param languageCode - ISO 639-1 language code (e.g., 'en', 'es')
   * @returns True if user can teach the language
   * @example
   * if (user.canTeach('en')) {
   *   // Match with users learning English
   * }
   */
  canTeach(languageCode: string): boolean {
    return this.nativeLanguages.includes(languageCode.toLowerCase());
  }

  /**
   * Checks if the user is learning a specific language
   * 
   * @param languageCode - ISO 639-1 language code
   * @returns True if user is learning the language
   */
  isLearning(languageCode: string): boolean {
    return this.learningLanguages.some(
      lang => lang.code.toLowerCase() === languageCode.toLowerCase()
    );
  }

  /**
   * Gets the proficiency level for a learning language
   * 
   * @param languageCode - ISO 639-1 language code
   * @returns Proficiency level or undefined if not learning the language
   */
  getProficiency(languageCode: string): LanguageProficiency | undefined {
    const lang = this.learningLanguages.find(
      l => l.code.toLowerCase() === languageCode.toLowerCase()
    );
    return lang?.proficiency;
  }

  /**
   * Validates email format
   * 
   * @param email - Email address to validate
   * @returns True if email format is valid
   * @private
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

