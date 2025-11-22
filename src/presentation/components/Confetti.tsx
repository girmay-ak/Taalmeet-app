/**
 * Confetti animation component
 *
 * Animated confetti particles falling from the top of the screen.
 * Used for celebration effects (e.g., verification success, achievements).
 *
 * @module presentation/components/Confetti
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@shared/constants/theme';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
  shape: 'circle' | 'square';
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Confetti: React.FC<ConfettiProps> = ({ active, duration = 3000 }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = [
        COLORS.primary,
        COLORS.primaryLight,
        COLORS.secondary,
        COLORS.tertiary,
        '#8B5CF6',
        '#F59E0B',
        COLORS.success,
        '#EC4899',
      ];
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
        rotation: Math.random() * 360,
        size: Math.random() * 10 + 5,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [active, duration]);

  if (!active || pieces.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map(piece => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
    </View>
  );
};

interface ConfettiPieceProps {
  piece: ConfettiPiece;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ piece }) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(piece.x);
  const rotate = useSharedValue(piece.rotation);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start with delay
    const delayTimer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 200 });

      translateY.value = withTiming(
        SCREEN_HEIGHT + 20,
        {
          duration: 2500,
          easing: Easing.in(Easing.ease),
        },
        () => {
          opacity.value = withTiming(0, { duration: 200 });
        }
      );

      const randomOffset1 = (Math.random() - 0.5) * 50;
      const randomOffset2 = (Math.random() - 0.5) * 50;

      translateX.value = withSequence(
        withTiming(piece.x + randomOffset1, {
          duration: 1250,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(piece.x + randomOffset2, {
          duration: 1250,
          easing: Easing.inOut(Easing.ease),
        })
      );

      rotate.value = withTiming(piece.rotation + 720, {
        duration: 2500,
        easing: Easing.linear,
      });
    }, piece.delay * 1000);

    return () => clearTimeout(delayTimer);
  }, [piece.delay, piece.x, piece.rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: piece.x,
          width: piece.size,
          height: piece.size,
          backgroundColor: piece.color,
          borderRadius: piece.shape === 'circle' ? piece.size / 2 : 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    top: -20,
  },
});

export default Confetti;
