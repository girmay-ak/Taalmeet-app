/**
 * Signup step 2 component
 *
 * Language selection (teaching and learning).
 *
 * @module presentation/screens/signup/SignupStep2
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/Button';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface SignupStep2Props {
  onNext: (data: { learning: Language[]; teaching: Language & { level: string } }) => void;
  onBack: () => void;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
];

const LEVELS = [
  { id: 'native', label: 'Native', color: COLORS.warning },
  { id: 'advanced', label: 'Advanced (C1-C2)', color: COLORS.info },
  { id: 'intermediate', label: 'Intermediate (B1-B2)', color: COLORS.success },
  { id: 'beginner', label: 'Beginner (A1-A2)', color: COLORS.textMuted },
];

export const SignupStep2: React.FC<SignupStep2Props> = ({ onNext, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [learningLanguages, setLearningLanguages] = useState<Language[]>([]);
  const [teachingLanguage, setTeachingLanguage] = useState<Language | null>(null);
  const [teachingLevel, setTeachingLevel] = useState('native');

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLearning = (lang: Language) => {
    if (learningLanguages.find(l => l.code === lang.code)) {
      setLearningLanguages(learningLanguages.filter(l => l.code !== lang.code));
    } else {
      setLearningLanguages([...learningLanguages, lang]);
    }
  };

  const canProceed = learningLanguages.length > 0 && teachingLanguage && teachingLevel;

  const handleSubmit = () => {
    if (canProceed && teachingLanguage) {
      onNext({
        learning: learningLanguages,
        teaching: { ...teachingLanguage, level: teachingLevel },
      });
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>2/4</Text>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.title}>Your Languages 🌍</Text>
          <Text style={styles.subtitle}>What brings you here?</Text>

          {/* I want to learn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I want to learn</Text>
            <View style={styles.languageGrid}>
              {filteredLanguages.map(lang => {
                const isSelected = learningLanguages.find(l => l.code === lang.code);
                return (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => toggleLearning(lang)}
                    style={[styles.languageCard, isSelected && styles.languageCardSelected]}
                  >
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* I can teach */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I can teach</Text>
            <View style={styles.languageGrid}>
              {filteredLanguages.map(lang => {
                const isSelected = teachingLanguage?.code === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => setTeachingLanguage(lang)}
                    style={[styles.languageCard, isSelected && styles.languageCardSelected]}
                  >
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {teachingLanguage && (
              <View style={styles.levelSection}>
                <Text style={styles.levelTitle}>Your level in {teachingLanguage.name}</Text>
                <View style={styles.levelGrid}>
                  {LEVELS.map(level => (
                    <TouchableOpacity
                      key={level.id}
                      onPress={() => setTeachingLevel(level.id)}
                      style={[
                        styles.levelCard,
                        teachingLevel === level.id && styles.levelCardSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.levelText,
                          teachingLevel === level.id && styles.levelTextSelected,
                        ]}
                      >
                        {level.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          <Button
            title="Next →"
            onPress={handleSubmit}
            disabled={!canProceed}
            variant="primary"
            size="large"
            style={styles.submitButton}
          />
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.sm,
  },
  stepIndicator: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: SPACING['2xl'],
  },
  title: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    marginBottom: SPACING['2xl'],
  },
  section: {
    marginBottom: SPACING['2xl'],
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  languageCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  languageCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}15`,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  languageName: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  languageNameSelected: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  levelSection: {
    marginTop: SPACING.lg,
  },
  levelTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  levelGrid: {
    gap: SPACING.sm,
  },
  levelCard: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  levelCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}15`,
  },
  levelText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
  },
  levelTextSelected: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  submitButton: {
    marginTop: SPACING['2xl'],
  },
});

export default SignupStep2;
