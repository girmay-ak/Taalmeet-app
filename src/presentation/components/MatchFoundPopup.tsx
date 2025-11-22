/**
 * Match Found Popup component
 *
 * Celebration popup shown when a language exchange match is found.
 * Displays both users' profiles, match details, and action buttons.
 *
 * @module presentation/components/MatchFoundPopup
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { Button } from './Button';
import { Confetti } from './Confetti';
import { Partner } from '@data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MatchFoundPopupProps {
  partner: Partner | null;
  onClose: () => void;
  onNavigateToChat?: (partnerId: string) => void;
  onNavigateToProfile?: (partnerId: string) => void;
}

export const MatchFoundPopup: React.FC<MatchFoundPopupProps> = ({
  partner,
  onClose,
  onNavigateToChat,
  onNavigateToProfile,
}) => {
  if (!partner) return null;

  // Current user data
  const currentUser = {
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
    languages: { learning: 'Dutch', teaching: 'English' },
  };

  const handleMessage = () => {
    onClose();
    if (onNavigateToChat) {
      onNavigateToChat(partner.id);
    }
  };

  const handleViewProfile = () => {
    onClose();
    if (onNavigateToProfile) {
      onNavigateToProfile(partner.id);
    }
  };

  // Animated values
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  const exchangeRotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 300 });
    sparkleRotation.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(-10, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    exchangeRotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withRepeat(withSequence(withTiming(1.2), withTiming(1)), -1, false) },
      { rotate: `${sparkleRotation.value}deg` },
    ],
  }));

  const exchangeStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${exchangeRotation.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (!partner) return null;

  return (
    <Modal visible={!!partner} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Confetti */}
        <Confetti active={true} duration={5000} />

        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Main Content */}
        <Animated.View style={[styles.container, containerStyle]}>
          {/* Title with Animation */}
          <View style={styles.titleSection}>
            <Animated.View style={[styles.sparkleIcon, sparkleStyle]}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.sparkleGradient}
              >
                <Ionicons name="sparkles" size={32} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.title}>Match Found!</Text>
            <Text style={styles.subtitle}>
              Someone nearby wants to practice{' '}
              {partner.learning?.language || partner.languages?.learning || 'languages'}
            </Text>
          </View>

          {/* Profile Cards with Exchange Icon */}
          <View style={styles.profilesSection}>
            {/* Current User Card */}
            <Animated.View
              style={[
                styles.profileCard,
                {
                  transform: [{ rotate: '-5deg' }],
                },
              ]}
            >
              <Image source={{ uri: currentUser.avatar }} style={styles.profileImage} />
              <View style={styles.profileNameBadgeContainer}>
                <View style={styles.profileNameBadge}>
                  <Text style={styles.profileNameText}>You</Text>
                </View>
              </View>
              <View style={styles.languageFlag}>
                <Text style={styles.flagEmoji}>{partner.teaching?.flag || '🇬🇧'}</Text>
              </View>
            </Animated.View>

            {/* Exchange Icon */}
            <View style={styles.exchangeContainer}>
              <View style={styles.greetingBadge}>
                <Text style={styles.greetingText}>¡Hola!</Text>
              </View>
              <Animated.View style={[styles.exchangeIcon, exchangeStyle]}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.exchangeGradient}
                >
                  <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
                </LinearGradient>
              </Animated.View>
              <View style={[styles.greetingBadge, styles.greetingBadgeBottom]}>
                <Text style={styles.greetingText}>Hello!</Text>
              </View>
            </View>

            {/* Matched Partner Card */}
            <Animated.View
              style={[
                styles.profileCard,
                {
                  transform: [{ rotate: '5deg' }],
                },
              ]}
            >
              <Image source={{ uri: partner.avatar }} style={styles.profileImage} />
              <View style={styles.profileNameBadgeContainer}>
                <View style={styles.profileNameBadge}>
                  <Text style={styles.profileNameText}>{partner.name.split(' ')[0]}</Text>
                </View>
              </View>
              <View style={[styles.languageFlag, styles.languageFlagRight]}>
                <Text style={styles.flagEmoji}>{partner.learning?.flag || '🇳🇱'}</Text>
              </View>
            </Animated.View>
          </View>

          {/* Match Details */}
          <View style={styles.detailsCard}>
            {/* Distance */}
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue}>
                  {String(partner.distance)} km away
                  {partner.location ? ` • ${partner.location}` : ''}
                </Text>
              </View>
            </View>

            {/* Languages */}
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: `${COLORS.secondary}20` }]}>
                <Ionicons name="language" size={20} color={COLORS.secondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Languages</Text>
                <Text style={styles.detailValue}>
                  Learning {partner.learning?.language || partner.languages?.learning || 'N/A'} •
                  Speaks {partner.teaching?.language || partner.languages?.native || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Match Score */}
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: `${COLORS.tertiary}20` }]}>
                <Ionicons name="sparkles" size={20} color={COLORS.tertiary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Match Score</Text>
                <Text style={styles.detailValue}>{String(partner.matchScore)}% compatible</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title="Send Message"
              onPress={handleMessage}
              variant="gradient"
              size="large"
              icon="chatbubble-ellipses"
              iconPosition="left"
              style={styles.messageButton}
            />
            <Button
              title="View Full Profile"
              onPress={handleViewProfile}
              variant="outline"
              size="large"
              style={styles.profileButton}
            />
            <TouchableOpacity onPress={onClose} style={styles.laterButton}>
              <Text style={styles.laterButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Glow Effect */}
        <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING['2xl'],
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  sparkleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: SPACING.md,
  },
  sparkleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  profilesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  profileCard: {
    width: 128,
    height: 160,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.xl,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profileNameBadgeContainer: {
    position: 'absolute',
    bottom: -12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  profileNameBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
  },
  profileNameText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.background,
  },
  languageFlag: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  languageFlagRight: {
    left: -8,
    right: 'auto',
    borderColor: COLORS.secondary,
  },
  flagEmoji: {
    fontSize: 24,
  },
  exchangeContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
    zIndex: 10,
  },
  greetingBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  greetingBadgeBottom: {
    backgroundColor: COLORS.secondary,
  },
  greetingText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  exchangeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  exchangeGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
    gap: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxs,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  actions: {
    width: '100%',
    gap: SPACING.md,
  },
  messageButton: {
    width: '100%',
  },
  profileButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  laterButton: {
    width: '100%',
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  laterButtonText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  glow: {
    position: 'absolute',
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    top: '50%',
    left: '50%',
    marginTop: -192,
    marginLeft: -192,
    zIndex: -1,
  },
});

export default MatchFoundPopup;
