/**
 * Language constants
 * 
 * Contains ISO 639-1 language codes and their display names
 * used throughout the application.
 * 
 * @module shared/constants/languages
 */

/**
 * Supported languages with their codes and display names
 * 
 * This list can be extended as the app supports more languages.
 * Language codes follow ISO 639-1 standard.
 */
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ar: 'Arabic',
  hi: 'Hindi',
  nl: 'Dutch',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  pl: 'Polish',
  tr: 'Turkish',
  vi: 'Vietnamese',
  th: 'Thai',
} as const;

/**
 * Type for supported language codes
 */
export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

/**
 * Gets the display name for a language code
 * 
 * @param code - ISO 639-1 language code
 * @returns Display name or the code itself if not found
 * @example
 * const name = getLanguageName('en'); // Returns 'English'
 */
export const getLanguageName = (code: string): string => {
  return SUPPORTED_LANGUAGES[code as LanguageCode] || code;
};

/**
 * Gets all supported language codes
 * 
 * @returns Array of language codes
 */
export const getSupportedLanguageCodes = (): string[] => {
  return Object.keys(SUPPORTED_LANGUAGES);
};

