/**
 * Logger Utility
 * 
 * Simple logging utility for development and production.
 * Only logs in development mode or when explicitly enabled.
 * 
 * @module shared/utils/logger
 */

import { env } from '@config/env';

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Logger class
 * 
 * Provides structured logging with different log levels.
 * Automatically disabled in production unless explicitly enabled.
 * 
 * @example
 * ```typescript
 * const logger = new Logger('MyComponent');
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to fetch data', error);
 * ```
 */
export class Logger {
  private context: string;
  private enabled: boolean;

  /**
   * Creates a new Logger instance
   * 
   * @param context - Context name (usually component/class name)
   */
  constructor(context: string) {
    this.context = context;
    this.enabled = env.ENABLE_LOGGING || __DEV__;
  }

  /**
   * Log debug message
   * 
   * @param message - Log message
   * @param data - Additional data to log
   */
  debug(message: string, data?: any): void {
    if (this.enabled) {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  /**
   * Log info message
   * 
   * @param message - Log message
   * @param data - Additional data to log
   */
  info(message: string, data?: any): void {
    if (this.enabled) {
      this.log(LogLevel.INFO, message, data);
    }
  }

  /**
   * Log warning message
   * 
   * @param message - Log message
   * @param data - Additional data to log
   */
  warn(message: string, data?: any): void {
    if (this.enabled) {
      this.log(LogLevel.WARN, message, data);
    }
  }

  /**
   * Log error message
   * 
   * @param message - Log message
   * @param error - Error object or additional data
   */
  error(message: string, error?: any): void {
    // Always log errors, even in production
    this.log(LogLevel.ERROR, message, error);
  }

  /**
   * Internal log method
   * 
   * @param level - Log level
   * @param message - Log message
   * @param data - Additional data
   */
  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}] [${this.context}]`;

    const logMessage = data
      ? `${prefix} ${message}`
      : `${prefix} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, data || '');
        break;
      case LogLevel.INFO:
        console.log(logMessage, data || '');
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data || '');
        break;
      case LogLevel.ERROR:
        console.error(logMessage, data || '');
        if (data instanceof Error) {
          console.error('Error stack:', data.stack);
        }
        break;
    }
  }
}

