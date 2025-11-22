/**
 * Connections Screen component
 *
 * Manage connections, requests, and suggested partners.
 *
 * @module presentation/screens/ConnectionsScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PartnerCard } from '../components/PartnerCard';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { mockPartners } from '@data/mockData';

interface ConnectionsScreenProps {
  onPartnerClick: (partnerId: string) => void;
}

export const ConnectionsScreen: React.FC<ConnectionsScreenProps> = ({ onPartnerClick }) => {
  const [activeTab, setActiveTab] = useState<'connections' | 'requests' | 'suggested'>(
    'connections'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const connections = mockPartners.slice(0, 4);
  const requests = mockPartners.slice(4, 6);
  const suggested = mockPartners.slice(2, 5);

  const tabs = [
    { id: 'connections', label: 'Connections', count: connections.length },
    { id: 'requests', label: 'Requests', count: requests.length },
    { id: 'suggested', label: 'Suggested', count: suggested.length },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'connections':
        return connections;
      case 'requests':
        return requests;
      case 'suggested':
        return suggested;
      default:
        return [];
    }
  };

  const filteredData = getCurrentData().filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Connections</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search connections..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={[styles.tabBadge, activeTab === tab.id && styles.tabBadgeActive]}>
                  <Text
                    style={[styles.tabBadgeText, activeTab === tab.id && styles.tabBadgeTextActive]}
                  >
                    {String(tab.count)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="people-outline" size={48} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab} yet</Text>
            <Text style={styles.emptySubtitle}>Start connecting with language partners</Text>
            <TouchableOpacity style={styles.emptyButton}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.emptyButtonGradient}
              >
                <Text style={styles.emptyButtonText}>Discover Partners</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredData.map(partner => (
              <View key={partner.id} style={styles.partnerCard}>
                <TouchableOpacity
                  onPress={() => onPartnerClick(partner.id)}
                  style={styles.partnerHeader}
                >
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: partner.avatar }} style={styles.avatar} />
                    {partner.isOnline && <View style={styles.onlineIndicator} />}
                  </View>
                  <View style={styles.partnerInfo}>
                    <View style={styles.partnerNameRow}>
                      <Text style={styles.partnerName}>
                        {partner.name}, {partner.age}
                      </Text>
                      {activeTab === 'connections' && (
                        <View style={styles.matchBadge}>
                          <Text style={styles.matchBadgeText}>{String(partner.matchScore)}%</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.partnerMeta}>
                      <Text style={styles.partnerMetaText}>{String(partner.distance)}km away</Text>
                      <Text style={styles.partnerMetaDot}>•</Text>
                      <Text style={styles.partnerMetaText}>{partner.lastActive}</Text>
                    </View>
                    <View style={styles.languagesRow}>
                      <View style={styles.languageTag}>
                        <Text style={styles.languageFlag}>{partner.teaching.flag}</Text>
                        <Text style={styles.languageLabel}>Teaching</Text>
                      </View>
                      <View style={styles.languageTag}>
                        <Text style={styles.languageFlag}>{partner.learning.flag}</Text>
                        <Text style={styles.languageLabel}>Learning</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Action Buttons */}
                {activeTab === 'connections' && (
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.messageButton}>
                      <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryLight]}
                        style={styles.messageButtonGradient}
                      >
                        <Text style={styles.messageButtonText}>Message</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.videoButton}>
                      <Text style={styles.videoButtonText}>Video Call</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {activeTab === 'requests' && (
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.acceptButton}>
                      <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryLight]}
                        style={styles.acceptButtonGradient}
                      >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                      <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {activeTab === 'suggested' && (
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.connectButton}>
                      <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryLight]}
                        style={styles.connectButtonGradient}
                      >
                        <Ionicons name="person-add" size={16} color="#FFFFFF" />
                        <Text style={styles.connectButtonText}>Connect</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onPartnerClick(partner.id)}
                      style={styles.viewButton}
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
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
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.base,
  },
  tabs: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.border,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabBadgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textMuted,
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  partnerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  partnerHeader: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  partnerName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  matchBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  matchBadgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
  partnerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  partnerMetaText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  partnerMetaDot: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  languagesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
  },
  languageFlag: {
    fontSize: 16,
  },
  languageLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  messageButton: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  messageButtonGradient: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  messageButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
  videoButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  videoButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  acceptButton: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  acceptButtonGradient: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
  declineButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  connectButton: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  connectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
  },
  connectButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
  viewButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['2xl'],
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    marginBottom: SPACING['2xl'],
    textAlign: 'center',
  },
  emptyButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.md,
  },
  emptyButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
});

export default ConnectionsScreen;
