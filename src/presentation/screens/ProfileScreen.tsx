/**
 * Profile screen component
 * 
 * User's own profile with stats, settings, and gamification.
 * 
 * @module presentation/screens/ProfileScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { LanguageEditorModal } from '../components/modals/LanguageEditorModal';
import { InterestsEditorModal } from '../components/modals/InterestsEditorModal';
import { PremiumUpgradeModal } from '../components/modals/PremiumUpgradeModal';
import { LogoutConfirmationModal } from '../components/modals/LogoutConfirmationModal';

interface ProfileScreenProps {
  onNavigateToSettings?: () => void;
  onNavigateToLanguagePreferences?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToHelp?: () => void;
  onLogout?: () => void;
  onNavigateToVerification?: () => void;
  onNavigateToGamification?: () => void;
}

const currentUser = {
  name: 'Sarah Chen',
  age: 28,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  location: 'Den Haag, Netherlands',
  verified: false,
  premium: false,
  connectionCount: 24,
  exchangeCount: 18,
  rating: 4.8,
  teaching: { language: 'English', level: 'Native', flag: '🇬🇧' },
  learning: { language: 'Spanish', level: 'B2 - Upper Intermediate', flag: '🇪🇸' },
  interests: ['Coffee', 'Travel', 'Music', 'Photography'],
  bio: 'Language enthusiast passionate about connecting with people from around the world. Love coffee, travel, and deep conversations!',
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateToSettings,
  onNavigateToLanguagePreferences,
  onNavigateToPrivacy,
  onNavigateToHelp,
  onLogout,
  onNavigateToVerification,
  onNavigateToGamification,
}) => {
  const [user, setUser] = useState(currentUser);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLanguageEditor, setShowLanguageEditor] = useState(false);
  const [languageEditType, setLanguageEditType] = useState<'teaching' | 'learning'>('teaching');
  const [showInterestsEditor, setShowInterestsEditor] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${user.name}'s language exchange profile on TaalMeet!`,
        title: 'TaalMeet Profile',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share profile');
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = (data: any) => {
    setUser({ ...user, ...data });
  };

  const handleEditLanguage = (type: 'teaching' | 'learning') => {
    setLanguageEditType(type);
    setShowLanguageEditor(true);
  };

  const handleSaveLanguage = (data: any) => {
    if (languageEditType === 'teaching') {
      setUser({ ...user, teaching: data });
    } else {
      setUser({ ...user, learning: data });
    }
  };

  const handleSaveInterests = (interests: string[]) => {
    setUser({ ...user, interests });
  };

  const handleUpgrade = (planId: string) => {
    console.log('Upgrading to:', planId);
    setUser({ ...user, premium: true });
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) onLogout();
  };

  const getLanguageProgress = (level: string) => {
    if (level.includes('Native')) return 100;
    if (level.includes('C2')) return 95;
    if (level.includes('C1')) return 85;
    if (level.includes('B2')) return 70;
    if (level.includes('B1')) return 60;
    if (level.includes('A2')) return 40;
    if (level.includes('A1')) return 20;
    return 50;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={onNavigateToSettings} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
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
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="create-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Name & Badges */}
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {user.name}, {user.age}
              </Text>
              {user.verified && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.secondary} />
              )}
            </View>

            {/* Location */}
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.locationText}>{user.location}</Text>
            </View>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{String(user.connectionCount)}</Text>
                <Text style={styles.statLabel}>Connections</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{String(user.exchangeCount)}</Text>
                <Text style={styles.statLabel}>Exchanges</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={20} color={COLORS.warning} />
                  <Text style={styles.statValue}>{String(user.rating)}</Text>
                </View>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  style={styles.editButtonGradient}
                >
                  <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                <Ionicons name="share-outline" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Gamification Stats Card */}
        {onNavigateToGamification && (
          <TouchableOpacity
            onPress={onNavigateToGamification}
            style={styles.gamificationCard}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight, COLORS.secondary]}
              style={styles.gamificationGradient}
            >
              <View style={styles.gamificationHeader}>
                <View style={styles.gamificationTitleRow}>
                  <Ionicons name="trophy" size={24} color="#FFFFFF" />
                  <Text style={styles.gamificationTitle}>Your Progress</Text>
                </View>
                <Ionicons name="trending-up" size={20} color="#FFFFFF" />
              </View>

              <View style={styles.gamificationStats}>
                <View style={styles.gamificationStatItem}>
                  <View style={styles.gamificationStatHeader}>
                    <Ionicons name="flash" size={16} color="#FFFFFF" />
                    <Text style={styles.gamificationStatLabel}>Level</Text>
                  </View>
                  <Text style={styles.gamificationStatValue}>12 🏆</Text>
                  <Text style={styles.gamificationStatSubtext}>3,420 / 4,000 XP</Text>
                </View>

                <View style={styles.gamificationStatItem}>
                  <View style={styles.gamificationStatHeader}>
                    <Ionicons name="flame" size={16} color="#FFFFFF" />
                    <Text style={styles.gamificationStatLabel}>Streak</Text>
                  </View>
                  <Text style={styles.gamificationStatValue}>23 days</Text>
                  <Text style={styles.gamificationStatSubtext}>🔥 On fire!</Text>
                </View>
              </View>

              <View style={styles.viewMoreCard}>
                <View>
                  <Text style={styles.viewMoreTitle}>View Full Stats</Text>
                  <Text style={styles.viewMoreSubtitle}>
                    Achievements, Challenges & More
                  </Text>
                </View>
                <View style={styles.viewMoreIcon}>
                  <Text style={styles.viewMoreArrow}>›</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Verification Banner */}
        {!user.verified && onNavigateToVerification && (
          <TouchableOpacity
            onPress={onNavigateToVerification}
            style={styles.verificationBanner}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              style={styles.verificationGradient}
            >
              <View style={styles.verificationIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.verificationContent}>
                <Text style={styles.verificationTitle}>Verify Your Profile</Text>
                <Text style={styles.verificationSubtitle}>
                  Get verified badge and build trust with partners
                </Text>
              </View>
              <TouchableOpacity style={styles.verifyButton}>
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Premium Banner */}
        {!user.premium && (
          <View style={styles.premiumBanner}>
            <LinearGradient
              colors={['#E91E8C', '#C71976']}
              style={styles.premiumGradient}
            >
              <View style={styles.premiumContent}>
                <View style={styles.premiumIcon}>
                  <Ionicons name="diamond" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.premiumText}>
                  <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                  <Text style={styles.premiumSubtitle}>
                    Unlock exclusive features and stand out
                  </Text>
                </View>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => setShowPremiumModal(true)}
              >
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Languages Section */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <TouchableOpacity onPress={() => handleEditLanguage('teaching')}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.languageItem}>
              <Text style={styles.languageLabel}>Teaching</Text>
              <View style={styles.languageCard}>
                <Text style={styles.languageFlag}>{user.teaching.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{user.teaching.language}</Text>
                  <Text style={styles.languageLevel}>{user.teaching.level}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[COLORS.secondary, COLORS.primaryLight]}
                      style={[
                        styles.progressBarFill,
                        { width: `${getLanguageProgress(user.teaching.level)}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.languageItem}>
              <Text style={styles.languageLabel}>Learning</Text>
              <View style={styles.languageCard}>
                <Text style={styles.languageFlag}>{user.learning.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{user.learning.language}</Text>
                  <Text style={styles.languageLevel}>{user.learning.level}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[COLORS.primaryLight, COLORS.secondary]}
                      style={[
                        styles.progressBarFill,
                        { width: `${getLanguageProgress(user.learning.level)}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About</Text>
              <TouchableOpacity onPress={handleEditProfile}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <TouchableOpacity onPress={() => setShowInterestsEditor(true)}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.interests}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Availability Section */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            {isAvailable && (
              <View style={styles.availabilityStatus}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>Available now</Text>
              </View>
            )}
            <View style={styles.availabilitySchedule}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.availabilityScheduleText}>
                Usually available: Evenings & Weekends
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              onPress={onNavigateToSettings}
              style={styles.menuItem}
            >
              <Ionicons name="settings-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuItemText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              onPress={onNavigateToLanguagePreferences}
              style={styles.menuItem}
            >
              <Ionicons name="language-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuItemText}>Language Preferences</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity onPress={onNavigateToPrivacy} style={styles.menuItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuItemText}>Privacy & Safety</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity onPress={onNavigateToHelp} style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuItemText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              onPress={() => setShowLogoutModal(true)}
              style={styles.menuItem}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentData={user}
        onSave={handleSaveProfile}
      />
      <LanguageEditorModal
        isOpen={showLanguageEditor}
        onClose={() => setShowLanguageEditor(false)}
        type={languageEditType}
        currentLanguage={
          languageEditType === 'teaching' ? user.teaching : user.learning
        }
        onSave={handleSaveLanguage}
      />
      <InterestsEditorModal
        isOpen={showInterestsEditor}
        onClose={() => setShowInterestsEditor(false)}
        currentInterests={user.interests}
        onSave={handleSaveInterests}
      />
      <PremiumUpgradeModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={handleUpgrade}
      />
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
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
  headerTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  settingsButton: {
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
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: SPACING.lg,
  },
  locationText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING['2xl'],
    marginBottom: SPACING.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  editButton: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  editButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamificationCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
  },
  gamificationGradient: {
    padding: SPACING.lg,
  },
  gamificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  gamificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  gamificationTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  gamificationStats: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  gamificationStatItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
  },
  gamificationStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  gamificationStatLabel: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  gamificationStatValue: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  gamificationStatSubtext: {
    fontSize: TYPOGRAPHY.xs,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  viewMoreCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  viewMoreTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  viewMoreSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  viewMoreIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewMoreArrow: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  verificationBanner: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  verificationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  verificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationContent: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  verificationSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  verifyButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
  },
  verifyButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.primary,
  },
  premiumBanner: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  editLink: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.secondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  upgradeButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
  },
  upgradeButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: '#E91E8C',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
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
  progressBarContainer: {
    width: 80,
    alignItems: 'flex-end',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: RADIUS.sm,
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
  bio: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    lineHeight: 22,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  menuItemText: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
  logoutText: {
    color: COLORS.error,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  availabilityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  availabilityText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.secondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  availabilitySchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  availabilityScheduleText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
});

export default ProfileScreen;

