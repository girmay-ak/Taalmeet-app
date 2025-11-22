/**
 * Logo component
 * 
 * Displays the TaalMeet logo. Uses a placeholder if the image file is not available.
 * 
 * @module presentation/components/Logo
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS } from '@shared/constants/theme';

interface LogoProps {
  size?: number;
  showText?: boolean;
  style?: any;
}

/**
 * Logo component
 * 
 * Displays the TaalMeet logo with fallback to a gradient placeholder.
 * 
 * @param props - Logo component props
 * @returns Logo component
 */
export const Logo: React.FC<LogoProps> = ({ 
  size = 80, 
  showText = false,
  style 
}) => {
  // Use gradient placeholder for now (logo.png is base64 encoded, not a valid image)
  // TODO: Replace with actual logo image file when available
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.placeholder, { width: size, height: size, borderRadius: size * 0.25 }]}
      >
        {showText && (
          <Text style={[styles.logoText, { fontSize: size * 0.3 }]}>TM</Text>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default Logo;

