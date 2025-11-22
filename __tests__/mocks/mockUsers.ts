/**
 * Mock user utilities for testing
 *
 * Provides helper functions to create mock users with various configurations.
 *
 * @module __tests__/mocks/mockUsers
 */

import { User } from '@core/entities/User';

/**
 * Creates a mock user with default values
 *
 * @param overrides - Properties to override
 * @returns Mock user object
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  age: 25,
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  location: 'Amsterdam, Netherlands',
  verified: true,
  premium: false,
  teaching: {
    language: 'English',
    level: 'Native',
    flag: '🇬🇧',
  },
  learning: {
    language: 'Dutch',
    level: 'B1 - Intermediate',
    flag: '🇳🇱',
  },
  interests: ['Coffee', 'Travel', 'Music'],
  rating: 4.8,
  connectionCount: 10,
  exchangeCount: 5,
  memberSince: '2024',
  ...overrides,
});

/**
 * Creates a mock user with premium status
 */
export const createMockPremiumUser = (overrides: Partial<User> = {}): User =>
  createMockUser({ premium: true, ...overrides });

/**
 * Creates a mock user with verified status
 */
export const createMockVerifiedUser = (overrides: Partial<User> = {}): User =>
  createMockUser({ verified: true, ...overrides });

/**
 * Creates a mock user that is online
 */
export const createMockOnlineUser = (overrides: Partial<User> = {}): User =>
  createMockUser({ isOnline: true, ...overrides });

/**
 * Creates multiple mock users
 *
 * @param count - Number of users to create
 * @returns Array of mock users
 */
export const createMockUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: `user-${index + 1}`,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
    })
  );
};
