/**
 * Discover screen component
 * 
 * Main discovery screen showing language exchange sessions and nearby partners.
 * 
 * @module presentation/screens/DiscoverScreen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SessionCard } from '../components/SessionCard';
import { PartnerCard } from '../components/PartnerCard';
import { MatchFoundPopup } from '../components/MatchFoundPopup';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { mockPartners } from '@data/mockData';
import { mockSessions } from '@data/mockSessions';

interface DiscoverScreenProps {
  onPartnerClick: (partnerId: string) => void;
  onNavigateToChat?: (partnerId: string) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onPartnerClick,
  onNavigateToChat,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchedPartner, setMatchedPartner] = useState<any>(null);
  
  const onlineNearby = mockPartners.filter(p => p.isOnline && p.distance < 2);
  const filteredSessions = selectedLanguage === 'All' 
    ? mockSessions 
    : mockSessions.filter(s => s.language === selectedLanguage);

  const languageCategories = ['All', 'Spanish', 'French', 'Japanese', 'Dutch', 'English'];

  // Simulate finding a match nearby (for demo purposes)
  // In production, this would be triggered by actual match events
  useEffect(() => {
    // Auto-trigger match popup after 3 seconds for demo
    // Commented out to avoid auto-showing, but can be enabled for testing
    // const timer = setTimeout(() => {
    //   const veryClosePartner = mockPartners.find(p => p.distance < 0.5);
    //   if (veryClosePartner) {
    //     setMatchedPartner(veryClosePartner);
    //     setShowMatchPopup(true);
    //   }
    // }, 3000);
    // return () => clearTimeout(timer);
  }, []);

  // Handle notification bell click - triggers match popup for demo
  const handleNotificationClick = () => {
    // Find a very close partner for demo
    const veryClosePartner = mockPartners.find(p => p.distance < 0.5) || mockPartners[0];
    if (veryClosePartner) {
      setMatchedPartner(veryClosePartner);
      setShowMatchPopup(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.welcomeText}>Welcome 👋</Text>
              <Text style={styles.userName}>Sarah Chen</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationClick}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.sectionLabel}>Language Exchange Sessions</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Happening Today</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredSessions.length}</Text>
            </View>
          </View>
        </View>

        {/* Language Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {languageCategories.map((lang) => (
            <TouchableOpacity
              key={lang}
              onPress={() => setSelectedLanguage(lang)}
              style={[
                styles.filterPill,
                selectedLanguage === lang && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedLanguage === lang && styles.filterTextActive,
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Online Nearby */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Online Nearby <Text style={styles.sectionSubtitle}>({onlineNearby.length})</Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.partnersScroll}
            contentContainerStyle={styles.partnersContent}
          >
            {onlineNearby.map((partner) => (
              <TouchableOpacity
                key={partner.id}
                onPress={() => onPartnerClick(partner.id)}
                style={styles.partnerMini}
              >
                <View style={styles.partnerAvatarContainer}>
                  <Image
                    source={{ uri: partner.avatar }}
                    style={styles.partnerAvatar}
                  />
                  <View style={styles.onlineDot} />
                </View>
                <Text style={styles.partnerName} numberOfLines={1}>
                  {partner.name.split(' ')[0]}
                </Text>
                <Text style={styles.partnerDistance}>{partner.distance} km</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedLanguage === 'All' ? 'All Sessions' : `${selectedLanguage} Sessions`}
          </Text>
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onClick={() => {
                // Handle session click
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* Match Found Popup */}
      <MatchFoundPopup
        partner={matchedPartner}
        onClose={() => {
          setShowMatchPopup(false);
          setMatchedPartner(null);
        }}
        onNavigateToChat={(partnerId) => {
          setShowMatchPopup(false);
          if (onNavigateToChat) {
            onNavigateToChat(partnerId);
          }
        }}
        onNavigateToProfile={(partnerId) => {
          setShowMatchPopup(false);
          onPartnerClick(partnerId);
        }}
      />
    </SafeAreaView>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  userName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  notificationButton: {
    position: 'relative',
    padding: SPACING.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  titleSection: {
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  countBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  filterContainer: {
    marginTop: SPACING.md,
  },
  filterContent: {
    gap: SPACING.sm,
  },
  filterPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  filterText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textMuted,
  },
  filterTextActive: {
    color: COLORS.background,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  sectionSubtitle: {
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.normal,
  },
  partnersScroll: {
    marginBottom: SPACING.lg,
  },
  partnersContent: {
    gap: SPACING.md,
  },
  partnerMini: {
    alignItems: 'center',
    width: 64,
  },
  partnerAvatarContainer: {
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  partnerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  partnerName: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  partnerDistance: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});

export default DiscoverScreen;

