# Infrastructure Layer

The **infrastructure layer** contains implementations of external services and framework-specific code. This includes database clients, storage, notifications, and HTTP clients.

## Purpose

The infrastructure layer provides:

- External service integrations (Supabase, push notifications, etc.)
- Framework-specific implementations
- Shared service instances (singletons)
- Configuration for external services

## Structure

```
infrastructure/
├── database/       # Database clients (Supabase)
├── storage/        # Local storage (AsyncStorage)
├── notifications/  # Push notifications
└── http/           # HTTP client configuration
```

## Principles

- **External Dependencies**: Contains code that depends on external services
- **Singleton Pattern**: Shared instances (database clients, etc.)
- **Configuration**: Handles service configuration
- **Abstraction**: Provides clean interfaces for other layers

## Database

Database infrastructure includes:

- `supabaseClient`: Supabase client singleton
- `SupabaseUserDataSource`: Supabase-specific data source implementation

Database:

- Manages database connections
- Provides client instances
- Handles connection configuration

## Storage

Local storage infrastructure:

- `StorageService`: AsyncStorage wrapper
- Provides typed storage operations
- Handles JSON serialization/deserialization

## Notifications

Push notification infrastructure (to be implemented):

- FCM/APNS integration
- Notification handling
- Token management

## HTTP

HTTP client configuration (to be implemented):

- API client setup
- Request/response interceptors
- Error handling

## Usage Example

```typescript
// Infrastructure provides services
const supabaseClient = getSupabaseClient();
const storageService = new StorageService();

// Used by data layer
const dataSource = new SupabaseUserDataSource();
```

## Configuration

Infrastructure services are configured using:

- Environment variables
- App configuration
- Service-specific settings

## Testing

Infrastructure can be tested with:

- Mock services
- Test configurations
- Integration tests with test databases
