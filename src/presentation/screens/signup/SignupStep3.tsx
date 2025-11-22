/**
 * Signup step 3 component
 * 
 * Location selection.
 * 
 * @module presentation/screens/signup/SignupStep3
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface SignupStep3Props {
  onNext: (data: { city: string; country: string }) => void;
  onBack: () => void;
}

const COUNTRIES = [
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
];

export const SignupStep3: React.FC<SignupStep3Props> = ({ onNext, onBack }) => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('NL');

  const canProceed = city.trim() !== '' && country;

  const handleEnableGPS = () => {
    // In real app, would use geolocation API
    setCity('Den Haag');
    setCountry('NL');
  };

  const handleSubmit = () => {
    if (canProceed) {
      const selectedCountry = COUNTRIES.find((c) => c.code === country);
      onNext({
        city,
        country: selectedCountry?.name || 'Netherlands',
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
          <Text style={styles.stepIndicator}>3/4</Text>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.title}>Your Location 📍</Text>
          <Text style={styles.subtitle}>Find partners nearby</Text>

          <Input
            label="City"
            placeholder="Den Haag"
            value={city}
            onChangeText={setCity}
            leftIcon={<Ionicons name="location-outline" size={20} color={COLORS.textMuted} />}
          />

          <View style={styles.gpsButton}>
            <TouchableOpacity onPress={handleEnableGPS} style={styles.gpsButtonInner}>
              <Ionicons name="locate" size={20} color={COLORS.primary} />
              <Text style={styles.gpsButtonText}>Use Current Location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.countrySection}>
            <Text style={styles.countryLabel}>Country</Text>
            <View style={styles.countryGrid}>
              {COUNTRIES.map((countryItem) => (
                <TouchableOpacity
                  key={countryItem.code}
                  onPress={() => setCountry(countryItem.code)}
                  style={[
                    styles.countryCard,
                    country === countryItem.code && styles.countryCardSelected,
                  ]}
                >
                  {country === countryItem.code && (
                    <View style={styles.selectedBadge}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                  <Text style={styles.countryFlag}>{countryItem.flag}</Text>
                  <Text
                    style={[
                      styles.countryName,
                      country === countryItem.code && styles.countryNameSelected,
                    ]}
                  >
                    {countryItem.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  gpsButton: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  gpsButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  gpsButtonText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  countrySection: {
    marginBottom: SPACING['2xl'],
  },
  countryLabel: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  countryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  countryCard: {
    width: '30%',
    aspectRatio: 1.2,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  countryCardSelected: {
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
  countryFlag: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  countryName: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  countryNameSelected: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  submitButton: {
    marginTop: SPACING['2xl'],
  },
});

export default SignupStep3;

