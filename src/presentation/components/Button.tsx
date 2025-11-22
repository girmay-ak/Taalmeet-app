/**
 * Button component
 *
 * Reusable button component with consistent styling.
 * This component follows the design system and can be customized
 * with different variants and sizes.
 *
 * @module presentation/components/Button
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING } from '@shared/constants/theme';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'gradient';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button component props
 */
export interface ButtonProps {
  /** Button text */
  title: string;

  /** Click handler */
  onPress: () => void;

  /** Button variant */
  variant?: ButtonVariant;

  /** Button size */
  size?: ButtonSize;

  /** Whether button is disabled */
  disabled?: boolean;

  /** Whether button is in loading state */
  loading?: boolean;

  /** Custom styles */
  style?: ViewStyle;

  /** Custom text styles */
  textStyle?: TextStyle;

  /** Icon name (Ionicons) or ReactNode */
  icon?: keyof typeof Ionicons.glyphMap | React.ReactNode;

  /** Icon position */
  iconPosition?: 'left' | 'right';

  /** Icon color */
  iconColor?: string;

  /** Icon size */
  iconSize?: number;
}

/**
 * Reusable button component
 *
 * Provides a consistent button UI across the application.
 * Supports different variants, sizes, and states (loading, disabled).
 *
 * @param props - Button component props
 * @returns Button component
 * @example
 * <Button
 *   title="Sign In"
 *   onPress={handleSignIn}
 *   variant="primary"
 *   size="large"
 * />
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  iconColor,
  iconSize = 20,
}) => {
  const buttonStyle = [
    styles.button,
    styles[`button_${size}`],
    disabled && styles.buttonDisabled,
    style,
  ];

  const combinedTextStyle: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  // Render icon
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      const color =
        iconColor || (variant === 'primary' || variant === 'gradient' ? '#FFFFFF' : COLORS.primary);
      return (
        <Ionicons
          name={icon}
          size={iconSize}
          color={color}
          style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
        />
      );
    }

    return <View style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}>{icon}</View>;
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'gradient' ? '#fff' : COLORS.primary}
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && renderIcon()}
          <Text style={combinedTextStyle}>{title}</Text>
          {icon && iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </>
  );

  if (variant === 'primary' || variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={buttonStyle}
      >
        <LinearGradient
          colors={
            variant === 'gradient'
              ? [COLORS.primary, COLORS.secondary]
              : [COLORS.primary, COLORS.primaryLight]
          }
          style={[styles.gradient, styles[`button_${size}`]]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[buttonStyle, styles[`button_${variant}`]]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconLeft: {
    marginRight: SPACING.xs,
  },
  iconRight: {
    marginLeft: SPACING.xs,
  },
  button_primary: {
    backgroundColor: COLORS.primary,
  },
  button_secondary: {
    backgroundColor: COLORS.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  button_gradient: {
    // Handled by LinearGradient
  },
  button_small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  button_medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  button_large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: FONT_WEIGHT.semibold,
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#FFFFFF',
  },
  text_outline: {
    color: COLORS.primary,
  },
  text_gradient: {
    color: '#FFFFFF',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  textDisabled: {
    opacity: 0.7,
  },
});

export default Button;
