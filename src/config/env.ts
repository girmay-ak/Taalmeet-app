/**
 * Environment configuration
 * 
 * Type-safe environment variable access with validation.
 * Reads from process.env and validates required variables.
 * 
 * @module config/env
 */

import Constants from 'expo-constants';

/**
 * Environment type
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * Environment configuration interface
 */
export interface EnvConfig {
  // Environment
  NODE_ENV: Environment;
  APP_NAME: string;
  APP_BUNDLE_ID: string;

  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;

  // API Configuration
  API_TIMEOUT: number;
  ENABLE_LOGGING: boolean;
  ENABLE_MOCK_DATA: boolean;

  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;

  // Maps
  GOOGLE_MAPS_API_KEY: string;
  MAPBOX_ACCESS_TOKEN: string;

  // External Services
  SENTRY_DSN: string;
  MIXPANEL_TOKEN: string;
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, defaultValue?: string): string {
  // Try expo-constants first (for Expo)
  const expoValue = Constants.expoConfig?.extra?.[key];
  if (expoValue !== undefined && expoValue !== null && expoValue !== '') {
    return String(expoValue);
  }

  // Fallback to process.env
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get boolean environment variable
 */
function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, String(defaultValue));
  return value === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getNumberEnvVar(key: string, defaultValue: number): number {
  const value = getEnvVar(key, String(defaultValue));
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
}

/**
 * Validate required environment variables
 */
function validateEnv(): void {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
  ];

  const missing: string[] = [];

  for (const key of required) {
    try {
      getEnvVar(key);
    } catch {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or app.config.js'
    );
  }
}

/**
 * Environment configuration object
 */
export const env: EnvConfig = {
  // Environment
  NODE_ENV: (getEnvVar('NODE_ENV', 'development') as Environment),
  APP_NAME: getEnvVar('APP_NAME', 'TaalMeet'),
  APP_BUNDLE_ID: getEnvVar('APP_BUNDLE_ID', 'com.taalmeet.app'),

  // Supabase
  SUPABASE_URL: getEnvVar('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_KEY: getEnvVar('SUPABASE_SERVICE_KEY', ''),

  // API Configuration
  API_TIMEOUT: getNumberEnvVar('API_TIMEOUT', 30000),
  ENABLE_LOGGING: getBooleanEnvVar('ENABLE_LOGGING', true),
  ENABLE_MOCK_DATA: getBooleanEnvVar('ENABLE_MOCK_DATA', true),

  // Feature Flags
  ENABLE_ANALYTICS: getBooleanEnvVar('ENABLE_ANALYTICS', false),
  ENABLE_CRASH_REPORTING: getBooleanEnvVar('ENABLE_CRASH_REPORTING', false),
  ENABLE_PUSH_NOTIFICATIONS: getBooleanEnvVar('ENABLE_PUSH_NOTIFICATIONS', false),

  // Maps
  GOOGLE_MAPS_API_KEY: getEnvVar('GOOGLE_MAPS_API_KEY', ''),
  MAPBOX_ACCESS_TOKEN: getEnvVar('MAPBOX_ACCESS_TOKEN', ''),

  // External Services
  SENTRY_DSN: getEnvVar('SENTRY_DSN', ''),
  MIXPANEL_TOKEN: getEnvVar('MIXPANEL_TOKEN', ''),
};

// Validate environment on import (skip validation in test environment)
if (process.env.NODE_ENV !== 'test') {
  try {
    validateEnv();
  } catch (error) {
    // Only throw in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      console.warn('Environment validation warning:', error);
    }
  }
}

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if running in staging
 */
export const isStaging = env.NODE_ENV === 'staging';

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Get current environment
 */
export const getEnvironment = (): Environment => env.NODE_ENV;

export default env;
