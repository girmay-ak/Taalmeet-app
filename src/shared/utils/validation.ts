/**
 * Validation utilities
 * 
 * Provides reusable validation functions for common data types
 * and formats used throughout the application.
 * 
 * @module shared/utils/validation
 */

/**
 * Validates an email address format
 * 
 * @param email - Email address to validate
 * @returns True if email format is valid
 * @example
 * if (isValidEmail('user@example.com')) {
 *   // Email is valid
 * }
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a language code (ISO 639-1)
 * 
 * @param code - Language code to validate
 * @returns True if language code is valid
 * @example
 * if (isValidLanguageCode('en')) {
 *   // Language code is valid
 * }
 */
export const isValidLanguageCode = (code: string): boolean => {
  const languageCodeRegex = /^[a-z]{2}$/;
  return languageCodeRegex.test(code.toLowerCase());
};

/**
 * Validates that a string is not empty or only whitespace
 * 
 * @param value - String to validate
 * @returns True if string has content
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates that a value is within a specified range
 * 
 * @param value - Value to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if value is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

