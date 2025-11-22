/**
 * User React hook
 *
 * Custom React hook for managing user state and operations.
 * This hook connects the presentation layer to the business logic
 * through use cases.
 *
 * @module presentation/hooks/useUser
 */

import { useState, useEffect, useCallback } from 'react';
import { CreateUserUseCase } from '@core/usecases/CreateUserUseCase';
import { User } from '@core/entities/User';

/**
 * User hook return type
 */
interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  createUser: (input: Parameters<CreateUserUseCase['execute']>[0]) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for user operations
 *
 * Provides user state management and operations like creating a user.
 * This hook abstracts the use case layer from React components.
 *
 * @param createUserUseCase - Create user use case instance
 * @returns User state and operations
 * @example
 * const { user, loading, createUser } = useUser(createUserUseCase);
 *
 * await createUser({
 *   email: 'user@example.com',
 *   displayName: 'John Doe',
 *   nativeLanguages: ['en'],
 *   learningLanguages: [{ code: 'es', proficiency: 'beginner' }],
 * });
 */
export const useUser = (createUserUseCase: CreateUserUseCase): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Creates a new user
   *
   * @param input - User creation input
   */
  const createUser = useCallback(
    async (input: Parameters<CreateUserUseCase['execute']>[0]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await createUserUseCase.execute(input);
        if (result.success) {
          setUser(result.user);
        } else {
          setError(result.message || 'Failed to create user');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    },
    [createUserUseCase]
  );

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    createUser,
    clearError,
  };
};
