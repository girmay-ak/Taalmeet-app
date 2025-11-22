/**
 * Match entity
 *
 * Represents a language exchange match between two users.
 * This entity encapsulates the business logic for matching users
 * based on their language preferences.
 *
 * @module core/entities/Match
 */

import { User } from './User';

/**
 * Match status
 */
export enum MatchStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

/**
 * Match entity representing a potential or confirmed language exchange partnership
 *
 * A match occurs when two users can teach each other languages they want to learn.
 * This entity contains the business logic for match validation and status management.
 *
 * @example
 * const match = new Match({
 *   id: 'match-123',
 *   user1Id: 'user-1',
 *   user2Id: 'user-2',
 *   user1Teaches: 'en',
 *   user2Teaches: 'es',
 *   status: MatchStatus.PENDING,
 * });
 *
 * match.accept();
 * if (match.isActive()) {
 *   // Match is active and users can start exchanging
 * }
 */
export class Match {
  constructor(
    public readonly id: string,
    public readonly user1Id: string,
    public readonly user2Id: string,
    public readonly user1Teaches: string,
    public readonly user2Teaches: string,
    public status: MatchStatus = MatchStatus.PENDING,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    this.validate();
  }

  /**
   * Validates match business rules
   *
   * Ensures that:
   * - Users are different
   * - Languages being taught are different
   * - Match follows the language exchange principle (user1 teaches what user2 learns)
   *
   * @throws {Error} If match data violates business rules
   * @private
   */
  private validate(): void {
    if (this.user1Id === this.user2Id) {
      throw new Error('Cannot match a user with themselves');
    }

    if (this.user1Teaches === this.user2Teaches) {
      throw new Error('Users must teach different languages');
    }
  }

  /**
   * Checks if the match is valid for two users
   *
   * A valid match requires:
   * - User1 can teach a language that User2 wants to learn
   * - User2 can teach a language that User1 wants to learn
   *
   * @param user1 - First user
   * @param user2 - Second user
   * @returns True if users can form a valid match
   * @example
   * if (Match.isValidMatch(user1, user2)) {
   *   // Create match between users
   * }
   */
  static isValidMatch(user1: User, user2: User): boolean {
    const user1CanTeachUser2 = user1.nativeLanguages.some(lang => user2.isLearning(lang));
    const user2CanTeachUser1 = user2.nativeLanguages.some(lang => user1.isLearning(lang));

    return user1CanTeachUser2 && user2CanTeachUser1;
  }

  /**
   * Accepts the match
   *
   * Changes status to ACCEPTED and updates the timestamp.
   * Only pending matches can be accepted.
   *
   * @throws {Error} If match is not in pending status
   */
  accept(): void {
    if (this.status !== MatchStatus.PENDING) {
      throw new Error(`Cannot accept match with status: ${this.status}`);
    }
    this.status = MatchStatus.ACCEPTED;
    this.updatedAt = new Date();
  }

  /**
   * Rejects the match
   *
   * Changes status to REJECTED and updates the timestamp.
   * Only pending matches can be rejected.
   *
   * @throws {Error} If match is not in pending status
   */
  reject(): void {
    if (this.status !== MatchStatus.PENDING) {
      throw new Error(`Cannot reject match with status: ${this.status}`);
    }
    this.status = MatchStatus.REJECTED;
    this.updatedAt = new Date();
  }

  /**
   * Checks if the match is active
   *
   * An active match is one that has been accepted and can be used
   * for language exchange activities.
   *
   * @returns True if match is active
   */
  isActive(): boolean {
    return this.status === MatchStatus.ACCEPTED;
  }
}
