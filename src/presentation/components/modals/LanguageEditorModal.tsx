/**
 * Language Editor Modal component
 * 
 * Modal for editing teaching or learning languages.
 * 
 * @module presentation/components/modals/LanguageEditorModal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { Button } from '../Button';

interface Language {
  name: string;
  flag: string;
  code: string;
}

const languages: Language[] = [
  { name: 'English', flag: '🇬🇧', code: 'en' },
  { name: 'Spanish', flag: '🇪🇸', code: 'es' },
  { name: 'French', flag: '🇫🇷', code: 'fr' },
  { name: 'German', flag: '🇩🇪', code: 'de' },
  { name: 'Italian', flag: '🇮🇹', code: 'it' },
  { name: 'Portuguese', flag: '🇵🇹', code: 'pt' },
  { name: 'Dutch', flag: '🇳🇱', code: 'nl' },
  { name: 'Russian', flag: '🇷🇺', code: 'ru' },
  { name: 'Chinese', flag: '🇨🇳', code: 'zh' },
  { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
  { name: 'Korean', flag: '🇰🇷', code: 'ko' },
  { name: 'Arabic', flag: '🇸🇦', code: 'ar' },
  { name: 'Hindi', flag: '🇮🇳', code: 'hi' },
  { name: 'Turkish', flag: '🇹🇷', code: 'tr' },
  { name: 'Polish', flag: '🇵🇱', code: 'pl' },
];

const levels = [
  'A1 - Beginner',
  'A2 - Elementary',
  'B1 - Intermediate',
  'B2 - Upper Intermediate',
  'C1 - Advanced',
  'C2 - Proficient',
  'Native',
];

interface LanguageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'teaching' | 'learning';
  currentLanguage: { language: string; level: string; flag: string };
  onSave: (data: { language: string; level: string; flag: string }) => void;
}

export const LanguageEditorModal: React.FC<LanguageEditorModalProps> = ({
  isOpen,
  onClose,
  type,
  currentLanguage,
  onSave,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    languages.find((l) => l.name === currentLanguage.language) || null
  );
  const [selectedLevel, setSelectedLevel] = useState(currentLanguage.level);

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (selectedLanguage) {
      onSave({
        language: selectedLanguage.name,
        level: selectedLevel,
        flag: selectedLanguage.flag,
      });
      onClose();
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {type === 'teaching' ? 'Teaching Language' : 'Learning Language'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Search */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search languages..."
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            {/* Language Selection */}
            <Text style={styles.sectionTitle}>Select Language</Text>
            <View style={styles.languageGrid}>
              {filteredLanguages.map((lang) => {
                const isSelected = selectedLanguage?.code === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => setSelectedLanguage(lang)}
                    style={[
                      styles.languageCard,
                      isSelected && styles.languageCardSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text
                      style={[
                        styles.languageName,
                        isSelected && styles.languageNameSelected,
                      ]}
                    >
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Level Selection */}
            {selectedLanguage && (
              <>
                <Text style={styles.sectionTitle}>Your Level</Text>
                <View style={styles.levelList}>
                  {levels.map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setSelectedLevel(level)}
                      style={[
                        styles.levelItem,
                        selectedLevel === level && styles.levelItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.levelText,
                          selectedLevel === level && styles.levelTextSelected,
                        ]}
                      >
                        {level}
                      </Text>
                      {selectedLevel === level && (
                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Save"
              onPress={handleSave}
              variant="primary"
              size="large"
              disabled={!selectedLanguage}
            />
          </View>
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
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.base,
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
    marginBottom: SPACING['2xl'],
  },
  languageCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.background,
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
  levelList: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  levelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  levelItemSelected: {
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
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default LanguageEditorModal;

