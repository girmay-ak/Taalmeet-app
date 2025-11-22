/**
 * Session card component
 *
 * Displays a language exchange session card.
 *
 * @module presentation/components/SessionCard
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, RADIUS, SPACING } from '@shared/constants/theme';

export interface LanguageSession {
  id: string;
  title: string;
  description: string;
  language: string;
  languageFlag: string;
  level: string;
  date: string;
  time: string;
  duration: number;
  attendees: string[];
  totalAttendees: number;
  maxAttendees: number;
  joinedPercentage: number;
  type: string;
  isVirtual: boolean;
  location?: string;
  organizer: {
    name: string;
    avatar: string;
  };
}

interface SessionCardProps {
  session: LanguageSession;
  onClick?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onClick }) => {
  const remainingAttendees = session.maxAttendees - session.totalAttendees;

  return (
    <TouchableOpacity style={styles.container} onPress={onClick} activeOpacity={0.8}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title} numberOfLines={1}>
            {session.title}
          </Text>
          <Text style={styles.date}>
            {session.date} • {session.time}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.percentage}>{String(session.joinedPercentage)}%</Text>
          <Text style={styles.percentageLabel}>Joined</Text>
        </View>
      </View>

      {/* Attendees */}
      <View style={styles.attendees}>
        <View style={styles.attendeeAvatars}>
          {session.attendees.slice(0, 4).map((avatar, index) => (
            <Image
              key={index}
              source={{ uri: avatar }}
              style={[styles.attendeeAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
            />
          ))}
          {remainingAttendees > 0 && (
            <View style={[styles.attendeeAvatar, styles.moreAttendees, { marginLeft: -8 }]}>
              <Text style={styles.moreText}>+{String(remainingAttendees)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.attendeeCount}>
          {String(session.totalAttendees)}/{String(session.maxAttendees)} attendees
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.language}>
            {session.languageFlag} {session.language}
          </Text>
          {session.location && (
            <View style={styles.location}>
              <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.locationText}>{session.location}</Text>
            </View>
          )}
        </View>
        {session.isVirtual && (
          <View style={styles.virtualBadge}>
            <Ionicons name="videocam" size={12} color={COLORS.primary} />
            <Text style={styles.virtualText}>Online</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  date: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  percentage: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  percentageLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  attendeeAvatars: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  attendeeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  moreAttendees: {
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.semibold,
  },
  attendeeCount: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flex: 1,
  },
  language: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  virtualBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  virtualText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default SessionCard;
