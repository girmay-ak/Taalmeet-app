/**
 * Storage service
 * 
 * Abstracts local storage operations using AsyncStorage.
 * This service provides a clean interface for storing and retrieving
 * data locally on the device.
 * 
 * @module infrastructure/storage/StorageService
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage service interface
 * 
 * Defines methods for local storage operations.
 */
export interface IStorageService {
  /**
   * Stores a value with the given key
   * 
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   * @throws {Error} If storage operation fails
   */
  setItem<T>(key: string, value: T): Promise<void>;

  /**
   * Retrieves a value by key
   * 
   * @param key - Storage key
   * @returns Stored value or null if not found
   * @throws {Error} If storage operation fails
   */
  getItem<T>(key: string): Promise<T | null>;

  /**
   * Removes a value by key
   * 
   * @param key - Storage key
   * @throws {Error} If storage operation fails
   */
  removeItem(key: string): Promise<void>;

  /**
   * Clears all stored data
   * 
   * @throws {Error} If storage operation fails
   */
  clear(): Promise<void>;
}

/**
 * Storage service implementation using AsyncStorage
 * 
 * Provides persistent local storage for the application.
 * All values are automatically JSON stringified/parsed.
 * 
 * @example
 * const storage = new StorageService();
 * await storage.setItem('user', { id: '123', name: 'John' });
 * const user = await storage.getItem('user');
 */
export class StorageService implements IStorageService {
  /**
   * @inheritdoc
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      throw new Error(`Failed to set storage item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * @inheritdoc
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      throw new Error(`Failed to get storage item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * @inheritdoc
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw new Error(`Failed to remove storage item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * @inheritdoc
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw new Error(`Failed to clear storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

