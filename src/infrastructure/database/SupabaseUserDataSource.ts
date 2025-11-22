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
import { getSupabaseClient } from './supabaseClient';

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
    const client = getSupabaseClient();
    const { data, error } = await client.from(this.tableName).select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to get user by ID: ${error.message}`);
    }

    return this.mapToUserModel(data);
  }

  /**
   * @inheritdoc
   */
  async getByEmail(email: string): Promise<UserModel | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to get user by email: ${error.message}`);
    }

    return this.mapToUserModel(data);
  }

  /**
   * @inheritdoc
   */
  async create(user: UserModel): Promise<UserModel> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(this.tableName)
      .insert(this.mapToDatabaseFormat(user))
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return this.mapToUserModel(data);
  }

  /**
   * @inheritdoc
   */
  async update(user: UserModel): Promise<UserModel> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(this.tableName)
      .update(this.mapToDatabaseFormat(user))
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return this.mapToUserModel(data);
  }

  /**
   * @inheritdoc
   */
  async delete(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    const { error } = await client.from(this.tableName).delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
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
    const client = getSupabaseClient();
    let query = client.from(this.tableName).select('*');

    // Filter by native languages
    if (criteria.nativeLanguages && criteria.nativeLanguages.length > 0) {
      query = query.contains('native_languages', criteria.nativeLanguages);
    }

    // Filter by learning languages
    if (criteria.learningLanguages && criteria.learningLanguages.length > 0) {
      query = query.contains('learning_languages', criteria.learningLanguages);
    }

    // Apply pagination
    if (criteria.limit) {
      query = query.limit(criteria.limit);
    }
    if (criteria.offset) {
      query = query.range(criteria.offset, criteria.offset + (criteria.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to find users by criteria: ${error.message}`);
    }

    return (data || []).map(item => this.mapToUserModel(item));
  }

  /**
   * Maps database row to UserModel
   *
   * @param row - Database row from Supabase
   * @returns UserModel instance
   * @private
   */
  private mapToUserModel(row: any): UserModel {
    return {
      id: row.id,
      email: row.email,
      display_name: row.display_name,
      native_languages: row.native_languages || [],
      learning_languages: row.learning_languages || [],
      bio: row.bio,
      avatar_url: row.avatar_url,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  /**
   * Maps UserModel to database format
   *
   * @param user - UserModel instance
   * @returns Database row format
   * @private
   */
  private mapToDatabaseFormat(user: UserModel): any {
    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      native_languages: user.native_languages,
      learning_languages: user.learning_languages,
      bio: user.bio,
      avatar_url: user.avatar_url,
      updated_at: new Date().toISOString(),
    };
  }
}
