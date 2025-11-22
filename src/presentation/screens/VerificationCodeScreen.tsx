/**
 * Verification Code Screen component
 * 
 * Screen for entering verification code sent via email or phone.
 * 
 * @module presentation/screens/VerificationCodeScreen
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface VerificationCodeScreenProps {
  verificationType: 'email' | 'phone';
  contactInfo: string;
  onVerified: () => void;
  onBack: () => void;
  purpose: 'signup' | 'login' | 'security';
}

export const VerificationCodeScreen: React.FC<VerificationCodeScreenProps> = ({
  verificationType,
  contactInfo,
  onVerified,
  onBack,
  purpose,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields filled
    if (newCode.every((digit) => digit !== '') && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setLoading(true);
    setError('');
    Keyboard.dismiss();

    // Simulate API call
    setTimeout(() => {
      // Mock verification - accept "123456" as valid
      if (verificationCode === '123456') {
        onVerified();
      } else {
        setError('Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
      setLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;

    // Simulate resend
    setResendTimer(60);
    setCode(['', '', '', '', '', '']);
    setError('');
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const maskedContact =
    verificationType === 'email'
      ? contactInfo.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      : contactInfo.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');

  const getPurposeText = () => {
    switch (purpose) {
      case 'signup':
        return 'Complete Your Registration';
      case 'login':
        return 'Verify Your Identity';
      case 'security':
        return 'Security Verification';
      default:
        return 'Verification Required';
    }
  };

  const iconScale = useSharedValue(1);
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  useEffect(() => {
    iconScale.value = withSpring(1, { damping: 12 });
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verification</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        {/* Icon */}
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.iconGradient}
          >
            <Ionicons
              name={
                verificationType === 'email'
                  ? 'mail'
                  : verificationType === 'phone'
                  ? 'call'
                  : 'shield-checkmark'
              }
              size={40}
              color="#FFFFFF"
            />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{getPurposeText()}</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to
          </Text>
          <Text style={styles.contactInfo}>{maskedContact}</Text>
        </View>

        {/* 6-Digit Input */}
        <View style={styles.codeContainer}>
          <View style={styles.codeInputs}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  error && styles.codeInputError,
                  digit && !error && styles.codeInputFilled,
                ]}
                value={digit}
                onChangeText={(value) => handleChange(index, value)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(index, nativeEvent.key)
                }
                keyboardType="number-pad"
                maxLength={1}
                editable={!loading}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Error Message */}
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        {/* Resend Code */}
        <View style={styles.resendSection}>
          <Text style={styles.resendLabel}>Didn't receive the code?</Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={resendTimer > 0}
            style={styles.resendButton}
          >
            <Text
              style={[
                styles.resendText,
                resendTimer > 0 && styles.resendTextDisabled,
              ]}
            >
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpCard}>
          <Text style={styles.helpText}>
            💡 <Text style={styles.helpBold}>Demo Tip:</Text> Use code{' '}
            <Text style={styles.helpCode}>123456</Text> to verify
          </Text>
        </View>
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Verifying...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: SPACING['2xl'],
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING['2xl'],
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING['5xl'],
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  contactInfo: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  codeContainer: {
    width: '100%',
    marginBottom: SPACING['2xl'],
  },
  codeInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  codeInput: {
    width: 48,
    height: 56,
    textAlign: 'center',
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.semibold,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    color: COLORS.textPrimary,
  },
  codeInputFilled: {
    borderColor: COLORS.primary,
  },
  codeInputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  resendLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  resendButton: {
    padding: SPACING.sm,
  },
  resendText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.primary,
  },
  resendTextDisabled: {
    color: COLORS.textMuted,
  },
  helpCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    width: '100%',
  },
  helpText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  helpBold: {
    fontWeight: FONT_WEIGHT.medium,
  },
  helpCode: {
    fontFamily: 'monospace',
    color: COLORS.primary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
});

export default VerificationCodeScreen;

