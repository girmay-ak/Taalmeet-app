/**
 * Status indicator component
 * 
 * Displays user availability status with color coding.
 * 
 * @module presentation/components/StatusIndicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING } from '@shared/constants/theme';

type Status = 'available' | 'soon' | 'busy' | 'offline';

interface StatusIndicatorProps {
  status: Status;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  showLabel = false,
  size = 'small',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          color: COLORS.success,
          label: 'Available',
          bgColor: `${COLORS.success}33`,
        };
      case 'soon':
        return {
          color: COLORS.warning,
          label: 'Available Soon',
          bgColor: `${COLORS.warning}33`,
        };
      case 'busy':
        return {
          color: COLORS.error,
          label: 'Busy',
          bgColor: `${COLORS.error}33`,
        };
      case 'offline':
        return {
          color: COLORS.textMuted,
          label: 'Offline',
          bgColor: `${COLORS.textMuted}33`,
        };
    }
  };

  const config = getStatusConfig();
  const dotSize = size === 'small' ? 8 : size === 'medium' ? 12 : 16;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: config.color,
          },
        ]}
      />
      {showLabel && (
        <Text style={[styles.label, { color: config.color }]}>
          {config.label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dot: {
    borderRadius: 999,
  },
  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default StatusIndicator;

