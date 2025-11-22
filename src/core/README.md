# Core Layer

The **core layer** contains the business logic and domain entities. This layer is completely framework-independent and can be used with any UI framework or data source.

## Purpose

The core layer implements the business rules and domain logic of the application. It has no dependencies on external frameworks, databases, or UI libraries, making it highly testable and portable.

## Structure

```
core/
├── entities/       # Domain entities (User, Match, etc.)
├── usecases/       # Business use cases (CreateUser, FindMatches, etc.)
└── interfaces/     # Abstract interfaces/contracts
```

## Principles

- **Framework Independent**: No React, React Native, or database dependencies
- **Business Logic Only**: Contains pure business rules and domain logic
- **Dependency Inversion**: Depends on abstractions (interfaces), not implementations
- **Testable**: Easy to unit test without mocking complex dependencies

## Entities

Domain entities represent the core business objects:

- `User`: Represents a language exchange participant
- `Match`: Represents a language exchange match between two users

Entities contain:
- Business rules and validation
- Domain-specific methods
- No framework dependencies

## Use Cases

Use cases orchestrate business operations:

- `CreateUserUseCase`: Handles user registration
- `FindMatchesUseCase`: Finds compatible language exchange partners

Use cases:
- Coordinate between entities and repositories
- Implement business workflows
- Handle business-level error cases

## Interfaces

Interfaces define contracts that the core layer depends on:

- `IUserRepository`: Contract for user data operations
- `IMatchRepository`: Contract for match data operations

These interfaces allow the core layer to remain independent of data source implementations.

## Usage Example

```typescript
// Core layer doesn't know about Supabase, React, etc.
const createUserUseCase = new CreateUserUseCase(userRepository);
const result = await createUserUseCase.execute({
  email: 'user@example.com',
  displayName: 'John Doe',
  nativeLanguages: ['en'],
  learningLanguages: [{ code: 'es', proficiency: 'beginner' }],
});
```

## Testing

Core layer code is easily testable with simple mocks:

```typescript
const mockUserRepository: IUserRepository = {
  findById: jest.fn(),
  create: jest.fn(),
  // ... other methods
};

const useCase = new CreateUserUseCase(mockUserRepository);
// Test business logic without database or network calls
```

