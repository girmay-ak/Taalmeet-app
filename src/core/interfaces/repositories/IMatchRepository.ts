/**
 * Match repository interface
 * 
 * Defines the contract for match data access operations.
 * This abstraction allows the core domain to remain independent of
 * the data persistence layer.
 * 
 * @module core/interfaces/repositories/IMatchRepository
 */

import { Match, MatchStatus } from '../../entities/Match';

/**
 * Match repository interface
 * 
 * Abstracts all match-related data operations. Implementations can use
 * any data source (Supabase, Firebase, etc.) without affecting business logic.
 * 
 * @example
 * class SupabaseMatchRepository implements IMatchRepository {
 *   async create(match: Match): Promise<Match> {
 *     // Supabase implementation
 *   }
 * }
 */
export interface IMatchRepository {
  /**
   * Creates a new match
   * 
   * @param match - Match entity to create
   * @returns Created match entity
   * @throws {Error} If match creation fails
   * @example
   * const match = new Match({...});
   * const created = await matchRepository.create(match);
   */
  create(match: Match): Promise<Match>;

  /**
   * Finds a match by ID
   * 
   * @param id - Match unique identifier
   * @returns Match entity or null if not found
   * @throws {Error} If database operation fails
   */
  findById(id: string): Promise<Match | null>;

  /**
   * Finds matches for a specific user
   * 
   * @param userId - User's unique identifier
   * @param status - Optional status filter
   * @returns Array of matches for the user
   * @throws {Error} If database operation fails
   * @example
   * const matches = await matchRepository.findByUserId('user-123', MatchStatus.ACCEPTED);
   */
  findByUserId(userId: string, status?: MatchStatus): Promise<Match[]>;

  /**
   * Finds a match between two specific users
   * 
   * @param user1Id - First user's ID
   * @param user2Id - Second user's ID
   * @returns Match entity or null if not found
   * @throws {Error} If database operation fails
   */
  findByUsers(user1Id: string, user2Id: string): Promise<Match | null>;

  /**
   * Updates an existing match
   * 
   * @param match - Match entity with updated data
   * @returns Updated match entity
   * @throws {Error} If match not found or update fails
   */
  update(match: Match): Promise<Match>;

  /**
   * Deletes a match by ID
   * 
   * @param id - Match unique identifier
   * @returns True if deletion was successful
   * @throws {Error} If match not found or deletion fails
   */
  delete(id: string): Promise<boolean>;
}

