/**
 * Input component
 *
 * Reusable text input with icon support.
 * Matches the Figma design with dark theme styling.
 *
 * @module presentation/components/Input
 */

import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, RADIUS, SPACING } from '@shared/constants/theme';

export interface InputProps extends TextInputProps {
  /** Input label */
  label?: string;

  /** Left icon component */
  leftIcon?: React.ReactNode;

  /** Right icon component (e.g., password visibility toggle) */
  rightIcon?: React.ReactNode;

  /** Error message */
  error?: string;

  /** Custom container style */
  containerStyle?: ViewStyle;
}

/**
 * Input component
 *
 * Provides a styled text input with optional icons and error handling.
 *
 * @param props - Input component props
 * @returns Input component
 * @example
 * <Input
 *   label="Email"
 *   leftIcon={<Mail size={20} color={COLORS.textMuted} />}
 *   placeholder="your@email.com"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 */
export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  rightIcon,
  error,
  containerStyle,
  style,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
            style,
          ]}
          placeholderTextColor={COLORS.textMuted}
          {...textInputProps}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    minHeight: 52,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.lg,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.md,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.md,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  error: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default Input;
