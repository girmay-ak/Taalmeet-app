/**
 * Conversation card component
 * 
 * Displays a conversation preview in the messages list.
 * 
 * @module presentation/components/ConversationCard
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING } from '@shared/constants/theme';

export interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isPinned: boolean;
}

interface ConversationCardProps {
  conversation: Conversation;
  onClick?: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  onClick,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onClick}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: conversation.partnerAvatar }}
          style={styles.avatar}
        />
        {conversation.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {conversation.partnerName}
            </Text>
            {conversation.isPinned && (
              <Ionicons name="pin" size={14} color={COLORS.secondary} />
            )}
          </View>
          <Text style={styles.timestamp}>{conversation.timestamp}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              conversation.unreadCount > 0 && styles.lastMessageUnread,
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {conversation.unreadCount > 9 ? '9+' : String(conversation.unreadCount)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
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
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1,
  },
  name: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  lastMessage: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  lastMessageUnread: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
});

export default ConversationCard;

