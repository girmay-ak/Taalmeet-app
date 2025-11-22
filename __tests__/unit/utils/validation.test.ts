/**
 * Unit tests for Validation Utilities
 *
 * Tests validation functions in isolation.
 *
 * @module __tests__/unit/utils/validation.test
 */

import { isValidEmail, isValidLanguageCode, isNotEmpty, isInRange } from '@shared/utils/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidLanguageCode', () => {
    it('should return true for valid language codes', () => {
      expect(isValidLanguageCode('en')).toBe(true);
      expect(isValidLanguageCode('nl')).toBe(true);
      expect(isValidLanguageCode('es')).toBe(true);
      expect(isValidLanguageCode('EN')).toBe(true); // Should be case-insensitive
    });

    it('should return false for invalid language codes', () => {
      expect(isValidLanguageCode('eng')).toBe(false); // Too long
      expect(isValidLanguageCode('e')).toBe(false); // Too short
      expect(isValidLanguageCode('12')).toBe(false); // Numbers
      expect(isValidLanguageCode('')).toBe(false); // Empty
    });
  });

  describe('isNotEmpty', () => {
    it('should return true for non-empty strings', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('  hello  ')).toBe(true);
      expect(isNotEmpty('a')).toBe(true);
    });

    it('should return false for empty or whitespace-only strings', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
      expect(isNotEmpty('\t\n')).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should return true for values within range', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true); // Min boundary
      expect(isInRange(10, 1, 10)).toBe(true); // Max boundary
    });

    it('should return false for values outside range', () => {
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
      expect(isInRange(-5, 1, 10)).toBe(false);
    });
  });
});
