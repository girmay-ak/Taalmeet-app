/**
 * Language Preferences Screen component
 *
 * Configure language discovery and matching preferences.
 *
 * @module presentation/screens/LanguagePreferencesScreen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface LanguagePreferencesScreenProps {
  onBack: () => void;
}

export const LanguagePreferencesScreen: React.FC<LanguagePreferencesScreenProps> = ({ onBack }) => {
  const [showOnlyMyLanguages, setShowOnlyMyLanguages] = useState(false);
  const [showNearby, setShowNearby] = useState(true);
  const [maxDistance, setMaxDistance] = useState(10);
  const [preferredLevels, setPreferredLevels] = useState({
    beginner: true,
    intermediate: true,
    advanced: true,
    native: true,
  });

  const levels = [
    { id: 'beginner', label: 'Beginner (A1-A2)' },
    { id: 'intermediate', label: 'Intermediate (B1-B2)' },
    { id: 'advanced', label: 'Advanced (C1-C2)' },
    { id: 'native', label: 'Native' },
  ];

  const toggleLevel = (levelId: string) => {
    setPreferredLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId as keyof typeof prev],
    }));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Language Preferences</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Discovery Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DISCOVERY</Text>
          <View style={styles.sectionCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Only My Languages</Text>
                  <Text style={styles.settingDescription}>Show partners for my languages only</Text>
                </View>
              </View>
              <Switch
                value={showOnlyMyLanguages}
                onValueChange={setShowOnlyMyLanguages}
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
                  <Text style={styles.settingLabel}>Show Nearby First</Text>
                  <Text style={styles.settingDescription}>Prioritize nearby partners</Text>
                </View>
              </View>
              <Switch
                value={showNearby}
                onValueChange={setShowNearby}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Distance Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DISTANCE</Text>
          <View style={styles.sectionCard}>
            <View style={styles.distanceSection}>
              <View style={styles.distanceHeader}>
                <View style={[styles.settingIcon, { backgroundColor: `${COLORS.tertiary}20` }]}>
                  <Ionicons name="people-outline" size={20} color={COLORS.tertiary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Maximum Distance</Text>
                  <Text style={styles.settingDescription}>
                    Show partners within {String(maxDistance)}km
                  </Text>
                </View>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${(maxDistance / 50) * 100}%` }]} />
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>1km</Text>
                  <Text style={styles.sliderLabel}>{String(maxDistance)}km</Text>
                  <Text style={styles.sliderLabel}>50km</Text>
                </View>
              </View>
              <View style={styles.distanceButtons}>
                {[5, 10, 20, 30, 50].map(distance => (
                  <TouchableOpacity
                    key={distance}
                    onPress={() => setMaxDistance(distance)}
                    style={[
                      styles.distanceButton,
                      maxDistance === distance && styles.distanceButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.distanceButtonText,
                        maxDistance === distance && styles.distanceButtonTextActive,
                      ]}
                    >
                      {String(distance)}km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Language Level Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERRED LEVELS</Text>
          <View style={styles.sectionCard}>
            <View style={styles.levelsSection}>
              <Text style={styles.levelsDescription}>
                Select which levels you'd like to practice with:
              </Text>
              <View style={styles.levelsList}>
                {levels.map(level => (
                  <TouchableOpacity
                    key={level.id}
                    onPress={() => toggleLevel(level.id)}
                    style={[
                      styles.levelItem,
                      preferredLevels[level.id as keyof typeof preferredLevels] &&
                        styles.levelItemActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        preferredLevels[level.id as keyof typeof preferredLevels] &&
                          styles.checkboxActive,
                      ]}
                    >
                      {preferredLevels[level.id as keyof typeof preferredLevels] && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.levelLabel,
                        preferredLevels[level.id as keyof typeof preferredLevels] &&
                          styles.levelLabelActive,
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.lg,
  },
  distanceSection: {
    padding: SPACING.lg,
  },
  distanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sliderContainer: {
    marginBottom: SPACING.md,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  distanceButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  distanceButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  distanceButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}20`,
  },
  distanceButtonText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  distanceButtonTextActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  levelsSection: {
    padding: SPACING.lg,
  },
  levelsDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  levelsList: {
    gap: SPACING.sm,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
  },
  levelItemActive: {
    backgroundColor: `${COLORS.primary}10`,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  levelLabel: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
  levelLabelActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default LanguagePreferencesScreen;
