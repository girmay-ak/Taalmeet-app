/**
 * Privacy & Safety Screen component
 * 
 * Manage privacy settings and safety features.
 * 
 * @module presentation/screens/PrivacySafetyScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface PrivacySafetyScreenProps {
  onBack: () => void;
  onNavigateToBlockedUsers?: () => void;
  onNavigateToReportIssue?: () => void;
}

export const PrivacySafetyScreen: React.FC<PrivacySafetyScreenProps> = ({
  onBack,
  onNavigateToBlockedUsers,
  onNavigateToReportIssue,
}) => {
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showLastActive, setShowLastActive] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  const handleDownloadData = () => {
    Alert.alert('Download Data', 'Your data export will be sent to your email.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Safety</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Privacy Banner */}
        <View style={styles.section}>
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <Ionicons name="shield-checkmark" size={24} color={COLORS.secondary} />
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Your Safety Matters</Text>
              <Text style={styles.bannerDescription}>
                Control who sees your information and how others can interact with you.
              </Text>
            </View>
          </View>
        </View>

        {/* Visibility Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFILE VISIBILITY</Text>
          <View style={styles.sectionCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Show Online Status</Text>
                  <Text style={styles.settingDescription}>
                    Let others see when you're online
                  </Text>
                </View>
              </View>
              <Switch
                value={showOnlineStatus}
                onValueChange={setShowOnlineStatus}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.secondary}20` }]}>
                  <Ionicons name="location-outline" size={20} color={COLORS.secondary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Show Distance</Text>
                  <Text style={styles.settingDescription}>
                    Display your approximate distance
                  </Text>
                </View>
              </View>
              <Switch
                value={showDistance}
                onValueChange={setShowDistance}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.tertiary}20` }]}>
                  <Ionicons name="time-outline" size={20} color={COLORS.tertiary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Show Last Active</Text>
                  <Text style={styles.settingDescription}>
                    Display when you were last active
                  </Text>
                </View>
              </View>
              <Switch
                value={showLastActive}
                onValueChange={setShowLastActive}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Messaging Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MESSAGING</Text>
          <View style={styles.sectionCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.warning}20` }]}>
                  <Ionicons name="checkmark-done-outline" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Read Receipts</Text>
                  <Text style={styles.settingDescription}>
                    Show when you've read messages
                  </Text>
                </View>
              </View>
              <Switch
                value={readReceipts}
                onValueChange={setReadReceipts}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Block & Report */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SAFETY ACTIONS</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              onPress={onNavigateToBlockedUsers}
              style={styles.settingItem}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.error}20` }]}>
                  <Ionicons name="ban-outline" size={20} color={COLORS.error} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Blocked Users</Text>
                  <Text style={styles.settingDescription}>Manage blocked accounts</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={onNavigateToReportIssue}
              style={styles.settingItem}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.warning}20` }]}>
                  <Ionicons name="alert-circle-outline" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Report an Issue</Text>
                  <Text style={styles.settingDescription}>
                    Report inappropriate behavior
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data & Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA & ACCOUNT</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity onPress={handleDownloadData} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.secondary}20` }]}>
                  <Ionicons name="download-outline" size={20} color={COLORS.secondary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Download My Data</Text>
                  <Text style={styles.settingDescription}>Request a copy of your data</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity onPress={handleDeleteAccount} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.error}20` }]}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, styles.dangerText]}>Delete Account</Text>
                  <Text style={styles.settingDescription}>
                    Permanently delete your account
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
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
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.lg,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: `${COLORS.secondary}30`,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  bannerDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  dangerText: {
    color: COLORS.error,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.lg,
  },
});

export default PrivacySafetyScreen;

