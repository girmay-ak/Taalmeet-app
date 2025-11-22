# Data Layer

The **data layer** implements data access operations. It translates between domain entities (from the core layer) and data models (database/API representations).

## Purpose

The data layer is responsible for:

- Implementing repository interfaces defined in the core layer
- Mapping between domain entities and data models
- Handling data source-specific operations (Supabase, REST APIs, etc.)
- Caching and data synchronization

## Structure

```
data/
├── repositories/   # Repository implementations (UserRepository, etc.)
├── datasources/    # Data source interfaces and implementations
└── models/         # Data models/DTOs (UserModel, etc.)
```

## Principles

- **Implements Core Interfaces**: Provides concrete implementations of core layer interfaces
- **Data Transformation**: Maps between domain entities and data models
- **Data Source Abstraction**: Can switch between Supabase, Firebase, REST APIs, etc.
- **Error Handling**: Translates data source errors to domain errors

## Repositories

Repositories implement the interfaces defined in the core layer:

- `UserRepository`: Implements `IUserRepository`
- `MatchRepository`: Implements `IMatchRepository` (to be implemented)

Repositories:

- Use data sources to perform operations
- Map between entities and models
- Handle data layer errors

## Data Sources

Data sources handle low-level data operations:

- `IUserDataSource`: Interface for user data operations
- `SupabaseUserDataSource`: Supabase implementation

Data sources:

- Perform actual database/API calls
- Work with data models (not domain entities)
- Handle data source-specific logic

## Models

Data models (DTOs) represent data as stored in the database/API:

- `UserModel`: Database representation of a user
- `MatchModel`: Database representation of a match (to be implemented)

Models:

- Match database schema
- May differ from domain entities
- Used for data transfer only

## Usage Example

```typescript
// Data layer knows about Supabase
const dataSource = new SupabaseUserDataSource();
const repository = new UserRepository(dataSource);

// Repository implements core interface
const user = await repository.findById('user-123');
// Returns domain entity, not data model
```

## Mapping

The data layer handles mapping between:

- **Domain Entities** (core layer): Business objects with business logic
- **Data Models** (data layer): Database/API representations

```typescript
// Entity to Model (for saving)
const model = toModel(userEntity);

// Model to Entity (for loading)
const entity = toEntity(userModel);
```

## Testing

Data layer can be tested with:

- Mock data sources
- In-memory implementations
- Test databases
