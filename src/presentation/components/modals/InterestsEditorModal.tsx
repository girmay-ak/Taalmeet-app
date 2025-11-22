/**
 * Interests Editor Modal component
 * 
 * Modal for editing user interests.
 * 
 * @module presentation/components/modals/InterestsEditorModal
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

const availableInterests = [
  'Coffee',
  'Travel',
  'Music',
  'Hiking',
  'Photography',
  'Art',
  'Cooking',
  'Literature',
  'Yoga',
  'Wine',
  'Movies',
  'Gaming',
  'Sports',
  'Dancing',
  'Reading',
  'Technology',
  'Fashion',
  'Fitness',
  'Nature',
  'Meditation',
  'Food',
  'Culture',
  'History',
  'Science',
  'Business',
  'Volunteering',
];

interface InterestsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInterests: string[];
  onSave: (interests: string[]) => void;
}

export const InterestsEditorModal: React.FC<InterestsEditorModalProps> = ({
  isOpen,
  onClose,
  currentInterests,
  onSave,
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentInterests);
  const [customInterest, setCustomInterest] = useState('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 10) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const addCustomInterest = () => {
    if (
      customInterest.trim() &&
      !selectedInterests.includes(customInterest.trim()) &&
      selectedInterests.length < 10
    ) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const handleSave = () => {
    onSave(selectedInterests);
    onClose();
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
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Edit Interests</Text>
              <Text style={styles.headerSubtitle}>
                Select up to 10 interests ({selectedInterests.length}/10)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Add Custom Interest */}
            <View style={styles.customSection}>
              <Text style={styles.label}>Add Custom Interest</Text>
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  value={customInterest}
                  onChangeText={setCustomInterest}
                  placeholder="Type your interest..."
                  placeholderTextColor={COLORS.textMuted}
                  maxLength={20}
                  onSubmitEditing={addCustomInterest}
                />
                <TouchableOpacity
                  onPress={addCustomInterest}
                  style={styles.addButton}
                  disabled={!customInterest.trim() || selectedInterests.length >= 10}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={
                      customInterest.trim() && selectedInterests.length < 10
                        ? COLORS.primary
                        : COLORS.textMuted
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Interests Grid */}
            <Text style={styles.sectionTitle}>Select Interests</Text>
            <View style={styles.interestsGrid}>
              {availableInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleInterest(interest)}
                    style={[
                      styles.interestChip,
                      isSelected && styles.interestChipSelected,
                    ]}
                    disabled={!isSelected && selectedInterests.length >= 10}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color="#FFFFFF"
                        style={styles.checkIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.interestText,
                        isSelected && styles.interestTextSelected,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Save Interests"
              onPress={handleSave}
              variant="primary"
              size="large"
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
    alignItems: 'flex-start',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
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
  customSection: {
    marginBottom: SPACING['2xl'],
  },
  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  customInput: {
    flex: 1,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.base,
  },
  addButton: {
    padding: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  interestChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkIcon: {
    marginRight: SPACING.xs,
  },
  interestText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  interestTextSelected: {
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHT.medium,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default InterestsEditorModal;

