/**
 * Login screen component
 * 
 * User authentication screen matching the Figma design.
 * Includes email/password login and social login options.
 * 
 * @module presentation/screens/LoginScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlowingWaves } from '../components/FlowingWaves';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, RADIUS, SPACING } from '@shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
  onLogin: () => void;
  onSignup: () => void;
  onNeedVerification?: (email: string, type: 'email' | 'phone') => void;
}

/**
 * Login screen component
 * 
 * Provides email/password login and social login options.
 * 
 * @param props - Login screen props
 * @returns Login screen component
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onSignup,
  onNeedVerification,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);

      // For demo: if email contains "verify", trigger verification
      if (email.includes('verify') && onNeedVerification) {
        onNeedVerification(email, 'email');
      } else {
        onLogin();
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Animated Background */}
      <FlowingWaves />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo & Title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Logo size={80} showText={true} />
          </View>
          <Text style={styles.title}>Welcome to TaalMeet</Text>
          <Text style={styles.subtitle}>Meet. Speak. Connect.</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <Input
            label="Email"
            leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />}
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password Input */}
          <Input
            label="Password"
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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.loginButton, (isLoading || !email || !password) && styles.loginButtonDisabled]}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.loginButtonText}>Logging in...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          {/* Google Login */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={onLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={20} color={COLORS.background} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple Login */}
          <TouchableOpacity
            style={[styles.socialButton, styles.socialButtonDark]}
            onPress={onLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-apple" size={20} color={COLORS.textPrimary} />
            <Text style={[styles.socialButtonText, styles.socialButtonTextDark]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onSignup}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING['5xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['5xl'],
  },
  logoContainer: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  form: {
    marginBottom: SPACING['2xl'],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.secondary,
  },
  loginButton: {
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.lg,
  },
  socialContainer: {
    gap: SPACING.md,
    marginBottom: SPACING['5xl'],
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    minHeight: 52,
  },
  socialButtonDark: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.background,
  },
  socialButtonTextDark: {
    color: COLORS.textPrimary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
  },
  signupLink: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primary,
  },
});

export default LoginScreen;

