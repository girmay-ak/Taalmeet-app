/**
 * Partner card component
 * 
 * Displays a partner/user card with avatar, info, and actions.
 * 
 * @module presentation/components/PartnerCard
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, RADIUS, SPACING } from '@shared/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export interface Partner {
  id: string;
  name: string;
  age: number;
  avatar: string;
  isOnline: boolean;
  distance: number;
  matchScore: number;
  verified: boolean;
  premium: boolean;
  bio: string;
  teaching: { language: string; level: string; flag: string };
  learning: { language: string; level: string; flag: string };
  interests: string[];
  availableNow?: boolean;
  lastActive?: string;
}

interface PartnerCardProps {
  partner: Partner;
  onClick?: () => void;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner, onClick }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onClick}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: partner.avatar }}
            style={styles.avatar}
          />
          {partner.isOnline && (
            <View style={styles.onlineIndicator} />
          )}
          {partner.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={10} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {partner.name}
            </Text>
            {partner.premium && (
              <Ionicons name="diamond" size={16} color={COLORS.warning} />
            )}
          </View>

          <View style={styles.languages}>
            <Text style={styles.languageText}>
              {partner.teaching.flag} Teaching: {partner.teaching.language}
            </Text>
            <Text style={styles.languageText}>
              {partner.learning.flag} Learning: {partner.learning.language}
            </Text>
          </View>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{partner.distance} km</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="heart" size={12} color={COLORS.error} />
              <Text style={styles.metaText}>{partner.matchScore}% match</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  content: {
    flexDirection: 'row',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  verifiedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  languages: {
    marginBottom: SPACING.xs,
  },
  languageText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  meta: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
});

export default PartnerCard;

