/**
 * Messages screen component
 *
 * Displays list of conversations with search and filtering.
 *
 * @module presentation/screens/MessagesScreen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ConversationCard } from '../components/ConversationCard';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { mockConversations } from '@data/mockData';

interface MessagesScreenProps {
  onConversationClick: (conversationId: string) => void;
}

type Tab = 'all' | 'unread' | 'archived';

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ onConversationClick }) => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all' as Tab, label: 'All', count: mockConversations.length },
    {
      id: 'unread' as Tab,
      label: 'Unread',
      count: mockConversations.filter(c => c.unreadCount > 0).length,
    },
    { id: 'archived' as Tab, label: 'Archived', count: 0 },
  ];

  const filteredConversations = mockConversations.filter(conv => {
    if (activeTab === 'unread') return conv.unreadCount > 0;
    if (activeTab === 'archived') return false;
    if (searchQuery) {
      return (
        conv.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.newMessageButton}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              style={styles.newMessageButtonGradient}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
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
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            >
              {activeTab === tab.id ? (
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  style={styles.tabGradient}
                >
                  <Text style={styles.tabTextActive}>{tab.label}</Text>
                  {tab.count > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{String(tab.count)}</Text>
                    </View>
                  )}
                </LinearGradient>
              ) : (
                <>
                  <Text style={styles.tabText}>{tab.label}</Text>
                  {tab.count > 0 && (
                    <View style={styles.tabBadgeInactive}>
                      <Text style={styles.tabBadgeTextInactive}>{String(tab.count)}</Text>
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      {/* Conversations List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredConversations.length > 0 ? (
          <View style={styles.conversationsList}>
            {filteredConversations.map(conversation => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onClick={() => onConversationClick(conversation.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="chatbubbles-outline" size={48} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>
              No {activeTab === 'all' ? '' : activeTab} messages
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'all'
                ? 'Start chatting with language partners'
                : `You don't have any ${activeTab} messages`}
            </Text>
            <TouchableOpacity style={styles.discoverButton}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.discoverButtonGradient}
              >
                <Text style={styles.discoverButtonText}>Discover Partners</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  newMessageButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
  },
  tabs: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  tabActive: {
    overflow: 'hidden',
  },
  tabGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  tabText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  tabBadgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  tabBadgeInactive: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  tabBadgeTextInactive: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textMuted,
  },
  content: {
    flex: 1,
  },
  conversationsList: {
    backgroundColor: COLORS.card,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING['5xl'],
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    marginBottom: SPACING['2xl'],
    textAlign: 'center',
  },
  discoverButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  discoverButtonGradient: {
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.md,
  },
  discoverButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
});

export default MessagesScreen;
