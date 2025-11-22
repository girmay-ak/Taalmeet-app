/**
 * Premium Upgrade Modal component
 *
 * Modal for upgrading to premium subscription.
 *
 * @module presentation/components/modals/PremiumUpgradeModal
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { Button } from '../Button';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '9.99',
    period: '/month',
    savings: null,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '79.99',
    period: '/year',
    savings: 'Save 33%',
    popular: true,
  },
];

const features = [
  { icon: 'people', text: 'Unlimited matches & connections', color: COLORS.primary },
  { icon: 'chatbubbles', text: 'Priority message delivery', color: COLORS.secondary },
  { icon: 'location', text: 'See who viewed your profile', color: '#E91E8C' },
  { icon: 'flash', text: 'Boost your profile visibility', color: COLORS.warning },
  { icon: 'shield-checkmark', text: 'Advanced privacy controls', color: '#8B5CF6' },
  { icon: 'sparkles', text: 'Exclusive premium badge', color: COLORS.primaryLight },
];

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (planId: string) => void;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const handleUpgrade = () => {
    onUpgrade(selectedPlan);
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Header with Gradient */}
          <LinearGradient colors={['#E91E8C', '#C71976', '#9B1560']} style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="sparkles" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Go Premium</Text>
            <Text style={styles.headerSubtitle}>
              Unlock all features and supercharge your language learning
            </Text>
          </LinearGradient>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Plan Selection */}
            <View style={styles.planSection}>
              <View style={styles.planGrid}>
                {plans.map(plan => (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelectedPlan(plan.id)}
                    style={[styles.planCard, selectedPlan === plan.id && styles.planCardSelected]}
                  >
                    {plan.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>Popular</Text>
                      </View>
                    )}
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>${plan.price}</Text>
                      <Text style={styles.period}>{plan.period}</Text>
                    </View>
                    {plan.savings && <Text style={styles.savings}>{plan.savings}</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>Premium Features</Text>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                    <Ionicons name={feature.icon as any} size={20} color={feature.color} />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Upgrade to Premium"
              onPress={handleUpgrade}
              variant="primary"
              size="large"
              style={styles.upgradeButtonModal}
            />
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  container: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  header: {
    padding: SPACING['2xl'],
    paddingTop: SPACING['5xl'],
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    padding: SPACING.lg,
  },
  planSection: {
    marginBottom: SPACING['2xl'],
  },
  planGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  planCard: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#E91E8C',
    backgroundColor: '#E91E8C10',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: SPACING.md,
    backgroundColor: '#E91E8C',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  popularText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  planName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  period: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  savings: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  featuresSection: {
    marginBottom: SPACING.lg,
  },
  featuresTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  upgradeButtonModal: {
    marginBottom: SPACING.sm,
  },
  cancelButton: {
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  cancelText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
  },
});

export default PremiumUpgradeModal;
