/**
 * Splash screen component
 *
 * First screen shown when app launches.
 * Matches the Figma design with animated logo and flowing waves background.
 *
 * @module presentation/screens/SplashScreen
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { FlowingWaves } from '../components/FlowingWaves';
import { Logo } from '../components/Logo';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, RADIUS } from '@shared/constants/theme';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

/**
 * Splash screen component
 *
 * Displays animated logo and app branding.
 * Automatically transitions to login screen after 2.5 seconds.
 *
 * @param props - Splash screen props
 * @returns Splash screen component
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const glowScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        damping: 12,
        stiffness: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Title animation
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1.2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Auto-transition after 2.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <FlowingWaves />

      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        {/* Outer Glow */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              transform: [{ scale: glowScale }],
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Logo Card */}
        <View style={styles.logoCard}>
          <Logo size={80} showText={true} />
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        <Text style={styles.title}>TaalMeet</Text>
        <Text style={styles.tagline}>Meet. Speak. Connect.</Text>
      </Animated.View>

      {/* Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    opacity: 0.4,
  },
  logoCard: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.xl,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: TYPOGRAPHY['4xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 32,
  },
  version: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    opacity: 0.5,
  },
});

export default SplashScreen;
