/**
 * Find matches use case
 * 
 * Implements the business logic for finding potential language exchange matches.
 * This use case applies matching algorithms and business rules to find
 * compatible users.
 * 
 * @module core/usecases/FindMatchesUseCase
 */

import { User } from '../entities/User';
import { Match } from '../entities/Match';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { IMatchRepository } from '../interfaces/repositories/IMatchRepository';

/**
 * Input for finding matches
 */
export interface FindMatchesInput {
  userId: string;
  limit?: number;
  excludeExistingMatches?: boolean;
}

/**
 * Result containing matched users and match information
 */
export interface FindMatchesResult {
  matches: Array<{
    user: User;
    match: Match;
    compatibilityScore: number;
  }>;
  totalFound: number;
}

/**
 * Find matches use case
 * 
 * Finds potential language exchange partners for a user based on:
 * - Language compatibility (user can teach what other wants to learn)
 * - Reciprocal learning (other can teach what user wants to learn)
 * - Existing matches (optionally exclude already matched users)
 * 
 * This use case implements the Strategy pattern for matching algorithms,
 * allowing different matching strategies to be used interchangeably.
 * 
 * @example
 * const useCase = new FindMatchesUseCase(userRepository, matchRepository);
 * const result = await useCase.execute({
 *   userId: 'user-123',
 *   limit: 10,
 *   excludeExistingMatches: true,
 * });
 * 
 * result.matches.forEach(({ user, compatibilityScore }) => {
 *   console.log(`Match: ${user.displayName}, Score: ${compatibilityScore}`);
 * });
 */
export class FindMatchesUseCase {
  /**
   * Creates a new instance of FindMatchesUseCase
   * 
   * @param userRepository - Repository for user data operations
   * @param matchRepository - Repository for match data operations
   */
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly matchRepository: IMatchRepository
  ) {}

  /**
   * Executes the match finding use case
   * 
   * This method:
   * 1. Retrieves the requesting user
   * 2. Finds potential matches based on language compatibility
   * 3. Calculates compatibility scores
   * 4. Filters out existing matches if requested
   * 5. Returns ranked matches
   * 
   * @param input - Match finding input parameters
   * @returns Result containing matched users with compatibility scores
   * @throws {Error} If user not found or repository operations fail
   * @example
   * const result = await findMatchesUseCase.execute({
   *   userId: 'user-123',
   *   limit: 5,
   * });
   */
  async execute(input: FindMatchesInput): Promise<FindMatchesResult> {
    // Get the requesting user
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error(`User not found: ${input.userId}`);
    }

    // Get existing matches if we need to exclude them
    let existingMatchUserIds: Set<string> = new Set();
    if (input.excludeExistingMatches) {
      const existingMatches = await this.matchRepository.findByUserId(input.userId);
      existingMatches.forEach(match => {
        if (match.user1Id === input.userId) {
          existingMatchUserIds.add(match.user2Id);
        } else {
          existingMatchUserIds.add(match.user1Id);
        }
      });
    }

    // Find potential matches based on language compatibility
    const potentialMatches = await this.findPotentialMatches(user, existingMatchUserIds);

    // Calculate compatibility scores and create match entities
    const matchesWithScores = potentialMatches
      .map(potentialUser => {
        const compatibilityScore = this.calculateCompatibilityScore(user, potentialUser);
        const match = this.createMatchEntity(user, potentialUser);
        return {
          user: potentialUser,
          match,
          compatibilityScore,
        };
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore) // Sort by score descending
      .slice(0, input.limit || 10); // Apply limit

    return {
      matches: matchesWithScores,
      totalFound: potentialMatches.length,
    };
  }

  /**
   * Finds potential matches based on language compatibility
   * 
   * @param user - User to find matches for
   * @param excludeUserIds - Set of user IDs to exclude
   * @returns Array of potential matching users
   * @private
   */
  private async findPotentialMatches(
    user: User,
    excludeUserIds: Set<string>
  ): Promise<User[]> {
    // Find users who are learning languages that this user can teach
    const usersLearningMyLanguages = await this.userRepository.findByCriteria({
      learningLanguages: user.nativeLanguages,
      limit: 100, // Get more candidates for better matching
    });

    // Filter to only include users who can teach languages this user wants to learn
    const compatibleUsers = usersLearningMyLanguages.filter(potentialUser => {
      // Exclude self
      if (potentialUser.id === user.id) {
        return false;
      }

      // Exclude already matched users
      if (excludeUserIds.has(potentialUser.id)) {
        return false;
      }

      // Check if potential user can teach any language this user wants to learn
      const canTeachMe = potentialUser.nativeLanguages.some(lang =>
        user.isLearning(lang)
      );

      return canTeachMe;
    });

    return compatibleUsers;
  }

  /**
   * Calculates compatibility score between two users
   * 
   * The score is based on:
   * - Number of languages they can exchange
   * - Proficiency levels alignment
   * - Reciprocal teaching potential
   * 
   * @param user1 - First user
   * @param user2 - Second user
   * @returns Compatibility score (0-100)
   * @private
   */
  private calculateCompatibilityScore(user1: User, user2: User): number {
    let score = 0;

    // Count languages user1 can teach that user2 wants to learn
    const languagesUser1CanTeach = user1.nativeLanguages.filter(lang =>
      user2.isLearning(lang)
    );
    score += languagesUser1CanTeach.length * 30;

    // Count languages user2 can teach that user1 wants to learn
    const languagesUser2CanTeach = user2.nativeLanguages.filter(lang =>
      user1.isLearning(lang)
    );
    score += languagesUser2CanTeach.length * 30;

    // Bonus for multiple language exchanges
    if (languagesUser1CanTeach.length > 1 || languagesUser2CanTeach.length > 1) {
      score += 10;
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Creates a match entity for two users
   * 
   * @param user1 - First user
   * @param user2 - Second user
   * @returns Match entity (not yet persisted)
   * @private
   */
  private createMatchEntity(user1: User, user2: User): Match {
    // Find the languages they can exchange
    const user1Teaches = user1.nativeLanguages.find(lang => user2.isLearning(lang)) || '';
    const user2Teaches = user2.nativeLanguages.find(lang => user1.isLearning(lang)) || '';

    return new Match(
      `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user1.id,
      user2.id,
      user1Teaches,
      user2Teaches,
      undefined, // Status will be set when match is created
      new Date(),
      new Date()
    );
  }
}

