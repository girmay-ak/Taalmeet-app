# Database Infrastructure

This directory contains the database adapter implementation following clean architecture principles.

## Overview

The database infrastructure provides a **database-agnostic** interface that can be swapped between different providers (Supabase, Firebase, PostgreSQL, etc.) without changing business logic.

## Architecture

```
infrastructure/database/
├── config/
│   └── database.config.ts      # Database configuration
├── supabase/
│   ├── SupabaseAdapter.ts      # Main adapter (implements IDatabase)
│   ├── SupabaseQueryBuilder.ts # Query builder (implements IQueryBuilder)
│   ├── SupabaseAuthProvider.ts # Auth provider (implements IAuthProvider)
│   └── SupabaseStorageProvider.ts # Storage provider (implements IStorageProvider)
└── index.ts                    # Public exports
```

## Usage

### Initialize Database Adapter

```typescript
import { SupabaseAdapter, getDatabaseConfig } from '@/infrastructure/database';

// Get configuration
const config = getDatabaseConfig();

// Create adapter instance
const db = new SupabaseAdapter(config);
```

### Query Data

```typescript
// Simple query
const { data, error } = await db.query('users')
  .select('id, name, email')
  .eq('id', userId)
  .single()
  .execute();

if (error) {
  console.error('Query failed:', error.message);
  return;
}

console.log('User:', data);
```

### Insert Data

```typescript
const { data, error } = await db.query('users')
  .insert({
    email: 'user@example.com',
    name: 'John Doe',
    age: 25,
  })
  .execute();

if (error) {
  console.error('Insert failed:', error.message);
  return;
}

console.log('Created user:', data);
```

### Update Data

```typescript
const { data, error } = await db.query('users')
  .update({ name: 'Jane Doe' })
  .eq('id', userId)
  .execute();
```

### Delete Data

```typescript
const { data, error } = await db.query('users')
  .delete()
  .eq('id', userId)
  .execute();
```

### Complex Queries

```typescript
// Multiple filters
const { data, error } = await db.query('users')
  .select('*')
  .eq('verified', true)
  .gt('age', 18)
  .in('status', ['active', 'online'])
  .order('created_at', false) // descending
  .limit(10)
  .execute();
```

### Query with Retry

```typescript
// Automatically retry on transient failures
const { data, error } = await db.query('users')
  .select()
  .eq('id', userId)
  .executeWithRetry(3, 1000); // 3 retries, 1 second delay
```

### Call RPC Functions

```typescript
// Call database function
const { data, error } = await db.rpc('nearby_users', {
  user_lat: 52.37,
  user_lng: 4.89,
  radius_km: 10,
  current_user_id: userId,
  limit_count: 20,
});

if (error) {
  console.error('RPC failed:', error.message);
  return;
}

console.log('Nearby users:', data);
```

### Authentication

```typescript
// Sign up
const { data, error } = await db.auth.signUp(
  'user@example.com',
  'password123',
  { name: 'John Doe' }
);

// Sign in
const { data, error } = await db.auth.signIn(
  'user@example.com',
  'password123'
);

// Get current user
const { data: user } = await db.auth.getUser();

// Sign out
await db.auth.signOut();

// Listen to auth changes
const subscription = db.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});

// Later, unsubscribe
subscription.unsubscribe();
```

### Storage

```typescript
// Upload file
const file = new Blob([/* file data */]);
const { data, error } = await db.storage.upload(
  'avatars',
  'user-123/avatar.jpg',
  file
);

// Get public URL
const url = db.storage.getPublicUrl('avatars', 'user-123/avatar.jpg');

// Download file
const { data: blob } = await db.storage.download(
  'avatars',
  'user-123/avatar.jpg'
);

// Delete file
await db.storage.remove('avatars', 'user-123/avatar.jpg');
```

### Real-time Subscriptions

```typescript
// Subscribe to table changes
const subscription = db.subscribe(
  'messages',
  'INSERT',
  'conversation_id=eq.123',
  (payload) => {
    console.log('New message:', payload.new);
  }
);

// Later, unsubscribe
subscription.unsubscribe();
```

## Error Handling

All database operations return a `DatabaseResult<T>` with `data` and `error`:

```typescript
const { data, error } = await db.query('users').select().execute();

if (error) {
  // Handle error
  if (error.code === 'PGRST116') {
    console.log('Not found');
  } else if (error.code === 'PGRST301') {
    console.log('Authentication error');
  } else {
    console.error('Database error:', error.message);
  }
  return;
}

// Use data
console.log('Users:', data);
```

## Type Safety

Use generated types from Supabase:

```typescript
import { Database } from '@/types/database.types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

// Type-safe queries
const { data } = await db.query<User>('users')
  .select()
  .eq('id', userId)
  .single()
  .execute();
```

## Logging

Logging is automatically enabled in development mode:

- Query execution times
- Error details
- RPC calls
- Auth state changes

Logs are automatically disabled in production unless `ENABLE_LOGGING=true` is set.

## Testing

The adapter can be easily mocked for testing:

```typescript
// Mock the adapter
const mockAdapter = {
  query: jest.fn(),
  auth: { signIn: jest.fn() },
  // ... other methods
} as unknown as IDatabase;
```

## Switching Database Providers

To switch from Supabase to another provider:

1. Create new adapter (e.g., `FirebaseAdapter`)
2. Implement `IDatabase` interface
3. Update dependency injection container
4. No changes needed in business logic!

## Best Practices

1. **Always check for errors** after database operations
2. **Use retry logic** for network operations
3. **Type your queries** with generated types
4. **Clean up subscriptions** when components unmount
5. **Handle auth errors** gracefully
6. **Log errors** for debugging (automatic in dev mode)

## See Also

- [IDatabase Interface](../../core/interfaces/IDatabase.ts)
- [Database Configuration](./config/database.config.ts)
- [Generate Types Guide](../../../docs/GENERATE_TYPES.md)

