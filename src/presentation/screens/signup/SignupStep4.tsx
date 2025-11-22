/**
 * Signup step 4 component
 * 
 * Profile completion with bio, interests, and avatar.
 * 
 * @module presentation/screens/signup/SignupStep4
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface SignupStep4Props {
  onNext: (data: { bio: string; interests: string[]; avatar?: string }) => void;
  onBack: () => void;
}

const INTERESTS = [
  '☕ Coffee',
  '🎵 Music',
  '✈️ Travel',
  '🎨 Art',
  '📚 Books',
  '🍕 Food',
  '⚽ Sports',
  '🎮 Gaming',
  '🎬 Movies',
  '📸 Photography',
  '🏃 Fitness',
  '🧘 Yoga',
  '🍷 Wine',
  '🎭 Theater',
  '🌿 Nature',
  '💻 Technology',
];

export const SignupStep4: React.FC<SignupStep4Props> = ({ onNext, onBack }) => {
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const MAX_BIO_LENGTH = 150;
  const canProceed =
    bio.trim() !== '' && selectedInterests.length > 0 && agreedToTerms;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length < 8) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  const handleAvatarClick = () => {
    // In real app, would open file picker
    setAvatar(
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop'
    );
  };

  const handleSubmit = () => {
    if (canProceed) {
      onNext({
        bio,
        interests: selectedInterests,
        avatar: avatar || undefined,
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
          <Text style={styles.stepIndicator}>4/4</Text>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.title}>Complete Profile ✨</Text>
          <Text style={styles.subtitle}>Almost there!</Text>

          {/* Avatar Upload */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handleAvatarClick} style={styles.avatarButton}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="camera-outline" size={40} color={COLORS.textMuted} />
                </View>
              )}
              <View style={styles.editAvatarBadge}>
                <Ionicons name="create-outline" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAvatarClick}>
              <Text style={styles.avatarLabel}>Add Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.label}>Bio</Text>
            <View style={styles.bioInputContainer}>
              <TextInput
                style={styles.bioInput}
                placeholder="Tell us about yourself..."
                placeholderTextColor={COLORS.textMuted}
                value={bio}
                onChangeText={setBio}
                multiline
                maxLength={MAX_BIO_LENGTH}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {bio.length}/{MAX_BIO_LENGTH}
              </Text>
            </View>
          </View>

          {/* Interests */}
          <View style={styles.interestsSection}>
            <Text style={styles.label}>
              Interests ({selectedInterests.length}/8)
            </Text>
            <View style={styles.interestsGrid}>
              {INTERESTS.map((interest, index) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleInterest(interest)}
                    style={[
                      styles.interestChip,
                      isSelected && styles.interestChipSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color="#FFFFFF"
                        style={styles.interestCheck}
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
          </View>

          {/* Terms */}
          <View style={styles.termsSection}>
            <Switch
              value={agreedToTerms}
              onValueChange={setAgreedToTerms}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <Button
            title="Create Account"
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  avatarButton: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  bioSection: {
    marginBottom: SPACING['2xl'],
  },
  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  bioInputContainer: {
    position: 'relative',
  },
  bioInput: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.base,
    minHeight: 100,
  },
  charCount: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.md,
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  interestsSection: {
    marginBottom: SPACING['2xl'],
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
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  interestChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  interestCheck: {
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
  termsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  termsText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});

export default SignupStep4;

