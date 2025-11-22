# Architecture Documentation

## Overview

TaalMeet follows **Clean Architecture** principles, ensuring separation of concerns, testability, and maintainability.

## Architecture Layers

### 1. Core Layer (Business Logic)

**Location**: `src/core/`

**Purpose**: Contains pure business logic, independent of frameworks and external dependencies.

**Contains**:
- Domain entities (User, Match)
- Business use cases (CreateUser, FindMatches)
- Repository interfaces (contracts)

**Dependencies**: None (framework-independent)

**Principles**:
- No React, React Native, or database dependencies
- Pure TypeScript/JavaScript
- Business rules and validation
- Highly testable

### 2. Data Layer (Data Access)

**Location**: `src/data/`

**Purpose**: Implements data access operations and maps between domain entities and data models.

**Contains**:
- Repository implementations
- Data source interfaces and implementations
- Data models (DTOs)

**Dependencies**: Core layer interfaces

**Responsibilities**:
- Implements repository interfaces from core layer
- Maps entities ↔ models
- Handles data source operations (Supabase, etc.)

### 3. Presentation Layer (UI)

**Location**: `src/presentation/`

**Purpose**: Contains all UI-related code (React Native components, screens, navigation).

**Contains**:
- Screen components
- Reusable UI components
- Navigation configuration
- Custom React hooks

**Dependencies**: Core layer (use cases)

**Responsibilities**:
- Renders user interface
- Handles user interactions
- Manages UI state
- Connects UI to business logic

### 4. Infrastructure Layer (External Services)

**Location**: `src/infrastructure/`

**Purpose**: Provides implementations of external services and framework-specific code.

**Contains**:
- Database clients (Supabase)
- Storage services (AsyncStorage)
- Push notifications
- HTTP clients

**Dependencies**: Config layer

**Responsibilities**:
- External service integrations
- Framework-specific implementations
- Shared service instances

### 5. Shared Layer (Utilities)

**Location**: `src/shared/`

**Purpose**: Provides utilities, constants, and types used across layers.

**Contains**:
- Constants
- TypeScript types
- Utility functions
- Validators

**Dependencies**: None (framework-agnostic)

### 6. Config Layer (Configuration)

**Location**: `src/config/`

**Purpose**: Manages application configuration and environment variables.

**Contains**:
- Environment variable loading
- Application configuration
- Feature flags

## Dependency Flow

```
Presentation → Core ← Data
     ↓           ↓      ↓
Infrastructure ← Config
     ↑
   Shared
```

**Key Points**:
- Core layer has no dependencies
- Data and Presentation depend on Core
- Infrastructure provides services to Data layer
- Shared is used by all layers
- Config is used by Infrastructure

## Design Patterns

### Repository Pattern

Abstracts data access operations:

```typescript
// Core layer defines interface
interface IUserRepository {
  findById(id: string): Promise<User | null>;
}

// Data layer implements it
class UserRepository implements IUserRepository {
  // Implementation
}
```

### Use Case Pattern

Encapsulates business operations:

```typescript
class CreateUserUseCase {
  constructor(private repository: IUserRepository) {}
  
  async execute(input: CreateUserInput): Promise<CreateUserResult> {
    // Business logic
  }
}
```

### Singleton Pattern

Shared service instances:

```typescript
const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createClient(...);
  }
  return supabaseClient;
};
```

## Data Flow

1. **User Interaction** → Presentation layer (component)
2. **Component** → Custom hook (useUser, etc.)
3. **Hook** → Use case (CreateUserUseCase)
4. **Use Case** → Repository interface (IUserRepository)
5. **Repository** → Data source (SupabaseUserDataSource)
6. **Data Source** → External service (Supabase)
7. **Response flows back** through the layers

## Benefits

1. **Testability**: Each layer can be tested independently
2. **Maintainability**: Clear separation of concerns
3. **Scalability**: Easy to add new features
4. **Flexibility**: Can switch frameworks/data sources
5. **Team Collaboration**: Different teams can work on different layers

## Testing Strategy

- **Unit Tests**: Test each layer independently with mocks
- **Integration Tests**: Test layer interactions
- **E2E Tests**: Test complete user flows

## Migration Path

The architecture allows for:
- Switching from Supabase to Firebase/PostgreSQL
- Porting to web (React) or other mobile frameworks
- Changing UI frameworks while keeping business logic

