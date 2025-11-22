/**
 * Flowing Waves animated background
 *
 * React Native implementation of the animated background from Figma design.
 * Creates flowing wave patterns and animated gradients.
 *
 * @module presentation/components/FlowingWaves
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@shared/constants/theme';

const { width, height } = Dimensions.get('window');

/**
 * Flowing Waves background component
 *
 * Creates an animated background with flowing wave patterns
 * matching the Figma design.
 *
 * @returns Flowing waves background component
 */
export const FlowingWaves: React.FC = () => {
  const wave1Anim = useRef(new Animated.Value(0)).current;
  const wave2Anim = useRef(new Animated.Value(0)).current;
  const glow1Anim = useRef(new Animated.Value(1)).current;
  const glow2Anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Wave animation 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(wave1Anim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(wave1Anim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animation 2 (offset)
    Animated.loop(
      Animated.sequence([
        Animated.timing(wave2Anim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(wave2Anim, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow1Anim, {
          toValue: 1.2,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(glow1Anim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow2Anim, {
          toValue: 1.3,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(glow2Anim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const wave1TranslateY = wave1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const wave2TranslateY = wave2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0A4D3C', COLORS.background, COLORS.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated Glow - Left */}
      <Animated.View
        style={[
          styles.glow,
          styles.glowLeft,
          {
            transform: [
              { scale: glow1Anim },
              { translateX: wave1Anim.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] }) },
              { translateY: wave1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[`${COLORS.primary}33`, 'transparent']}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Animated Glow - Right */}
      <Animated.View
        style={[
          styles.glow,
          styles.glowRight,
          {
            transform: [
              { scale: glow2Anim },
              { translateX: wave2Anim.interpolate({ inputRange: [0, 1], outputRange: [50, -50] }) },
              { translateY: wave2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[`${COLORS.secondary}33`, 'transparent']}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Wave Pattern Overlay */}
      <View style={styles.waveOverlay} pointerEvents="none">
        {/* Simplified wave pattern using opacity */}
        <Animated.View
          style={[
            styles.waveLine,
            {
              opacity: 0.3,
              transform: [{ translateY: wave1TranslateY }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.waveLine,
            {
              opacity: 0.2,
              transform: [{ translateY: wave2TranslateY }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  glowLeft: {
    left: -128,
    top: height * 0.25,
  },
  glowRight: {
    right: -128,
    top: height * 0.5,
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 128,
  },
  waveOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  waveLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: COLORS.primary,
    top: '20%',
  },
});
