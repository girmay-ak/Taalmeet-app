/**
 * Onboarding screens component
 * 
 * Welcome screens shown before signup.
 * 
 * @module presentation/screens/signup/OnboardingScreens
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface OnboardingScreensProps {
  onComplete: () => void;
  onSkip: () => void;
}

const slides = [
  {
    title: 'Find Language\nPartners Nearby',
    description: 'Connect with native speakers in your area for real conversations',
    emoji: '🗺️',
    gradient: [COLORS.primary, COLORS.primaryLight],
  },
  {
    title: 'Practice Real\nConversations',
    description: 'Learn by speaking, not just studying. Real people, real practice.',
    emoji: '💬',
    gradient: [COLORS.secondary, '#4A9999'],
  },
  {
    title: 'Meet for Coffee\nor Video Chat',
    description: 'Exchange languages in person at a café or online from home',
    emoji: '☕',
    gradient: [COLORS.success, '#34D399'],
  },
];

export const OnboardingScreens: React.FC<OnboardingScreensProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideOpacity = useSharedValue(1);
  const slideTranslateX = useSharedValue(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      slideOpacity.value = withTiming(0, { duration: 200 });
      slideTranslateX.value = withTiming(-100, { duration: 200 });
      
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        slideOpacity.value = 0;
        slideTranslateX.value = 100;
        slideOpacity.value = withTiming(1, { duration: 300 });
        slideTranslateX.value = withSpring(0);
      }, 200);
    } else {
      onComplete();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: slideOpacity.value,
    transform: [{ translateX: slideTranslateX.value }],
  }));

  const currentSlideData = slides[currentSlide];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.skipContainer} edges={['top']}>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.content}>
        <Animated.View style={[styles.slide, animatedStyle]}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <LinearGradient
              colors={currentSlideData.gradient}
              style={styles.illustration}
            >
              <Text style={styles.emoji}>{currentSlideData.emoji}</Text>
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>{currentSlideData.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{currentSlideData.description}</Text>
        </Animated.View>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentSlide(index)}
            style={[
              styles.dot,
              index === currentSlide && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Next Button */}
      <SafeAreaView style={styles.buttonContainer} edges={['bottom']}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipContainer: {
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING.lg,
    alignItems: 'flex-end',
  },
  skipButton: {
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
  },
  slide: {
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: SPACING['5xl'],
  },
  illustration: {
    width: 192,
    height: 192,
    borderRadius: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 96,
  },
  title: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 40,
  },
  description: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 300,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING['5xl'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 32,
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    paddingHorizontal: SPACING['2xl'],
    paddingBottom: SPACING['5xl'],
  },
  nextButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
});

export default OnboardingScreens;

