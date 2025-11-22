/**
 * Signup step 1 component
 *
 * Account creation with name, email, and password.
 *
 * @module presentation/screens/signup/SignupStep1
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface SignupStep1Props {
  onNext: (data: { name: string; email: string; password: string }) => void;
  onBack: () => void;
}

export const SignupStep1: React.FC<SignupStep1Props> = ({ onNext, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const getStrengthLabel = () => {
    if (passwordStrength <= 25) return { label: 'Weak', color: COLORS.error };
    if (passwordStrength <= 50) return { label: 'Fair', color: COLORS.warning };
    if (passwordStrength <= 75) return { label: 'Good', color: '#EAB308' };
    return { label: 'Strong', color: COLORS.success };
  };

  const strengthInfo = getStrengthLabel();
  const strengthWidth = useSharedValue(0);

  React.useEffect(() => {
    strengthWidth.value = withTiming(passwordStrength, { duration: 300 });
  }, [passwordStrength]);

  const strengthAnimatedStyle = useAnimatedStyle(() => ({
    width: `${strengthWidth.value}%`,
  }));

  const checks = [
    { label: '8+ characters', valid: password.length >= 8 },
    { label: '1 uppercase', valid: /[A-Z]/.test(password) },
    { label: '1 number', valid: /[0-9]/.test(password) },
  ];

  const canProceed = name && email && password.length >= 8 && password === confirmPassword;

  const handleSubmit = () => {
    if (canProceed) {
      onNext({ name, email, password });
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>1/4</Text>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.title}>Create Account 🎉</Text>
          <Text style={styles.subtitle}>Let's get started!</Text>

          <Input
            label="Full Name"
            placeholder="John Smith"
            value={name}
            onChangeText={setName}
            leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.textMuted} />}
          />

          <Input
            label="Email"
            placeholder="john@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            }
          />

          {/* Password Strength */}
          {password && (
            <View style={styles.passwordStrength}>
              <View style={styles.strengthHeader}>
                <Text style={styles.strengthLabel}>Password strength:</Text>
                <Text style={[styles.strengthValue, { color: strengthInfo.color }]}>
                  {strengthInfo.label} 💪
                </Text>
              </View>
              <View style={styles.strengthBar}>
                <Animated.View
                  style={[
                    styles.strengthBarFill,
                    { backgroundColor: strengthInfo.color },
                    strengthAnimatedStyle,
                  ]}
                />
              </View>
              <View style={styles.checks}>
                {checks.map((check, index) => (
                  <View key={index} style={styles.checkItem}>
                    <View style={[styles.checkCircle, check.valid && styles.checkCircleValid]}>
                      {check.valid && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.checkText, check.valid && styles.checkTextValid]}>
                      {check.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            }
          />

          {confirmPassword && password !== confirmPassword && (
            <Text style={styles.errorText}>Passwords don't match</Text>
          )}

          <Button
            title="Next →"
            onPress={handleSubmit}
            disabled={!canProceed}
            variant="primary"
            size="large"
            style={styles.submitButton}
          />

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLinkText} onPress={onBack}>
                Log In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.sm,
  },
  stepIndicator: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: SPACING['2xl'],
  },
  title: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    marginBottom: SPACING['2xl'],
  },
  passwordStrength: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  strengthLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  strengthValue: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  strengthBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: RADIUS.sm,
  },
  checks: {
    gap: SPACING.xs,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleValid: {
    backgroundColor: COLORS.success,
  },
  checkText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  checkTextValid: {
    color: COLORS.success,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  submitButton: {
    marginTop: SPACING['2xl'],
  },
  loginLink: {
    marginTop: SPACING['2xl'],
    alignItems: 'center',
  },
  loginText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
  },
  loginLinkText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
});

export default SignupStep1;
