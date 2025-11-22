/**
 * Map screen component
 *
 * Displays partners on a map with filters and location features.
 *
 * @module presentation/screens/MapScreen
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { mockPartners } from '@data/mockData';

const { width, height } = Dimensions.get('window');

interface MapScreenProps {
  onPartnerClick: (partnerId: string) => void;
}

type MapView = 'default' | 'satellite' | '3d';
type Availability = 'all' | 'now' | 'week';
type MeetingType = 'all' | 'in-person' | 'virtual';

interface Filters {
  languages: string[];
  maxDistance: number;
  availability: Availability;
  minMatchScore: number;
  meetingType: MeetingType;
}

export const MapScreen: React.FC<MapScreenProps> = ({ onPartnerClick }) => {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mapView, setMapView] = useState<MapView>('default');
  const [showMapViewMenu, setShowMapViewMenu] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    languages: [],
    maxDistance: 50,
    availability: 'all',
    minMatchScore: 0,
    meetingType: 'all',
  });

  const availableLanguages = Array.from(new Set(mockPartners.map(p => p.teaching.language)));

  // Apply filters
  const filteredPartners = mockPartners.filter(partner => {
    if (partner.distance > filters.maxDistance) return false;
    if (filters.languages.length > 0 && !filters.languages.includes(partner.teaching.language))
      return false;
    if (filters.availability === 'now' && !partner.availableNow) return false;
    if (filters.minMatchScore > 0 && partner.matchScore < filters.minMatchScore) return false;
    if (
      filters.meetingType === 'in-person' &&
      partner.availability &&
      !partner.availability.preferences?.includes('in-person')
    )
      return false;
    if (
      filters.meetingType === 'virtual' &&
      partner.availability &&
      !partner.availability.preferences?.includes('video')
    )
      return false;
    return true;
  });

  const nearbyPartners = filteredPartners.filter(p => p.distance < 5);
  const selected = selectedPartner ? mockPartners.find(p => p.id === selectedPartner) : null;

  const hasActiveFilters =
    filters.languages.length > 0 ||
    filters.maxDistance < 50 ||
    filters.availability !== 'all' ||
    filters.minMatchScore > 0 ||
    filters.meetingType !== 'all';

  const resetFilters = () => {
    setFilters({
      languages: [],
      maxDistance: 50,
      availability: 'all',
      minMatchScore: 0,
      meetingType: 'all',
    });
  };

  const toggleLanguage = (lang: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const sheetHeightAnim = useRef(new Animated.Value(selected ? 200 : 140)).current;
  const radarAnim1 = useRef(new Animated.Value(1)).current;
  const radarAnim2 = useRef(new Animated.Value(1)).current;
  const radarAnim3 = useRef(new Animated.Value(1)).current;
  const radarRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const targetHeight = isExpanded ? height * 0.65 : selected ? 200 : 140;
    Animated.spring(sheetHeightAnim, {
      toValue: targetHeight,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [isExpanded, selected, sheetHeightAnim]);

  // Radar animation
  useEffect(() => {
    // Expanding rings
    const ring1 = Animated.loop(
      Animated.sequence([
        Animated.timing(radarAnim1, {
          toValue: 2.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(radarAnim1, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const ring2 = Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(radarAnim2, {
          toValue: 2.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(radarAnim2, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const ring3 = Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(radarAnim3, {
          toValue: 2.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(radarAnim3, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotating beam
    const rotate = Animated.loop(
      Animated.timing(radarRotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    ring1.start();
    ring2.start();
    ring3.start();
    rotate.start();

    return () => {
      ring1.stop();
      ring2.stop();
      ring3.stop();
      rotate.stop();
    };
  }, []);

  const handleShare = async (partnerId: string) => {
    const partner = mockPartners.find(p => p.id === partnerId);
    if (!partner) return;

    try {
      await Share.share({
        message: `Check out ${partner.name} on TaalMeet! ${partner.teaching.language} native speaker looking to learn ${partner.learning.language}. ${partner.distance}km away.`,
        title: `${partner.name} - TaalMeet`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share profile');
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Area */}
      <View style={styles.mapContainer}>
        {/* Map Background with Grid Pattern */}
        <LinearGradient
          colors={[COLORS.background, COLORS.card, COLORS.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Top Bar */}
        <SafeAreaView style={styles.topBar} edges={['top']}>
          <View style={styles.topBarContent}>
            <TouchableOpacity style={styles.locationButton}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.locationText}>Den Haag</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterButton}>
              <Ionicons name="options" size={20} color={COLORS.background} />
              {hasActiveFilters && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {String(
                      filters.languages.length +
                        (filters.maxDistance < 50 ? 1 : 0) +
                        (filters.availability !== 'all' ? 1 : 0) +
                        (filters.minMatchScore > 0 ? 1 : 0) +
                        (filters.meetingType !== 'all' ? 1 : 0)
                    )}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Map View Switcher */}
          <TouchableOpacity
            onPress={() => setShowMapViewMenu(!showMapViewMenu)}
            style={styles.mapViewButton}
          >
            <Ionicons
              name={
                mapView === 'default'
                  ? 'globe-outline'
                  : mapView === 'satellite'
                    ? 'map-outline'
                    : 'cube-outline'
              }
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.mapViewText}>
              {mapView === 'default'
                ? 'Default View'
                : mapView === 'satellite'
                  ? 'Satellite'
                  : '3D View'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Partner Markers */}
        {nearbyPartners.map((partner, index) => {
          const leftPercent = 20 + (index % 3) * 25;
          const topPercent = 30 + Math.floor(index / 3) * 25;

          return (
            <TouchableOpacity
              key={partner.id}
              onPress={() => setSelectedPartner(partner.id)}
              style={[
                styles.markerContainer,
                {
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                },
              ]}
            >
              {partner.availableNow && <View style={styles.pulseRing} />}
              <View
                style={[
                  styles.markerPin,
                  selectedPartner === partner.id && styles.markerPinSelected,
                ]}
              >
                <Image source={{ uri: partner.avatar }} style={styles.markerAvatar} />
                <View style={styles.flagBadge}>
                  <Text style={styles.flagText}>{partner.teaching.flag}</Text>
                </View>
                {partner.isOnline && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.distanceLabel}>
                <Text style={styles.distanceText}>{partner.distance} km</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Current Location Marker with Animated Radar */}
        <View style={styles.currentLocation}>
          {/* Expanding Rings */}
          <Animated.View
            style={[
              styles.radarRing,
              {
                transform: [{ scale: radarAnim1 }],
                opacity: radarAnim1.interpolate({
                  inputRange: [1, 2.5],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.radarRing,
              {
                transform: [{ scale: radarAnim2 }],
                opacity: radarAnim2.interpolate({
                  inputRange: [1, 2.5],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.radarRing,
              {
                transform: [{ scale: radarAnim3 }],
                opacity: radarAnim3.interpolate({
                  inputRange: [1, 2.5],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />

          {/* Rotating Beam */}
          <Animated.View
            style={[
              styles.radarBeam,
              {
                transform: [
                  {
                    rotate: radarRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.radarBeamGradient} />
          </Animated.View>

          {/* Center Dot */}
          <View style={styles.centerDot} />
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="add" size={20} color={COLORS.background} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="remove" size={20} color={COLORS.background} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, styles.locateButton]}>
            <Ionicons name="locate" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.bottomSheet, { height: sheetHeightAnim }]}>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.sheetHandle}>
          <View style={styles.handleBar} />
        </TouchableOpacity>

        <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
          {selected ? (
            <View style={styles.selectedCard}>
              <Image source={{ uri: selected.avatar }} style={styles.selectedAvatar} />
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedName}>
                  {selected.name}, {selected.age}
                </Text>
                <View style={styles.selectedMeta}>
                  <Text style={styles.selectedMetaText}>{selected.distance} km away</Text>
                  <Text style={styles.selectedMetaText}>•</Text>
                  <Text style={[styles.selectedMetaText, styles.matchText]}>
                    {selected.matchScore}% match
                  </Text>
                </View>
                <View style={styles.selectedActions}>
                  <TouchableOpacity
                    onPress={() => onPartnerClick(selected.id)}
                    style={styles.viewProfileButton}
                  >
                    <Text style={styles.viewProfileText}>View Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleShare(selected.id)}
                    style={styles.shareButton}
                  >
                    <Ionicons name="share-outline" size={16} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chatButton}>
                    <Text style={styles.chatText}>Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.partnerCountHeader}>
              <Text style={styles.partnerCountText}>
                {String(nearbyPartners.length)} partners nearby
              </Text>
              <Text style={styles.partnerCountSubtext}>Tap markers to see details</Text>
            </View>
          )}

          {isExpanded && (
            <View style={styles.partnerList}>
              {nearbyPartners.map(partner => (
                <TouchableOpacity
                  key={partner.id}
                  onPress={() => {
                    setSelectedPartner(partner.id);
                    setIsExpanded(false);
                  }}
                  style={styles.partnerListItem}
                >
                  <View style={styles.partnerListAvatar}>
                    <Image source={{ uri: partner.avatar }} style={styles.partnerListAvatarImage} />
                    {partner.isOnline && <View style={styles.partnerListOnlineDot} />}
                  </View>
                  <View style={styles.partnerListInfo}>
                    <Text style={styles.partnerListName}>
                      {partner.name}, {partner.age}
                    </Text>
                    <Text style={styles.partnerListMeta}>
                      {partner.distance} km • {partner.matchScore}% match
                    </Text>
                  </View>
                  <Text style={styles.partnerListFlag}>{partner.teaching.flag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setShowFilters(false)}
            activeOpacity={1}
          />
          <View style={styles.filtersSheet}>
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            {hasActiveFilters && (
              <Text style={styles.filtersSubtitle}>
                {filteredPartners.length} partners match your filters
              </Text>
            )}

            <ScrollView style={styles.filtersContent}>
              {/* Language Filter */}
              <View style={styles.filterSection}>
                <View style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Languages</Text>
                  {filters.languages.length > 0 && (
                    <Text style={styles.filterSectionCount}>
                      {filters.languages.length} selected
                    </Text>
                  )}
                </View>
                <View style={styles.languagePills}>
                  {availableLanguages.map(lang => (
                    <TouchableOpacity
                      key={lang}
                      onPress={() => toggleLanguage(lang)}
                      style={[
                        styles.languagePill,
                        filters.languages.includes(lang) && styles.languagePillActive,
                      ]}
                    >
                      {filters.languages.includes(lang) && (
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      )}
                      <Text
                        style={[
                          styles.languagePillText,
                          filters.languages.includes(lang) && styles.languagePillTextActive,
                        ]}
                      >
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Distance Filter */}
              <View style={styles.filterSection}>
                <View style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Max Distance</Text>
                  <Text style={styles.filterValue}>{filters.maxDistance} km</Text>
                </View>
                {/* Slider would go here - simplified for now */}
              </View>

              {/* Availability Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Availability</Text>
                <View style={styles.availabilityGrid}>
                  {(['all', 'now', 'week'] as Availability[]).map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setFilters(prev => ({ ...prev, availability: option }))}
                      style={[
                        styles.availabilityOption,
                        filters.availability === option && styles.availabilityOptionActive,
                      ]}
                    >
                      <Text style={styles.availabilityEmoji}>
                        {option === 'all' ? '🌍' : option === 'now' ? '⚡' : '📅'}
                      </Text>
                      <Text
                        style={[
                          styles.availabilityText,
                          filters.availability === option && styles.availabilityTextActive,
                        ]}
                      >
                        {option === 'all'
                          ? 'All'
                          : option === 'now'
                            ? 'Available Now'
                            : 'This Week'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.filtersFooter}>
              <TouchableOpacity
                onPress={resetFilters}
                disabled={!hasActiveFilters}
                style={[styles.resetButton, !hasActiveFilters && styles.resetButtonDisabled]}
              >
                <Text
                  style={[
                    styles.resetButtonText,
                    !hasActiveFilters && styles.resetButtonTextDisabled,
                  ]}
                >
                  Reset All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.applyButton}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Show {filteredPartners.length} Results</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  topBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: `${COLORS.background}CC`,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  filterButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
  },
  mapViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: `${COLORS.background}CC`,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapViewText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  pulseRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    opacity: 0.3,
  },
  markerPin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  markerPinSelected: {
    borderColor: '#E91E8C',
  },
  markerAvatar: {
    width: '100%',
    height: '100%',
  },
  flagBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  flagText: {
    fontSize: 12,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  distanceLabel: {
    marginTop: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    backgroundColor: '#FFFFFFF0',
    borderRadius: RADIUS.full,
  },
  distanceText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.background,
  },
  currentLocation: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 160,
    height: 160,
    marginLeft: -80,
    marginTop: -80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: `${COLORS.primary}66`,
  },
  radarBeam: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
  },
  radarBeamGradient: {
    width: '100%',
    height: '100%',
    backgroundColor: `${COLORS.primary}33`,
  },
  centerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    zIndex: 10,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  mapControls: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: 200,
    gap: SPACING.sm,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFFF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locateButton: {
    backgroundColor: COLORS.primary,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sheetHandle: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    alignItems: 'center',
  },
  handleBar: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  selectedCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  selectedAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: SPACING.md,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  selectedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  selectedMetaText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  matchText: {
    color: COLORS.primary,
  },
  selectedActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  partnerCountHeader: {
    marginBottom: SPACING.lg,
  },
  partnerCountText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  partnerCountSubtext: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  partnerList: {
    gap: SPACING.sm,
  },
  partnerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  partnerListAvatar: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  partnerListAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  partnerListOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  partnerListInfo: {
    flex: 1,
  },
  partnerListName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  partnerListMeta: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  partnerListFlag: {
    fontSize: TYPOGRAPHY.base,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  filtersSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    maxHeight: height * 0.85,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filtersTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  filtersSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  filtersContent: {
    padding: SPACING.lg,
  },
  filterSection: {
    marginBottom: SPACING['2xl'],
  },
  filterSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  filterSectionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  filterSectionCount: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  filterValue: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  languagePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  languagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  languagePillActive: {
    backgroundColor: COLORS.primary,
  },
  languagePillText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textMuted,
  },
  languagePillTextActive: {
    color: '#FFFFFF',
  },
  availabilityGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  availabilityOption: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  availabilityOptionActive: {
    backgroundColor: COLORS.primary,
  },
  availabilityEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  availabilityText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  availabilityTextActive: {
    color: '#FFFFFF',
  },
  filtersFooter: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: COLORS.card,
    opacity: 0.5,
  },
  resetButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  resetButtonTextDisabled: {
    color: COLORS.textMuted,
  },
  applyButton: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
});

export default MapScreen;
