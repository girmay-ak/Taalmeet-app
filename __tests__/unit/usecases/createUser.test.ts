/**
 * Unit tests for CreateUser UseCase
 *
 * Tests the CreateUser use case in isolation with mocked dependencies.
 *
 * @module __tests__/unit/usecases/createUser.test
 */

import { CreateUserUseCase, CreateUserInput } from '@core/usecases/CreateUserUseCase';
import { IUserRepository } from '@core/interfaces/repositories/IUserRepository';
import { User } from '@core/entities/User';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    // Create mock repository
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    // Create use case instance
    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully create a new user', async () => {
      // Arrange
      const userInput: CreateUserInput = {
        email: 'newuser@example.com',
        displayName: 'New User',
        nativeLanguages: ['en'],
        learningLanguages: [{ code: 'es', proficiency: 'beginner' }],
        bio: 'Test bio',
      };

      const mockCreatedUser = new User(
        'new-user-id',
        userInput.email,
        userInput.displayName,
        userInput.nativeLanguages,
        userInput.learningLanguages.map(l => ({
          code: l.code,
          proficiency: l.proficiency as any,
        })),
        userInput.bio,
        undefined,
        new Date(),
        new Date()
      );

      mockUserRepository.create.mockResolvedValue(mockCreatedUser);
      mockUserRepository.findByEmail.mockResolvedValue(null); // User doesn't exist

      // Act
      const result = await createUserUseCase.execute(userInput);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userInput.email);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userInput.email);
      expect(result.message).toBe('User created successfully');
    });

    it('should return error if user already exists', async () => {
      // Arrange
      const userInput: CreateUserInput = {
        email: 'existing@example.com',
        displayName: 'Existing User',
        nativeLanguages: ['en'],
        learningLanguages: [{ code: 'es', proficiency: 'beginner' }],
      };

      const existingUser = new User(
        'existing-id',
        userInput.email,
        userInput.displayName,
        userInput.nativeLanguages,
        [],
        undefined,
        undefined,
        new Date(),
        new Date()
      );

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act
      const result = await createUserUseCase.execute(userInput);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('User with this email already exists');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      // Arrange
      const userInput: CreateUserInput = {
        email: 'test@example.com',
        displayName: 'Test User',
        nativeLanguages: ['en'],
        learningLanguages: [{ code: 'es', proficiency: 'beginner' }],
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(createUserUseCase.execute(userInput)).rejects.toThrow(
        'Failed to create user: Database error'
      );
    });

    it('should create user with optional fields', async () => {
      // Arrange
      const userInput: CreateUserInput = {
        email: 'test@example.com',
        displayName: 'Test User',
        nativeLanguages: ['en'],
        learningLanguages: [{ code: 'es', proficiency: 'intermediate' }],
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
      };

      const mockCreatedUser = new User(
        'user-id',
        userInput.email,
        userInput.displayName,
        userInput.nativeLanguages,
        userInput.learningLanguages.map(l => ({
          code: l.code,
          proficiency: l.proficiency as any,
        })),
        userInput.bio,
        userInput.avatarUrl,
        new Date(),
        new Date()
      );

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await createUserUseCase.execute(userInput);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user.bio).toBe(userInput.bio);
      expect(result.user.avatarUrl).toBe(userInput.avatarUrl);
    });
  });
});
