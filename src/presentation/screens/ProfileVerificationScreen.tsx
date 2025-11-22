/**
 * Profile Verification Screen component
 *
 * Multi-step verification flow for profile verification.
 *
 * @module presentation/screens/ProfileVerificationScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { Button } from '../components/Button';
import { Confetti } from '../components/Confetti';

type VerificationStep = 'intro' | 'upload-id' | 'selfie' | 'processing' | 'success';
type DocumentType = 'passport' | 'id-card' | 'drivers-license' | null;

interface ProfileVerificationScreenProps {
  onVerified: () => void;
  onBack: () => void;
}

interface UploadedFile {
  type: 'document' | 'selfie';
  preview: string;
  name: string;
}

export const ProfileVerificationScreen: React.FC<ProfileVerificationScreenProps> = ({
  onVerified,
  onBack,
}) => {
  const [step, setStep] = useState<VerificationStep>('intro');
  const [documentType, setDocumentType] = useState<DocumentType>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleFileUpload = (type: 'document' | 'selfie') => {
    // In a real app, use expo-image-picker
    // For now, use placeholder
    const placeholderImage =
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop';
    setUploadedFiles([
      ...uploadedFiles.filter(f => f.type !== type),
      {
        type,
        preview: placeholderImage,
        name: type === 'document' ? 'id-document.jpg' : 'selfie.jpg',
      },
    ]);
    Alert.alert('Image Selected', 'Image picker would open here in production.');
  };

  const removeFile = (type: 'document' | 'selfie') => {
    setUploadedFiles(uploadedFiles.filter(f => f.type !== type));
  };

  const handleSubmitVerification = () => {
    setStep('processing');
    // Simulate verification processing
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const renderIntro = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.introContent}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.iconGradient}
          >
            <Ionicons name="shield-checkmark" size={48} color="#FFFFFF" />
          </LinearGradient>
        </View>

        {/* Title */}
        <Text style={styles.introTitle}>Verify Your Profile</Text>
        <Text style={styles.introDescription}>
          Get verified to build trust with language partners and access exclusive features
        </Text>

        {/* Benefits */}
        <View style={styles.benefitsList}>
          {[
            {
              title: 'Verified Badge',
              description: "Get a verified badge on your profile that shows you're a real person",
            },
            {
              title: 'Build Trust',
              description: 'Verified users get 3x more connection requests and responses',
            },
            {
              title: 'Priority Support',
              description: 'Get faster response times from our support team',
            },
            {
              title: 'Safety First',
              description: 'Help create a safer community for language learners',
            },
          ].map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* What You'll Need */}
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>What You'll Need:</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Ionicons name="document-text" size={16} color={COLORS.primary} />
              <Text style={styles.requirementText}>
                Government-issued ID (Passport, Driver's License, or National ID)
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="camera" size={16} color={COLORS.primary} />
              <Text style={styles.requirementText}>A clear selfie holding your ID</Text>
            </View>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
          <Text style={styles.privacyText}>
            Your documents are encrypted and used only for verification. We never share your
            personal information.
          </Text>
        </View>

        {/* Continue Button */}
        <Button
          title="Start Verification"
          onPress={() => setStep('upload-id')}
          variant="gradient"
          size="large"
          style={styles.startButton}
        />
      </View>
    </ScrollView>
  );

  const renderDocumentUpload = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.uploadContent}>
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Step 1 of 2</Text>
            <Text style={styles.progressLabel}>50%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.uploadTitle}>Upload Your ID</Text>
        <Text style={styles.uploadDescription}>
          Please upload a clear photo of your government-issued ID
        </Text>

        {/* Document Type Selection */}
        <View style={styles.documentTypes}>
          {[
            { value: 'passport', label: 'Passport', icon: 'card-outline' },
            { value: 'id-card', label: 'National ID', icon: 'id-card-outline' },
            { value: 'drivers-license', label: "Driver's License", icon: 'card-outline' },
          ].map(doc => (
            <TouchableOpacity
              key={doc.value}
              onPress={() => setDocumentType(doc.value as DocumentType)}
              style={[
                styles.documentTypeCard,
                documentType === doc.value && styles.documentTypeCardActive,
              ]}
            >
              <Ionicons
                name={doc.icon as any}
                size={24}
                color={documentType === doc.value ? COLORS.primary : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.documentTypeLabel,
                  documentType === doc.value && styles.documentTypeLabelActive,
                ]}
              >
                {doc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upload Area */}
        <View style={styles.uploadArea}>
          {uploadedFiles.find(f => f.type === 'document') ? (
            <View style={styles.uploadedImageContainer}>
              <Image
                source={{
                  uri: uploadedFiles.find(f => f.type === 'document')?.preview,
                }}
                style={styles.uploadedImage}
              />
              <TouchableOpacity onPress={() => removeFile('document')} style={styles.removeButton}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handleFileUpload('document')}
              style={styles.uploadPlaceholder}
            >
              <Ionicons name="cloud-upload-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.uploadPlaceholderText}>Tap to upload photo</Text>
              <Text style={styles.uploadPlaceholderSubtext}>or take a photo with your camera</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="alert-circle" size={16} color={COLORS.primary} />
            <Text style={styles.tipsTitle}>Photo Guidelines</Text>
          </View>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• All text must be clearly visible</Text>
            <Text style={styles.tipItem}>• No glare or shadows</Text>
            <Text style={styles.tipItem}>• Full document in frame</Text>
            <Text style={styles.tipItem}>• Original document (no photocopies)</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <Button
            title="Back"
            onPress={() => setStep('intro')}
            variant="outline"
            size="large"
            style={styles.backButton}
          />
          <Button
            title="Continue"
            onPress={() => setStep('selfie')}
            variant="gradient"
            size="large"
            style={styles.continueButton}
            disabled={!uploadedFiles.find(f => f.type === 'document')}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderSelfieUpload = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.uploadContent}>
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Step 2 of 2</Text>
            <Text style={styles.progressLabel}>100%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.uploadTitle}>Take a Selfie</Text>
        <Text style={styles.uploadDescription}>
          Take a clear selfie holding your ID next to your face
        </Text>

        {/* Upload Area */}
        <View style={styles.uploadArea}>
          {uploadedFiles.find(f => f.type === 'selfie') ? (
            <View style={styles.uploadedImageContainer}>
              <Image
                source={{
                  uri: uploadedFiles.find(f => f.type === 'selfie')?.preview,
                }}
                style={styles.uploadedImage}
              />
              <TouchableOpacity onPress={() => removeFile('selfie')} style={styles.removeButton}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handleFileUpload('selfie')}
              style={styles.uploadPlaceholder}
            >
              <Ionicons name="camera-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.uploadPlaceholderText}>Tap to take selfie</Text>
              <Text style={styles.uploadPlaceholderSubtext}>Hold your ID next to your face</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Guidelines */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="person" size={16} color={COLORS.primary} />
            <Text style={styles.tipsTitle}>Selfie Guidelines</Text>
          </View>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Face clearly visible (no sunglasses)</Text>
            <Text style={styles.tipItem}>• Hold ID next to your face</Text>
            <Text style={styles.tipItem}>• Good lighting (no shadows)</Text>
            <Text style={styles.tipItem}>• Look directly at camera</Text>
          </View>
        </View>

        {/* Terms Agreement */}
        <TouchableOpacity onPress={() => setAgreedToTerms(!agreedToTerms)} style={styles.termsRow}>
          <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
            {agreedToTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.termsText}>
            I agree that my information will be used for verification purposes only and will be
            handled according to the <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <Button
            title="Back"
            onPress={() => setStep('upload-id')}
            variant="outline"
            size="large"
            style={styles.backButton}
          />
          <Button
            title="Submit"
            onPress={handleSubmitVerification}
            variant="gradient"
            size="large"
            style={styles.continueButton}
            disabled={!uploadedFiles.find(f => f.type === 'selfie') || !agreedToTerms}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderProcessing = () => (
    <View style={styles.processingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.processingTitle}>Verifying Your Identity</Text>
      <Text style={styles.processingDescription}>This usually takes 1-2 minutes...</Text>
    </View>
  );

  const renderComplete = () => {
    const scale = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    React.useEffect(() => {
      scale.value = withSpring(1, { damping: 12 });
    }, []);

    return (
      <View style={styles.completeContainer}>
        <Confetti active={true} />
        <Animated.View style={[styles.completeIcon, animatedStyle]}>
          <View style={styles.completeIconCircle}>
            <Ionicons name="checkmark-circle" size={48} color="#FFFFFF" />
          </View>
        </Animated.View>
        <Text style={styles.completeTitle}>Verification Complete!</Text>
        <Text style={styles.completeDescription}>
          Your profile has been successfully verified. You now have a verified badge!
        </Text>
        <Button
          title="Continue to Profile"
          onPress={onVerified}
          variant="gradient"
          size="large"
          style={styles.completeButton}
        />
      </View>
    );
  };

  const getHeaderTitle = () => {
    switch (step) {
      case 'intro':
        return 'Profile Verification';
      case 'upload-id':
        return 'Upload ID';
      case 'selfie':
        return 'Take Selfie';
      case 'processing':
        return 'Processing';
      case 'success':
        return 'Verified!';
      default:
        return 'Verification';
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          {step !== 'processing' && step !== 'success' && (
            <TouchableOpacity
              onPress={
                step === 'intro'
                  ? onBack
                  : () => {
                      if (step === 'upload-id') setStep('intro');
                      if (step === 'selfie') setStep('upload-id');
                    }
              }
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          {step === 'processing' || step === 'success' ? (
            <View style={styles.headerSpacer} />
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>
      </SafeAreaView>

      {step === 'intro' && renderIntro()}
      {step === 'upload-id' && renderDocumentUpload()}
      {step === 'selfie' && renderSelfieUpload()}
      {step === 'processing' && renderProcessing()}
      {step === 'success' && renderComplete()}
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
  introContent: {
    padding: SPACING['2xl'],
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING['2xl'],
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  introDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
  },
  benefitsList: {
    width: '100%',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  benefitDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  requirementsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.lg,
  },
  requirementsTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  requirementsList: {
    gap: SPACING.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  requirementText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  privacyCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  privacyText: {
    flex: 1,
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  startButton: {
    width: '100%',
  },
  uploadContent: {
    padding: SPACING['2xl'],
  },
  progressSection: {
    marginBottom: SPACING['2xl'],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  uploadTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  uploadDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    marginBottom: SPACING['2xl'],
  },
  documentTypes: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  documentTypeCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    gap: SPACING.sm,
  },
  documentTypeCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  documentTypeLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  documentTypeLabelActive: {
    color: COLORS.primary,
  },
  uploadArea: {
    marginBottom: SPACING['2xl'],
  },
  uploadPlaceholder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    alignItems: 'center',
    gap: SPACING.md,
  },
  uploadPlaceholderText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  uploadPlaceholderSubtext: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  uploadedImageContainer: {
    position: 'relative',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: 256,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tipsTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  tipsList: {
    gap: SPACING.xs,
  },
  tipItem: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  termsText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  backButton: {
    flex: 1,
  },
  continueButton: {
    flex: 1,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['2xl'],
  },
  processingTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING['2xl'],
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  processingDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['2xl'],
  },
  completeIcon: {
    marginBottom: SPACING['2xl'],
  },
  completeIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  completeDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
  },
  completeButton: {
    width: '100%',
  },
});

export default ProfileVerificationScreen;
