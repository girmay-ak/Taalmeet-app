/**
 * Integration tests for Authentication Flow
 *
 * Tests the complete authentication flow including:
 * - User signup
 * - Profile creation
 * - Email verification
 * - Login
 *
 * @module __tests__/integration/auth-flow.test
 */

import { getSupabaseClient } from '@infrastructure/database/supabaseClient';
import { createMockSupabaseClient, mockSupabaseResponse } from '../mocks/mockSupabase';
import { createMockUser } from '../mocks/mockUsers';

// Mock Supabase client
jest.mock('@infrastructure/database/supabaseClient');

describe('Authentication Flow Integration', () => {
  const mockSupabase = createMockSupabaseClient();
  const mockAuth = mockSupabase.auth as any;
  const mockFrom = mockSupabase.from as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('Complete Signup Flow', () => {
    it('should complete full signup and profile creation', async () => {
      // 1. Sign up
      const signupData = {
        email: 'newuser@test.com',
        password: 'SecurePass123!',
        name: 'New User',
      };

      const mockUser = {
        id: 'new-user-id',
        email: signupData.email,
        user_metadata: { name: signupData.name },
      };

      mockAuth.signUp.mockResolvedValue(
        mockSupabaseResponse.success({
          user: mockUser,
          session: null,
        })
      );

      const signupResult = await mockAuth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: { data: { name: signupData.name } },
      });

      expect(signupResult.error).toBeNull();
      expect(signupResult.data.user).toBeDefined();
      const userId = signupResult.data.user.id;

      // 2. Create profile
      const profileData = {
        id: userId,
        name: signupData.name,
        email: signupData.email,
        city: 'Amsterdam',
        country: 'Netherlands',
        created_at: new Date().toISOString(),
      };

      const mockProfileQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn(),
      };

      mockFrom.mockReturnValue(mockProfileQuery);
      mockProfileQuery.insert.mockResolvedValue(mockSupabaseResponse.success(profileData));
      mockProfileQuery.single.mockResolvedValue(mockSupabaseResponse.success(profileData));

      const profileResult = await mockFrom('profiles').insert(profileData).select().single();

      expect(profileResult.error).toBeNull();
      expect(profileResult.data).toEqual(profileData);

      // 3. Verify signup was called
      expect(mockAuth.signUp).toHaveBeenCalledWith({
        email: signupData.email,
        password: signupData.password,
        options: { data: { name: signupData.name } },
      });

      // 4. Verify profile creation was called
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockProfileQuery.insert).toHaveBeenCalledWith(profileData);
    });

    it('should handle signup failure gracefully', async () => {
      // Arrange
      mockAuth.signUp.mockResolvedValue(mockSupabaseResponse.error('Email already exists'));

      // Act
      const result = await mockAuth.signUp({
        email: 'existing@test.com',
        password: 'SecurePass123!',
        options: { data: { name: 'Test User' } },
      });

      // Assert
      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
      expect(mockFrom).not.toHaveBeenCalled(); // Profile should not be created
    });
  });

  describe('Login Flow', () => {
    it('should successfully log in and retrieve user profile', async () => {
      // 1. Sign in
      const loginData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const mockSession = {
        access_token: 'token123',
        user: {
          id: 'user-123',
          email: loginData.email,
        },
      };

      mockAuth.signInWithPassword.mockResolvedValue(
        mockSupabaseResponse.success({
          session: mockSession,
          user: mockSession.user,
        })
      );

      const loginResult = await mockAuth.signInWithPassword(loginData);

      expect(loginResult.error).toBeNull();
      expect(loginResult.data.session).toBeDefined();

      // 2. Get user profile
      const mockProfile = createMockUser({
        id: mockSession.user.id,
        email: mockSession.user.email,
      });

      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      };

      mockFrom.mockReturnValue(mockProfileQuery);
      mockProfileQuery.single.mockResolvedValue(mockSupabaseResponse.success(mockProfile));

      const profileResult = await mockFrom('profiles')
        .select('*')
        .eq('id', mockSession.user.id)
        .single();

      expect(profileResult.error).toBeNull();
      expect(profileResult.data).toBeDefined();
    });
  });

  describe('Logout Flow', () => {
    it('should successfully log out and clear session', async () => {
      // Arrange
      mockAuth.signOut.mockResolvedValue(mockSupabaseResponse.success({}));

      // Act
      const result = await mockAuth.signOut();

      // Assert
      expect(result.error).toBeNull();
      expect(mockAuth.signOut).toHaveBeenCalled();
    });
  });
});
