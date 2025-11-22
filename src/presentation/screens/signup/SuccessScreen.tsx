/**
 * Success screen component
 * 
 * Shown after successful signup.
 * 
 * @module presentation/screens/signup/SuccessScreen
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface SuccessScreenProps {
  onComplete: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onComplete }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 500 });
    ringScale.value = withRepeat(
      withTiming(1.3, { duration: 1000 }),
      -1,
      true
    );
    ringOpacity.value = withRepeat(
      withTiming(0, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const features = [
    { icon: '🗺️', text: 'Discover partners nearby' },
    { icon: '💬', text: 'Chat instantly' },
    { icon: '⭐', text: 'Build connections' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <View style={styles.centerContent}>
          {/* Success Animation */}
          <Animated.View style={[styles.animationContainer, animatedStyle]}>
            <Animated.View style={[styles.ring, ringStyle]} />
            <View style={styles.successCircle}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.successGradient}
              >
                <Text style={styles.emoji}>🎉</Text>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Success Message */}
          <Animated.View style={[styles.messageContainer, animatedStyle]}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.appName}>TaalMeet!</Text>
            <Text style={styles.description}>
              Your profile is ready! Let's find your first language partner.
            </Text>
          </Animated.View>

          {/* Features Preview */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureEmoji}>{feature.icon}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            title="Discover Partners"
            onPress={onComplete}
            variant="primary"
            size="large"
            icon={<Ionicons name="sparkles" size={20} color="#FFFFFF" />}
            style={styles.discoverButton}
          />
          <TouchableOpacity onPress={onComplete} style={styles.laterButton}>
            <Text style={styles.laterButtonText}>Complete Profile Later</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING['2xl'],
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    position: 'relative',
    marginBottom: SPACING['5xl'],
  },
  ring: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  successCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
  },
  successGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: SPACING['5xl'],
  },
  title: {
    fontSize: TYPOGRAPHY['4xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  appName: {
    fontSize: TYPOGRAPHY['4xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 300,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 300,
    gap: SPACING.md,
    marginBottom: SPACING['5xl'],
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
  buttonsContainer: {
    width: '100%',
    gap: SPACING.md,
    paddingBottom: SPACING['2xl'],
  },
  discoverButton: {
    marginBottom: SPACING.sm,
  },
  laterButton: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  laterButtonText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
  },
});

export default SuccessScreen;

