/**
 * Match data model (DTO)
 * 
 * Represents the match data structure as it exists in the database.
 * 
 * @module data/models/MatchModel
 */

/**
 * Match data model for database operations
 */
export interface MatchModel {
  id: string;
  user1_id: string;
  user2_id: string;
  user1_teaches: string;
  user2_teaches: string;
  status: string;
  created_at: string;
  updated_at: string;
}

