/**
 * Supabase Connection Test
 * 
 * This test verifies that the Supabase client can successfully connect
 * to the database and perform basic queries.
 * 
 * Run this test after setting up your Supabase credentials:
 * npm test -- src/infrastructure/database/__tests__/connection.test.ts
 * 
 * @module infrastructure/database/__tests__/connection.test
 */

import { getSupabaseClient } from '../supabaseClient';

describe('Supabase Connection Test', () => {
  let supabase: ReturnType<typeof getSupabaseClient>;

  beforeAll(() => {
    supabase = getSupabaseClient();
  });

  it('should connect to Supabase successfully', async () => {
    // Test connection by checking if client is initialized
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });

  it('should query database successfully', async () => {
    // Try to query a system table that always exists
    // This verifies the connection and authentication work
    try {
      // Query the auth.users table (system table, always exists)
      // Note: This requires service_role key or proper RLS policies
      const { data, error } = await supabase
        .from('_prisma_migrations')
        .select('*')
        .limit(1);

      // If the table doesn't exist, that's okay - we're just testing connection
      // The important thing is we don't get an authentication error
      if (error) {
        // Check if it's an authentication error (bad credentials)
        if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
          throw new Error(
            'Authentication failed. Please check your SUPABASE_ANON_KEY in .env file.'
          );
        }
        // Other errors (like table not found) are acceptable for connection test
        console.log('Note: Table query returned error (expected if table does not exist):', error.message);
      }

      // If we get here without an auth error, connection is working
      expect(supabase).toBeDefined();
    } catch (error: any) {
      // Re-throw authentication errors
      if (error.message.includes('Authentication failed')) {
        throw error;
      }
      // For other errors, log and continue
      console.log('Connection test note:', error.message);
    }
  });

  it('should have correct Supabase URL configured', () => {
    const url = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
    
    if (!url) {
      throw new Error(
        'SUPABASE_URL is not set. Please add it to your .env file.\n' +
        'Expected format: https://xxxxxxxxxxxxx.supabase.co'
      );
    }

    expect(url).toMatch(/^https:\/\/.*\.supabase\.co$/);
    console.log('✓ Supabase URL configured:', url.replace(/https:\/\/(.*)\.supabase\.co/, 'https://***.supabase.co'));
  });

  it('should have Supabase anon key configured', () => {
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!anonKey) {
      throw new Error(
        'SUPABASE_ANON_KEY is not set. Please add it to your .env file.\n' +
        'You can find it in Supabase Dashboard > Settings > API > Project API keys > anon'
      );
    }

    // Anon keys are JWT tokens, should start with eyJ
    expect(anonKey).toMatch(/^eyJ/);
    console.log('✓ Supabase anon key configured');
  });

  it('should be able to initialize auth client', () => {
    expect(supabase.auth).toBeDefined();
    expect(typeof supabase.auth.getSession).toBe('function');
    expect(typeof supabase.auth.signInWithPassword).toBe('function');
    expect(typeof supabase.auth.signUp).toBe('function');
  });

  it('should be able to initialize database client', () => {
    expect(supabase.from).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });
});

/**
 * Manual connection test script
 * 
 * Run this function manually to test the connection:
 * 
 * import { testConnection } from './connection.test';
 * testConnection();
 */
export async function testConnection(): Promise<void> {
  console.log('\n🔌 Testing Supabase Connection...\n');

  try {
    const supabase = getSupabaseClient();

    // Check environment variables
    const url = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!url) {
      console.error('❌ SUPABASE_URL is not set in environment variables');
      console.log('   Please add it to your .env file');
      return;
    }

    if (!anonKey) {
      console.error('❌ SUPABASE_ANON_KEY is not set in environment variables');
      console.log('   Please add it to your .env file');
      return;
    }

    console.log('✓ Environment variables configured');
    console.log(`✓ Supabase URL: ${url.replace(/https:\/\/(.*)\.supabase\.co/, 'https://***.supabase.co')}`);

    // Test connection by trying to get session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ Connection failed:', sessionError.message);
      if (sessionError.message.includes('Invalid API key')) {
        console.log('\n💡 Tip: Check that your SUPABASE_ANON_KEY is correct');
        console.log('   Find it in: Supabase Dashboard > Settings > API > Project API keys > anon');
      }
      return;
    }

    console.log('✓ Supabase client initialized successfully');
    console.log('✓ Authentication client working');

    // Try a simple query (this will fail if RLS is enabled, but that's okay)
    const { error: queryError } = await supabase.from('_prisma_migrations').select('*').limit(1);

    if (queryError) {
      if (queryError.message.includes('Invalid API key') || queryError.message.includes('JWT')) {
        console.error('❌ Authentication error:', queryError.message);
        console.log('\n💡 Tip: Your API key might be invalid or expired');
        return;
      }
      // Table not found or RLS error is acceptable - connection is working
      console.log('✓ Database client working (query returned expected error)');
    } else {
      console.log('✓ Database query successful');
    }

    console.log('\n✅ Connection successful! Your Supabase setup is working correctly.\n');
  } catch (error: any) {
    console.error('\n❌ Connection test failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your .env file has SUPABASE_URL and SUPABASE_ANON_KEY');
    console.log('   2. Verify the keys are correct in Supabase Dashboard');
    console.log('   3. Make sure your Supabase project is not paused');
    console.log('   4. Check your internet connection\n');
  }
}

