/**
 * User repository implementation
 *
 * Concrete implementation of IUserRepository using Supabase.
 * This class handles the mapping between domain entities and data models,
 * and performs actual database operations.
 *
 * @module data/repositories/UserRepository
 */

import { User } from '@core/entities/User';
import { LanguageProficiency } from '@core/entities/User';
import { IUserRepository } from '@core/interfaces/repositories/IUserRepository';
import { UserModel } from '../models/UserModel';
import { IUserDataSource } from '../datasources/IUserDataSource';

/**
 * User repository implementation
 *
 * Implements the Repository pattern to abstract data access.
 * This implementation uses Supabase, but the interface allows
 * switching to any other data source without changing business logic.
 *
 * @example
 * const dataSource = new SupabaseUserDataSource(supabaseClient);
 * const repository = new UserRepository(dataSource);
 * const user = await repository.findById('user-123');
 */
export class UserRepository implements IUserRepository {
  /**
   * Creates a new instance of UserRepository
   *
   * @param dataSource - Data source for user operations
   */
  constructor(private readonly dataSource: IUserDataSource) {}

  /**
   * @inheritdoc
   */
  async findById(id: string): Promise<User | null> {
    const userModel = await this.dataSource.getById(id);
    return userModel ? this.toEntity(userModel) : null;
  }

  /**
   * @inheritdoc
   */
  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.dataSource.getByEmail(email);
    return userModel ? this.toEntity(userModel) : null;
  }

  /**
   * @inheritdoc
   */
  async create(user: User): Promise<User> {
    const userModel = this.toModel(user);
    const createdModel = await this.dataSource.create(userModel);
    return this.toEntity(createdModel);
  }

  /**
   * @inheritdoc
   */
  async update(user: User): Promise<User> {
    const userModel = this.toModel(user);
    const updatedModel = await this.dataSource.update(userModel);
    return this.toEntity(updatedModel);
  }

  /**
   * @inheritdoc
   */
  async delete(id: string): Promise<boolean> {
    return await this.dataSource.delete(id);
  }

  /**
   * @inheritdoc
   */
  async findByCriteria(criteria: {
    nativeLanguages?: string[];
    learningLanguages?: string[];
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    const userModels = await this.dataSource.findByCriteria(criteria);
    return userModels.map(model => this.toEntity(model));
  }

  /**
   * Converts data model to domain entity
   *
   * This mapping function transforms the database representation
   * into the domain entity, maintaining separation of concerns.
   *
   * @param model - User data model
   * @returns User domain entity
   * @private
   */
  private toEntity(model: UserModel): User {
    return new User(
      model.id,
      model.email,
      model.display_name,
      model.native_languages,
      model.learning_languages.map(lang => ({
        code: lang.code,
        proficiency: lang.proficiency as LanguageProficiency,
      })),
      model.bio || undefined,
      model.avatar_url || undefined,
      new Date(model.created_at),
      new Date(model.updated_at)
    );
  }

  /**
   * Converts domain entity to data model
   *
   * This mapping function transforms the domain entity
   * into the database representation.
   *
   * @param entity - User domain entity
   * @returns User data model
   * @private
   */
  private toModel(entity: User): UserModel {
    return {
      id: entity.id,
      email: entity.email,
      display_name: entity.displayName,
      native_languages: entity.nativeLanguages,
      learning_languages: entity.learningLanguages.map(lang => ({
        code: lang.code,
        proficiency: lang.proficiency,
      })),
      bio: entity.bio || null,
      avatar_url: entity.avatarUrl || null,
      created_at: entity.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: entity.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}
