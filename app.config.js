/**
 * Expo configuration
 * 
 * This file configures the Expo app for development and production.
 * It's used by Expo CLI and EAS Build.
 * 
 * Environment variables are loaded from .env files based on NODE_ENV.
 * 
 * @module app.config
 */

// Determine which .env file to load based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
let envFile = '.env.development';

if (nodeEnv === 'staging') {
  envFile = '.env.staging';
} else if (nodeEnv === 'production') {
  envFile = '.env.production';
}

// Load environment variables
require('dotenv').config({ path: envFile });

const appName = process.env.APP_NAME || 'TaalMeet';
const bundleId = process.env.APP_BUNDLE_ID || 'com.taalmeet.app';

export default {
  expo: {
    name: appName,
    slug: 'taalmeet-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleId,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: bundleId,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    scheme: 'taalmeet',
    extra: {
      // Environment variables accessible via Constants.expoConfig.extra
      NODE_ENV: process.env.NODE_ENV || 'development',
      APP_NAME: appName,
      APP_BUNDLE_ID: bundleId,
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || '',
      API_TIMEOUT: process.env.API_TIMEOUT || '30000',
      ENABLE_LOGGING: process.env.ENABLE_LOGGING || 'true',
      ENABLE_MOCK_DATA: process.env.ENABLE_MOCK_DATA || 'true',
      ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS || 'false',
      ENABLE_CRASH_REPORTING: process.env.ENABLE_CRASH_REPORTING || 'false',
      ENABLE_PUSH_NOTIFICATIONS: process.env.ENABLE_PUSH_NOTIFICATIONS || 'false',
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN || '',
      SENTRY_DSN: process.env.SENTRY_DSN || '',
      MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN || '',
    },
  },
};

