/**
 * Settings Screen component
 *
 * App settings including notifications, appearance, account, and about.
 *
 * @module presentation/screens/SettingsScreen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigateToBlockedUsers?: () => void;
  onNavigateToChangePassword?: () => void;
  onNavigateToLanguageSelection?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onNavigateToBlockedUsers,
  onNavigateToChangePassword,
  onNavigateToLanguageSelection,
}) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [colorTheme, setColorTheme] = useState<'green' | 'purple'>('green');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.sectionCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive app notifications</Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.secondary}20` }]}>
                  <Ionicons name="chatbubbles-outline" size={20} color={COLORS.secondary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>New Messages</Text>
                  <Text style={styles.settingDescription}>Get notified of new messages</Text>
                </View>
              </View>
              <Switch
                value={messageNotifications}
                onValueChange={setMessageNotifications}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.tertiary}20` }]}>
                  <Ionicons name="heart-outline" size={20} color={COLORS.tertiary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>New Matches</Text>
                  <Text style={styles.settingDescription}>Get notified of new matches</Text>
                </View>
              </View>
              <Switch
                value={matchNotifications}
                onValueChange={setMatchNotifications}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPEARANCE</Text>
          <View style={styles.sectionCard}>
            <View style={styles.colorThemeSection}>
              <View style={styles.colorThemeHeader}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Ionicons name="color-palette-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Color Theme</Text>
                  <Text style={styles.settingDescription}>Choose your app colors</Text>
                </View>
              </View>
              <View style={styles.colorThemeOptions}>
                <TouchableOpacity
                  onPress={() => setColorTheme('green')}
                  style={[
                    styles.colorThemeOption,
                    colorTheme === 'green' && styles.colorThemeOptionActive,
                  ]}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryLight]}
                    style={styles.colorThemePreview}
                  />
                  <View style={styles.colorThemeInfo}>
                    <Text style={styles.colorThemeName}>Green</Text>
                    <Text style={styles.colorThemeSubtext}>Teal & Mint</Text>
                  </View>
                  {colorTheme === 'green' && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setColorTheme('purple')}
                  style={[
                    styles.colorThemeOption,
                    colorTheme === 'purple' && styles.colorThemeOptionActive,
                  ]}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#EC4899']}
                    style={styles.colorThemePreview}
                  />
                  <View style={styles.colorThemeInfo}>
                    <Text style={styles.colorThemeName}>Purple</Text>
                    <Text style={styles.colorThemeSubtext}>Violet & Pink</Text>
                  </View>
                  {colorTheme === 'purple' && (
                    <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.warning}20` }]}>
                  <Ionicons name="moon-outline" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Use dark theme</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.info}20` }]}>
                  <Ionicons name="volume-high-outline" size={20} color={COLORS.info} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>Play sounds for actions</Text>
                </View>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity onPress={onNavigateToChangePassword} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.secondary}20` }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.secondary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Change Password</Text>
                  <Text style={styles.settingDescription}>Update your password</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity onPress={onNavigateToLanguageSelection} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Ionicons name="language-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Language</Text>
                  <Text style={styles.settingDescription}>English</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity onPress={onNavigateToBlockedUsers} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.tertiary}20` }]}>
                  <Ionicons name="eye-off-outline" size={20} color={COLORS.tertiary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Blocked Users</Text>
                  <Text style={styles.settingDescription}>Manage blocked users</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Version</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
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
  settingValue: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.lg,
  },
  colorThemeSection: {
    padding: SPACING.lg,
  },
  colorThemeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  colorThemeOptions: {
    gap: SPACING.md,
  },
  colorThemeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  colorThemeOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  colorThemePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  colorThemeInfo: {
    flex: 1,
  },
  colorThemeName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  colorThemeSubtext: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
});

export default SettingsScreen;
