# Database Integration Guide

This guide explains how the Supabase adapter is integrated into the TaalMeet app and how to use it.

## Overview

The app now uses a **clean architecture database adapter** that provides:

- ✅ Type-safe database operations
- ✅ Automatic retry on failures
- ✅ Comprehensive error handling
- ✅ Request/response logging
- ✅ Authentication support
- ✅ File storage support
- ✅ Real-time subscriptions

## Architecture

```
┌─────────────────────────────────────┐
│   Presentation Layer (Screens)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Core Layer (Repositories)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Data Layer (Data Sources)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure (Database Adapter) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Supabase Backend                  │
└─────────────────────────────────────┘
```

## Usage

### 1. Get Database Instance

```typescript
import { getDatabase } from '@/infrastructure/database';

// Get singleton database instance
const db = getDatabase();
```

### 2. Query Data

```typescript
// Simple query
const { data, error } = await db.query('users')
  .select('id, name, email')
  .eq('id', userId)
  .single()
  .execute();

if (error) {
  console.error('Error:', error.message);
  return;
}

console.log('User:', data);
```

### 3. Authentication

```typescript
// Sign up
const result = await db.auth.signUp(
  'user@example.com',
  'password123',
  { name: 'John Doe' }
);

// Sign in
const result = await db.auth.signIn(
  'user@example.com',
  'password123'
);

// OAuth
const result = await db.auth.signInWithOAuth('google');

// Get current user
const user = await db.auth.getUser();

// Sign out
await db.auth.signOut();
```

### 4. File Storage

```typescript
// Upload file (with auto-compression for images)
const url = await db.storage.upload(
  'avatars',
  'user-123/avatar.jpg',
  imageUri
);

// Get public URL
const publicUrl = db.storage.getPublicUrl('avatars', 'user-123/avatar.jpg');

// Get signed URL (for private files)
const signedUrl = await db.storage.createSignedUrl(
  'private-bucket',
  'file.jpg',
  3600 // expires in 1 hour
);

// Download file
const blob = await db.storage.download('avatars', 'user-123/avatar.jpg');

// Delete file
await db.storage.delete('avatars', 'user-123/avatar.jpg');
```

### 5. Real-time Subscriptions

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

### 6. RPC Functions

```typescript
// Call database function
const { data, error } = await db.rpc('nearby_users', {
  user_lat: 52.37,
  user_lng: 4.89,
  radius_km: 10,
  current_user_id: userId,
  limit_count: 20,
});
```

## Data Sources

Data sources (like `SupabaseUserDataSource`) now use the new adapter:

```typescript
import { getDatabase } from '@/infrastructure/database';

const db = getDatabase();
const result = await db.query('users')
  .select()
  .eq('id', userId)
  .execute();
```

## Migration from Old Code

### Before (Old Way)

```typescript
import { getSupabaseClient } from '@/infrastructure/database';

const client = getSupabaseClient();
const { data, error } = await client
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

### After (New Way)

```typescript
import { getDatabase } from '@/infrastructure/database';

const db = getDatabase();
const { data, error } = await db
  .query('users')
  .select('*')
  .eq('id', userId)
  .single()
  .execute();
```

## Benefits

1. **Type Safety**: Full TypeScript support with generated types
2. **Error Handling**: Structured error handling with `DatabaseError`
3. **Retry Logic**: Automatic retry on transient failures
4. **Logging**: Automatic logging in development mode
5. **Clean Architecture**: Easy to swap database providers
6. **Testing**: Easy to mock for unit tests

## Testing

The database adapter can be easily mocked:

```typescript
import { IDatabase } from '@/core/interfaces/IDatabase';

const mockDatabase: IDatabase = {
  query: jest.fn(),
  auth: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    // ... other methods
  },
  storage: {
    upload: jest.fn(),
    // ... other methods
  },
  // ... other methods
};
```

## Configuration

Database configuration is loaded from environment variables:

```typescript
// .env.development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key (optional)
```

## Next Steps

1. ✅ Database adapter created
2. ✅ Auth provider implemented
3. ✅ Storage provider implemented
4. ✅ Data sources updated
5. ⏳ Update repositories to use new adapter
6. ⏳ Update services to use new adapter
7. ⏳ Add integration tests

## See Also

- [Database README](../src/infrastructure/database/README.md)
- [Generate Types Guide](./GENERATE_TYPES.md)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)

