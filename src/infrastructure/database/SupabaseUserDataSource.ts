/**
 * Supabase user data source implementation
 *
 * Concrete implementation of IUserDataSource using Supabase.
 * This class handles direct database operations for user data.
 *
 * @module infrastructure/database/SupabaseUserDataSource
 */

import { IUserDataSource } from '@data/datasources/IUserDataSource';
import { UserModel } from '@data/models/UserModel';
import { getDatabase } from './database';
import { DatabaseError } from '@/shared/errors/DatabaseError';

/**
 * Supabase user data source
 *
 * Implements user data operations using Supabase as the backend.
 * This class is responsible for translating between application
 * data models and Supabase database queries.
 *
 * @example
 * const dataSource = new SupabaseUserDataSource();
 * const user = await dataSource.getById('user-123');
 */
export class SupabaseUserDataSource implements IUserDataSource {
  private readonly tableName = 'users';

  /**
   * @inheritdoc
   */
  async getById(id: string): Promise<UserModel | null> {
    const db = getDatabase();
    const result = await db
      .query(this.tableName)
      .select('*')
      .eq('id', id)
      .single()
      .execute();

    if (result.error) {
      if (result.error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new DatabaseError(
        `Failed to get user by ID: ${result.error.message}`,
        result.error.code,
        this.tableName
      );
    }

    return this.mapToUserModel(result.data);
  }

  /**
   * @inheritdoc
   */
  async getByEmail(email: string): Promise<UserModel | null> {
    const db = getDatabase();
    const result = await db
      .query(this.tableName)
      .select('*')
      .eq('email', email)
      .single()
      .execute();

    if (result.error) {
      if (result.error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new DatabaseError(
        `Failed to get user by email: ${result.error.message}`,
        result.error.code,
        this.tableName
      );
    }

    return this.mapToUserModel(result.data);
  }

  /**
   * @inheritdoc
   */
  async create(user: UserModel): Promise<UserModel> {
    const db = getDatabase();
    const result = await db
      .query(this.tableName)
      .insert(this.mapFromUserModel(user))
      .single()
      .execute();

    if (result.error) {
      throw new DatabaseError(
        `Failed to create user: ${result.error.message}`,
        result.error.code,
        this.tableName
      );
    }

    return this.mapToUserModel(result.data);
  }

  /**
   * @inheritdoc
   */
  async update(user: UserModel): Promise<UserModel> {
    const db = getDatabase();
    const result = await db
      .query(this.tableName)
      .update(this.mapFromUserModel(user))
      .eq('id', user.id)
      .single()
      .execute();

    if (result.error) {
      throw new DatabaseError(
        `Failed to update user: ${result.error.message}`,
        result.error.code,
        this.tableName
      );
    }

    return this.mapToUserModel(result.data);
  }

  /**
   * @inheritdoc
   */
  async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db
      .query(this.tableName)
      .delete()
      .eq('id', id)
      .execute();

    if (result.error) {
      throw new DatabaseError(
        `Failed to delete user: ${result.error.message}`,
        result.error.code,
        this.tableName
      );
    }

    return true;
  }

  /**
   * @inheritdoc
   */
  async findByCriteria(criteria: {
    nativeLanguages?: string[];
    learningLanguages?: string[];
    limit?: number;
    offset?: number;
  }): Promise<UserModel[]> {
    const db = getDatabase();
    let query = db.query(this.tableName).select('*');

    // Apply language filters if provided
    if (criteria.nativeLanguages && criteria.nativeLanguages.length > 0) {
      // This would require a join with user_languages table
      // For now, we'll do a simple query and filter in memory
      // TODO: Implement proper join query
    }

    if (criteria.limit) {
      query = query.limit(criteria.limit);
    }

    const result = await query.execute();

    if (result.error) {
      throw new DatabaseError(
        `Failed to find users: ${result.error.message}`,
        result.error.code,
        this.tableName
      );
    }

    const users = Array.isArray(result.data) ? result.data : [];
    return users.map((user: any) => this.mapToUserModel(user));
  }

  /**
   * Map database row to UserModel
   */
  private mapToUserModel(data: any): UserModel {
    if (!data) {
      throw new Error('Cannot map null or undefined data to UserModel');
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      age: data.age,
      avatar_url: data.avatar_url,
      bio: data.bio,
      city: data.city,
      country: data.country,
      country_code: data.country_code,
      verified: data.verified ?? false,
      premium: data.premium ?? false,
      online_status: data.online_status ?? 'offline',
      last_active: data.last_active,
      onboarding_completed: data.onboarding_completed ?? false,
      profile_completion: data.profile_completion ?? 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  /**
   * Map UserModel to database row
   */
  private mapFromUserModel(user: UserModel): any {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      avatar_url: user.avatar_url,
      bio: user.bio,
      city: user.city,
      country: user.country,
      country_code: user.country_code,
      verified: user.verified,
      premium: user.premium,
      online_status: user.online_status,
      last_active: user.last_active,
      onboarding_completed: user.onboarding_completed,
      profile_completion: user.profile_completion,
    };
  }
}
