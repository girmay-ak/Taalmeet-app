/**
 * Partner profile screen component
 * 
 * Displays detailed partner profile with stats, languages, interests, and actions.
 * 
 * @module presentation/screens/PartnerProfileScreen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { mockPartners } from '@data/mockData';

interface PartnerProfileScreenProps {
  partnerId: string;
  onBack: () => void;
  onMessage: () => void;
}

export const PartnerProfileScreen: React.FC<PartnerProfileScreenProps> = ({
  partnerId,
  onBack,
  onMessage,
}) => {
  const partner = mockPartners.find(p => p.id === partnerId) || mockPartners[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${partner.name} on TaalMeet! ${partner.teaching.language} native speaker looking to learn ${partner.learning.language}. ${partner.distance}km away.`,
        title: `${partner.name} - TaalMeet`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share profile');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={[COLORS.card, COLORS.background]}
          style={styles.profileHeader}
        >
          <View style={styles.profileContent}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: partner.avatar }}
                style={styles.avatar}
              />
              {partner.isOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>

            {/* Name & Badges */}
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {partner.name}, {partner.age}
              </Text>
              {partner.verified && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.secondary} />
              )}
              {partner.premium && (
                <Ionicons name="diamond" size={24} color={COLORS.warning} />
              )}
            </View>

            {/* Location & Status */}
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.locationText}>{partner.location}</Text>
              <Text style={styles.locationText}>•</Text>
              <Text style={styles.locationText}>{partner.distance} km away</Text>
            </View>

            {partner.availableNow && (
              <View style={styles.availableRow}>
                <View style={styles.availableDot} />
                <Text style={styles.availableText}>Available now</Text>
              </View>
            )}

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <View style={styles.statRow}>
                  <Ionicons name="star" size={20} color={COLORS.warning} />
                  <Text style={styles.statValue}>{String(partner.rating)}</Text>
                </View>
                <Text style={styles.statLabel}>{partner.reviewCount} reviews</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{String(partner.exchangeCount)}</Text>
                <Text style={styles.statLabel}>Exchanges</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.matchValue]}>
                  {partner.matchScore}%
                </Text>
                <Text style={styles.statLabel}>Match</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={onMessage}
                style={styles.chatButton}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  style={styles.chatButtonGradient}
                >
                  <Ionicons name="chatbubbles-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.chatButtonText}>Chat Now</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.likeButton}>
                <Ionicons name="heart-outline" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.videoButton}>
              <Ionicons name="videocam-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.videoButtonText}>Video Call</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{partner.bio}</Text>
          </View>
        </View>

        {/* Languages Section */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Languages</Text>

            {/* Teaching */}
            <View style={styles.languageItem}>
              <Text style={styles.languageLabel}>Teaching</Text>
              <View style={styles.languageCard}>
                <Text style={styles.languageFlag}>{partner.teaching.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{partner.teaching.language}</Text>
                  <Text style={styles.languageLevel}>{partner.teaching.level}</Text>
                </View>
              </View>
            </View>

            {/* Learning */}
            <View style={styles.languageItem}>
              <Text style={styles.languageLabel}>Learning</Text>
              <View style={styles.languageCard}>
                <Text style={styles.languageFlag}>{partner.learning.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{partner.learning.language}</Text>
                  <Text style={styles.languageLevel}>{partner.learning.level}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Interests Section */}
        {partner.interests && partner.interests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.interests}>
                {partner.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  headerButton: {
    padding: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING['5xl'],
    paddingHorizontal: SPACING.lg,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: COLORS.border,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  locationText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  availableText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.accent,
    fontWeight: FONT_WEIGHT.medium,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING['2xl'],
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  matchValue: {
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
    marginBottom: SPACING.sm,
  },
  chatButton: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  chatButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  chatButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  videoButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  bio: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  languageItem: {
    marginBottom: SPACING.lg,
  },
  languageLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
  },
  languageFlag: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  languageLevel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  interestTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  interestText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
});

export default PartnerProfileScreen;

