/**
 * Application configuration
 * 
 * Centralized app configuration including API endpoints,
 * feature flags, pagination, cache, and map settings.
 * 
 * @module config/app.config
 */

import { env } from './env';

/**
 * API configuration
 */
export const apiConfig = {
  /**
   * API base URL
   */
  baseURL: env.SUPABASE_URL,

  /**
   * Request timeout in milliseconds
   */
  timeout: env.API_TIMEOUT,

  /**
   * Default headers
   */
  headers: {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
  },

  /**
   * Retry configuration
   */
  retry: {
    maxAttempts: 3,
    delay: 1000,
    backoff: 2,
  },
} as const;

/**
 * Pagination defaults
 */
export const paginationConfig = {
  /**
   * Default page size
   */
  defaultPageSize: 20,

  /**
   * Maximum page size
   */
  maxPageSize: 100,

  /**
   * Default page number
   */
  defaultPage: 1,
} as const;

/**
 * Cache configuration
 */
export const cacheConfig = {
  /**
   * Default cache TTL in milliseconds
   */
  defaultTTL: 5 * 60 * 1000, // 5 minutes

  /**
   * Long cache TTL in milliseconds
   */
  longTTL: 30 * 60 * 1000, // 30 minutes

  /**
   * Short cache TTL in milliseconds
   */
  shortTTL: 1 * 60 * 1000, // 1 minute

  /**
   * Maximum cache size (number of items)
   */
  maxSize: 100,
} as const;

/**
 * Map configuration
 */
export const mapConfig = {
  /**
   * Google Maps API key
   */
  googleMapsApiKey: env.GOOGLE_MAPS_API_KEY,

  /**
   * Mapbox access token
   */
  mapboxAccessToken: env.MAPBOX_ACCESS_TOKEN,

  /**
   * Default map center (Den Haag, Netherlands)
   */
  defaultCenter: {
    latitude: 52.0705,
    longitude: 4.3007,
  },

  /**
   * Default map zoom level
   */
  defaultZoom: 13,

  /**
   * Maximum zoom level
   */
  maxZoom: 18,

  /**
   * Minimum zoom level
   */
  minZoom: 10,

  /**
   * Default search radius in kilometers
   */
  defaultSearchRadius: 5,

  /**
   * Maximum search radius in kilometers
   */
  maxSearchRadius: 50,
} as const;

/**
 * Feature flags
 */
export const featureFlags = {
  /**
   * Enable analytics
   */
  analytics: env.ENABLE_ANALYTICS,

  /**
   * Enable crash reporting
   */
  crashReporting: env.ENABLE_CRASH_REPORTING,

  /**
   * Enable push notifications
   */
  pushNotifications: env.ENABLE_PUSH_NOTIFICATIONS,

  /**
   * Enable mock data
   */
  mockData: env.ENABLE_MOCK_DATA,

  /**
   * Enable logging
   */
  logging: env.ENABLE_LOGGING,
} as const;

/**
 * External services configuration
 */
export const externalServices = {
  /**
   * Sentry DSN for error tracking
   */
  sentry: {
    dsn: env.SENTRY_DSN,
    enabled: env.ENABLE_CRASH_REPORTING && !!env.SENTRY_DSN,
  },

  /**
   * Mixpanel configuration
   */
  mixpanel: {
    token: env.MIXPANEL_TOKEN,
    enabled: env.ENABLE_ANALYTICS && !!env.MIXPANEL_TOKEN,
  },
} as const;

/**
 * App metadata
 */
export const appMetadata = {
  /**
   * App name
   */
  name: env.APP_NAME,

  /**
   * App bundle ID
   */
  bundleId: env.APP_BUNDLE_ID,

  /**
   * App version (from package.json)
   */
  version: '1.0.0',

  /**
   * Build number
   */
  buildNumber: '1',
} as const;

/**
 * API endpoints
 */
export const endpoints = {
  /**
   * Authentication endpoints
   */
  auth: {
    signUp: '/auth/v1/signup',
    signIn: '/auth/v1/token',
    signOut: '/auth/v1/logout',
    refreshToken: '/auth/v1/token?grant_type=refresh_token',
    resetPassword: '/auth/v1/recover',
    updatePassword: '/auth/v1/user',
  },

  /**
   * User endpoints
   */
  users: {
    profile: '/rest/v1/profiles',
    updateProfile: '/rest/v1/profiles',
    uploadAvatar: '/storage/v1/object/avatars',
  },

  /**
   * Language exchange endpoints
   */
  exchanges: {
    sessions: '/rest/v1/sessions',
    partners: '/rest/v1/partners',
    matches: '/rest/v1/matches',
    connections: '/rest/v1/connections',
  },

  /**
   * Messages endpoints
   */
  messages: {
    conversations: '/rest/v1/conversations',
    messages: '/rest/v1/messages',
    markRead: '/rest/v1/messages',
  },

  /**
   * Gamification endpoints
   */
  gamification: {
    stats: '/rest/v1/user_stats',
    achievements: '/rest/v1/achievements',
    leaderboard: '/rest/v1/leaderboard',
  },
} as const;

/**
 * Application configuration object
 */
export const appConfig = {
  api: apiConfig,
  pagination: paginationConfig,
  cache: cacheConfig,
  map: mapConfig,
  features: featureFlags,
  services: externalServices,
  metadata: appMetadata,
  endpoints,
} as const;

export default appConfig;
