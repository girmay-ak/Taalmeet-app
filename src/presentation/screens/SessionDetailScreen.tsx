/**
 * Session Detail Screen component
 *
 * Detailed view of a language exchange session.
 *
 * @module presentation/screens/SessionDetailScreen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { Button } from '../components/Button';
import { LanguageSession } from '@data/mockSessions';

interface SessionDetailScreenProps {
  session: LanguageSession | null;
  onClose: () => void;
}

export const SessionDetailScreen: React.FC<SessionDetailScreenProps> = ({ session, onClose }) => {
  if (!session) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return { color: COLORS.success, bg: `${COLORS.success}20` };
      case 'intermediate':
        return { color: COLORS.warning, bg: `${COLORS.warning}20` };
      case 'advanced':
        return { color: COLORS.error, bg: `${COLORS.error}20` };
      default:
        return { color: COLORS.secondary, bg: `${COLORS.secondary}20` };
    }
  };

  const levelStyle = getLevelColor(session.level);
  const spotsLeft = session.maxAttendees - session.totalAttendees;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${session.language} language exchange session: ${session.title}`,
        title: session.title,
      });
    } catch (error) {
      // Share cancelled
    }
  };

  return (
    <Modal visible={!!session} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.container}>
          {/* Header Image/Banner */}
          <View style={styles.headerImage}>
            {session.venue?.photos?.[0] ? (
              <Image source={{ uri: session.venue.photos[0] }} style={styles.headerImageContent} />
            ) : (
              <View style={styles.headerImagePlaceholder}>
                <Text style={styles.headerFlag}>{session.languageFlag}</Text>
              </View>
            )}

            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity onPress={onClose} style={styles.topBarButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.topBarButton}>
                <Ionicons name="share-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* External Source Badge */}
            {session.externalSource === 'evento' && (
              <View style={styles.externalBadge}>
                <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                <Text style={styles.externalBadgeText}>Via Evento</Text>
              </View>
            )}
          </View>

          {/* Scrollable Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.contentInner}>
              {/* Title & Language */}
              <View style={styles.titleSection}>
                <View style={styles.titleRow}>
                  <Text style={styles.languageFlag}>{session.languageFlag}</Text>
                  <View style={[styles.levelBadge, { backgroundColor: levelStyle.bg }]}>
                    <Text style={[styles.levelText, { color: levelStyle.color }]}>
                      {session.level.charAt(0).toUpperCase() + session.level.slice(1)}
                    </Text>
                  </View>
                  {session.isVirtual && (
                    <View style={styles.virtualBadge}>
                      <Text style={styles.virtualText}>Virtual</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.title}>{session.title}</Text>
                <Text style={styles.description}>{session.description}</Text>
              </View>

              {/* Quick Info Cards */}
              <View style={styles.infoGrid}>
                <View style={styles.infoCard}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>{session.date}</Text>
                  <Text style={styles.infoSubtext}>{session.time}</Text>
                </View>

                <View style={styles.infoCard}>
                  <Ionicons name="time-outline" size={16} color={COLORS.secondary} />
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{String(session.duration)} min</Text>
                  <Text style={styles.infoSubtext}>
                    {Math.floor(session.duration / 60)}h {session.duration % 60}m
                  </Text>
                </View>
              </View>

              {/* Location/Meeting Link */}
              <View style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  {session.isVirtual ? (
                    <View style={styles.locationIcon}>
                      <Ionicons name="videocam" size={20} color="#A855F7" />
                    </View>
                  ) : (
                    <View style={styles.locationIcon}>
                      <Ionicons name="location" size={20} color={COLORS.primary} />
                    </View>
                  )}
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationLabel}>
                      {session.isVirtual ? 'Meeting Link' : 'Location'}
                    </Text>
                    <Text style={styles.locationValue}>{session.location}</Text>
                    {session.venue && (
                      <Text style={styles.locationAddress}>
                        {session.venue.address}, {session.venue.city}
                      </Text>
                    )}
                  </View>
                  {session.isVirtual && session.isUserJoined && (
                    <TouchableOpacity style={styles.joinButton}>
                      <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Venue Amenities */}
                {session.venue?.amenities && session.venue.amenities.length > 0 && (
                  <View style={styles.amenities}>
                    {session.venue.amenities.map((amenity, index) => (
                      <View key={index} style={styles.amenityTag}>
                        <Text style={styles.amenityText}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Organizer Card */}
              <View style={styles.organizerCard}>
                <Text style={styles.organizerLabel}>
                  {session.organizer.type === 'business' ? 'Organized by' : 'Hosted by'}
                </Text>
                <View style={styles.organizerContent}>
                  <Image
                    source={{ uri: session.organizer.avatar }}
                    style={styles.organizerAvatar}
                  />
                  <View style={styles.organizerInfo}>
                    <View style={styles.organizerNameRow}>
                      <Text style={styles.organizerName}>{session.organizer.name}</Text>
                      {session.organizer.verified && (
                        <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                      )}
                    </View>
                    {session.organizer.type === 'business' ? (
                      <View style={styles.organizerMeta}>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={14} color={COLORS.warning} />
                          <Text style={styles.organizerMetaText}>
                            {String(session.organizer.rating)}
                          </Text>
                        </View>
                        <Text style={styles.organizerMetaText}>
                          {String(session.organizer.totalEvents)} events
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.organizerMetaText}>
                        {String(session.organizer.hostingCount)} sessions hosted
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity style={styles.viewOrganizerButton}>
                    <Text style={styles.viewOrganizerText}>View</Text>
                  </TouchableOpacity>
                </View>
                {session.organizer.bio && (
                  <Text style={styles.organizerBio}>{session.organizer.bio}</Text>
                )}
              </View>

              {/* Attendees */}
              <View style={styles.attendeesCard}>
                <View style={styles.attendeesHeader}>
                  <View style={styles.attendeesTitleRow}>
                    <Ionicons name="people" size={16} color={COLORS.secondary} />
                    <Text style={styles.attendeesTitle}>
                      {String(session.totalAttendees)} / {String(session.maxAttendees)} Attendees
                    </Text>
                  </View>
                  {spotsLeft > 0 && (
                    <Text style={styles.spotsLeft}>{String(spotsLeft)} spots left</Text>
                  )}
                </View>

                <View style={styles.attendeesAvatars}>
                  {session.attendees.slice(0, 8).map((avatar, index) => (
                    <Image key={index} source={{ uri: avatar }} style={styles.attendeeAvatar} />
                  ))}
                  {session.totalAttendees - session.attendees.length > 0 && (
                    <View style={styles.moreAttendees}>
                      <Text style={styles.moreAttendeesText}>
                        +{String(session.totalAttendees - session.attendees.length)}
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={styles.viewAllAttendees}>
                  <Ionicons name="people" size={16} color={COLORS.textPrimary} />
                  <Text style={styles.viewAllAttendeesText}>View All Attendees</Text>
                </TouchableOpacity>
              </View>

              {/* Tags */}
              {session.tags && session.tags.length > 0 && (
                <View style={styles.tagsSection}>
                  <Text style={styles.tagsLabel}>Tags</Text>
                  <View style={styles.tags}>
                    {session.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Price */}
              <View style={styles.priceCard}>
                <View style={styles.priceContent}>
                  <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>
                      {session.price === 0
                        ? 'Free'
                        : `${session.currency} ${String(session.price)}`}
                    </Text>
                  </View>
                  {session.price === 0 && (
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeBadgeText}>Free Event</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <Button
                  title={session.isUserJoined ? 'Joined ✓' : 'Join Session'}
                  onPress={() => {}}
                  variant="primary"
                  size="large"
                  style={styles.joinButtonLarge}
                />
                <TouchableOpacity style={styles.messageButton}>
                  <Ionicons name="chatbubble-outline" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    overflow: 'hidden',
  },
  headerImage: {
    height: 192,
    backgroundColor: `${COLORS.primary}20`,
    position: 'relative',
  },
  headerImageContent: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  headerImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerFlag: {
    fontSize: 96,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  externalBadge: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: `${COLORS.primary}90`,
  },
  externalBadgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: SPACING['2xl'],
    gap: SPACING.lg,
  },
  titleSection: {
    gap: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  languageFlag: {
    fontSize: 24,
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  levelText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  virtualBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: '#A855F710',
  },
  virtualText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#A855F7',
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  infoSubtext: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  locationCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  locationValue: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  locationAddress: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  joinButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  joinButtonText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  amenityTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
  },
  amenityText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  organizerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  organizerLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  organizerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  organizerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  organizerName: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  organizerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  organizerMetaText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  viewOrganizerButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewOrganizerText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  organizerBio: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    lineHeight: 18,
  },
  attendeesCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  attendeesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  attendeesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  attendeesTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  spotsLeft: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.primary,
  },
  attendeesAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  attendeeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.background,
    marginLeft: -8,
  },
  moreAttendees: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.background,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  moreAttendeesText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  viewAllAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewAllAttendeesText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  tagsSection: {
    gap: SPACING.sm,
  },
  tagsLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textPrimary,
  },
  priceCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
    backgroundColor: `${COLORS.primary}10`,
    padding: SPACING.lg,
  },
  priceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  priceValue: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  freeBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  freeBadgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingBottom: SPACING['2xl'],
  },
  joinButtonLarge: {
    flex: 1,
  },
  messageButton: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SessionDetailScreen;
