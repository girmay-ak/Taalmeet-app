/**
 * Theme constants
 * 
 * Color palette and design tokens from Figma design.
 * These match the design system exactly.
 * 
 * @module shared/constants/theme
 */

/**
 * Primary brand colors (Green theme)
 */
export const COLORS = {
  // Green Theme
  primary: '#1DB954',
  primaryLight: '#1ED760',
  secondary: '#5FB3B3',
  accent: '#4FD1C5',
  
  // Dark Mode Backgrounds
  background: '#0F0F0F',
  card: '#1A1A1A',
  cardHover: '#222222',
  border: '#2A2A2A',
  borderLight: '#3A3A3A',
  
  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E5E5',
  textMuted: '#9CA3AF',
  textDark: '#6B7280',
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Social Colors
  google: '#DB4437',
  apple: '#000000',
  
  // Status Colors
  online: '#10B981',
  away: '#F59E0B',
  busy: '#EF4444',
  offline: '#6B7280',
} as const;

/**
 * Spacing scale (4px base unit)
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

/**
 * Border radius
 */
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

/**
 * Typography sizes
 */
export const TYPOGRAPHY = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

/**
 * Font weights
 */
export const FONT_WEIGHT = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

