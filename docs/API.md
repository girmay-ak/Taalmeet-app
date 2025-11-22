# API Documentation

## Overview

This document describes the API structure and usage patterns in TaalMeet.

## Use Cases

### CreateUserUseCase

Creates a new user account.

**Location**: `src/core/usecases/CreateUserUseCase.ts`

**Input**:
```typescript
interface CreateUserInput {
  email: string;
  displayName: string;
  nativeLanguages: string[];
  learningLanguages: Array<{
    code: string;
    proficiency: string;
  }>;
  bio?: string;
  avatarUrl?: string;
}
```

**Output**:
```typescript
interface CreateUserResult {
  user: User;
  success: boolean;
  message?: string;
}
```

**Usage**:
```typescript
const useCase = new CreateUserUseCase(userRepository);
const result = await useCase.execute({
  email: 'user@example.com',
  displayName: 'John Doe',
  nativeLanguages: ['en'],
  learningLanguages: [{ code: 'es', proficiency: 'beginner' }],
});
```

### FindMatchesUseCase

Finds potential language exchange matches for a user.

**Location**: `src/core/usecases/FindMatchesUseCase.ts`

**Input**:
```typescript
interface FindMatchesInput {
  userId: string;
  limit?: number;
  excludeExistingMatches?: boolean;
}
```

**Output**:
```typescript
interface FindMatchesResult {
  matches: Array<{
    user: User;
    match: Match;
    compatibilityScore: number;
  }>;
  totalFound: number;
}
```

**Usage**:
```typescript
const useCase = new FindMatchesUseCase(userRepository, matchRepository);
const result = await useCase.execute({
  userId: 'user-123',
  limit: 10,
  excludeExistingMatches: true,
});
```

## Repositories

### IUserRepository

Interface for user data operations.

**Location**: `src/core/interfaces/repositories/IUserRepository.ts`

**Methods**:
- `findById(id: string): Promise<User | null>`
- `findByEmail(email: string): Promise<User | null>`
- `create(user: User): Promise<User>`
- `update(user: User): Promise<User>`
- `delete(id: string): Promise<boolean>`
- `findByCriteria(criteria): Promise<User[]>`

### IMatchRepository

Interface for match data operations.

**Location**: `src/core/interfaces/repositories/IMatchRepository.ts`

**Methods**:
- `create(match: Match): Promise<Match>`
- `findById(id: string): Promise<Match | null>`
- `findByUserId(userId: string, status?: MatchStatus): Promise<Match[]>`
- `findByUsers(user1Id: string, user2Id: string): Promise<Match | null>`
- `update(match: Match): Promise<Match>`
- `delete(id: string): Promise<boolean>`

## Entities

### User

Domain entity representing a language exchange participant.

**Location**: `src/core/entities/User.ts`

**Properties**:
- `id: string`
- `email: string`
- `displayName: string`
- `nativeLanguages: string[]`
- `learningLanguages: Array<{ code: string; proficiency: LanguageProficiency }>`
- `bio?: string`
- `avatarUrl?: string`
- `createdAt?: Date`
- `updatedAt?: Date`

**Methods**:
- `canTeach(languageCode: string): boolean`
- `isLearning(languageCode: string): boolean`
- `getProficiency(languageCode: string): LanguageProficiency | undefined`

### Match

Domain entity representing a language exchange match.

**Location**: `src/core/entities/Match.ts`

**Properties**:
- `id: string`
- `user1Id: string`
- `user2Id: string`
- `user1Teaches: string`
- `user2Teaches: string`
- `status: MatchStatus`
- `createdAt: Date`
- `updatedAt: Date`

**Methods**:
- `accept(): void`
- `reject(): void`
- `isActive(): boolean`
- `static isValidMatch(user1: User, user2: User): boolean`

## Hooks

### useUser

Custom React hook for user operations.

**Location**: `src/presentation/hooks/useUser.ts`

**Returns**:
```typescript
{
  user: User | null;
  loading: boolean;
  error: string | null;
  createUser: (input) => Promise<void>;
  clearError: () => void;
}
```

**Usage**:
```typescript
const { user, loading, createUser } = useUser(createUserUseCase);
```

## Services

### StorageService

Local storage service using AsyncStorage.

**Location**: `src/infrastructure/storage/StorageService.ts`

**Methods**:
- `setItem<T>(key: string, value: T): Promise<void>`
- `getItem<T>(key: string): Promise<T | null>`
- `removeItem(key: string): Promise<void>`
- `clear(): Promise<void>`

**Usage**:
```typescript
const storage = new StorageService();
await storage.setItem('user', userData);
const user = await storage.getItem('user');
```

## Configuration

### getConfig()

Gets application configuration.

**Location**: `src/config/env.ts`

**Returns**: `AppConfig`

**Usage**:
```typescript
const config = getConfig();
const supabaseUrl = config.supabaseUrl;
```

