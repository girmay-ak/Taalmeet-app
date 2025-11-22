/**
 * Help & Support Screen component
 *
 * Help center with FAQs, contact options, and resources.
 *
 * @module presentation/screens/HelpSupportScreen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface HelpSupportScreenProps {
  onBack: () => void;
}

interface FAQ {
  question: string;
  answer: string;
}

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ onBack }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: 'How do I find language partners?',
      answer: 'Use the Discover tab to browse sessions and the Map to find partners nearby.',
    },
    {
      question: 'How does matching work?',
      answer: 'We match you based on language compatibility, location, and shared interests.',
    },
    {
      question: 'Is TaalMeet free?',
      answer: 'Yes! TaalMeet is free with optional Premium features for enhanced experience.',
    },
    {
      question: 'How do I report inappropriate behavior?',
      answer: 'Go to Privacy & Safety settings and tap "Report an Issue".',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@taalmeet.com');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT US</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactLeft}>
                <View style={[styles.contactIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Ionicons name="chatbubbles-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.contactText}>
                  <Text style={styles.contactLabel}>Live Chat</Text>
                  <Text style={styles.contactDescription}>Chat with our support team</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity onPress={handleEmailSupport} style={styles.contactItem}>
              <View style={styles.contactLeft}>
                <View style={[styles.contactIcon, { backgroundColor: `${COLORS.secondary}20` }]}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.secondary} />
                </View>
                <View style={styles.contactText}>
                  <Text style={styles.contactLabel}>Email Support</Text>
                  <Text style={styles.contactDescription}>support@taalmeet.com</Text>
                </View>
              </View>
              <Ionicons name="open-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
          <View style={styles.faqsList}>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqCard}>
                <TouchableOpacity onPress={() => toggleFAQ(index)} style={styles.faqHeader}>
                  <View style={styles.faqHeaderLeft}>
                    <View style={[styles.faqIcon, { backgroundColor: `${COLORS.tertiary}20` }]}>
                      <Ionicons name="help-circle-outline" size={16} color={COLORS.tertiary} />
                    </View>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                  </View>
                  <Ionicons
                    name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
                {expandedFAQ === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RESOURCES</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.resourceItem}>
              <View style={styles.resourceLeft}>
                <View style={[styles.resourceIcon, { backgroundColor: `${COLORS.warning}20` }]}>
                  <Ionicons name="document-text-outline" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.resourceText}>
                  <Text style={styles.resourceLabel}>User Guide</Text>
                  <Text style={styles.resourceDescription}>Learn how to use TaalMeet</Text>
                </View>
              </View>
              <Ionicons name="open-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.resourceItem}>
              <View style={styles.resourceLeft}>
                <View style={[styles.resourceIcon, { backgroundColor: `${COLORS.info}20` }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.info} />
                </View>
                <View style={styles.resourceText}>
                  <Text style={styles.resourceLabel}>Safety Tips</Text>
                  <Text style={styles.resourceDescription}>Stay safe while learning</Text>
                </View>
              </View>
              <Ionicons name="open-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.resourceItem}>
              <View style={styles.resourceLeft}>
                <View style={[styles.resourceIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Ionicons name="people-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.resourceText}>
                  <Text style={styles.resourceLabel}>Community Guidelines</Text>
                  <Text style={styles.resourceDescription}>Our community standards</Text>
                </View>
              </View>
              <Ionicons name="open-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appInfoCard}>
            <Text style={styles.appInfoText}>TaalMeet Version 1.0.0</Text>
            <Text style={styles.appInfoCopyright}>© 2025 TaalMeet. All rights reserved.</Text>
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  contactDescription: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.lg,
  },
  faqsList: {
    gap: SPACING.md,
  },
  faqCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  faqHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faqIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  faqAnswer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingLeft: SPACING['2xl'] + SPACING.md,
  },
  faqAnswerText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  resourceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  resourceText: {
    flex: 1,
  },
  resourceLabel: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  resourceDescription: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  appInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  appInfoCopyright: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
});

export default HelpSupportScreen;
