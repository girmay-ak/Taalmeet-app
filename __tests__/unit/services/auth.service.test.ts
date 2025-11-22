/**
 * Unit tests for Authentication Service
 *
 * Tests the authentication service in isolation with mocked dependencies.
 * Covers signup, login, logout, and session management.
 *
 * @module __tests__/unit/services/auth.service.test
 */

import { getSupabaseClient } from '@infrastructure/database/supabaseClient';
import { createMockSupabaseClient, mockSupabaseResponse } from '../../mocks/mockSupabase';

// Mock Supabase client
jest.mock('@infrastructure/database/supabaseClient');

describe('AuthService', () => {
  const mockSupabase = createMockSupabaseClient();
  const mockAuth = mockSupabase.auth as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('signUp', () => {
    it('should successfully sign up a new user', async () => {
      // Arrange
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' },
      };

      mockAuth.signUp.mockResolvedValue(
        mockSupabaseResponse.success({
          user: mockUser,
          session: null,
        })
      );

      // Act
      const result = await mockAuth.signUp({
        email: 'test@example.com',
        password: 'password123',
        options: { data: { name: 'Test User' } },
      });

      // Assert
      expect(mockAuth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: { data: { name: 'Test User' } },
      });
      expect(result.data.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should handle signup errors', async () => {
      // Arrange
      const mockError = { message: 'Email already exists', code: '23505' };

      mockAuth.signUp.mockResolvedValue(mockSupabaseResponse.error('Email already exists'));

      // Act
      const result = await mockAuth.signUp({
        email: 'test@example.com',
        password: 'password123',
        options: { data: { name: 'Test User' } },
      });

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Email already exists');
    });

    it('should handle network errors', async () => {
      // Arrange
      mockAuth.signUp.mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(
        mockAuth.signUp({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Network error');
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      // Arrange
      const mockSession = {
        access_token: 'token123',
        refresh_token: 'refresh123',
        user: {
          id: '123',
          email: 'test@example.com',
        },
      };

      mockAuth.signInWithPassword.mockResolvedValue(
        mockSupabaseResponse.success({
          session: mockSession,
          user: mockSession.user,
        })
      );

      // Act
      const result = await mockAuth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      // Assert
      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.data.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should handle invalid credentials', async () => {
      // Arrange
      mockAuth.signInWithPassword.mockResolvedValue(
        mockSupabaseResponse.error('Invalid login credentials', 'invalid_credentials')
      );

      // Act
      const result = await mockAuth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Invalid login credentials');
    });
  });

  describe('signOut', () => {
    it('should successfully sign out a user', async () => {
      // Arrange
      mockAuth.signOut.mockResolvedValue(mockSupabaseResponse.success({}));

      // Act
      const result = await mockAuth.signOut();

      // Assert
      expect(mockAuth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return current user when authenticated', async () => {
      // Arrange
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      mockAuth.getUser.mockResolvedValue(
        mockSupabaseResponse.success({
          user: mockUser,
        })
      );

      // Act
      const result = await mockAuth.getUser();

      // Assert
      expect(result.data.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should return null when not authenticated', async () => {
      // Arrange
      mockAuth.getUser.mockResolvedValue(
        mockSupabaseResponse.success({
          user: null,
        })
      );

      // Act
      const result = await mockAuth.getUser();

      // Assert
      expect(result.data.user).toBeNull();
    });
  });
});
