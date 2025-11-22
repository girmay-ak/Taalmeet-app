/**
 * Chat screen component
 *
 * Individual chat conversation with messages, translation, and input.
 *
 * @module presentation/screens/ChatScreen
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';
import { mockMessages, mockPartners, mockConversations } from '@data/mockData';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
  translated?: string;
  showTranslation?: boolean;
  detectedLanguage?: string;
}

interface ChatScreenProps {
  conversationId: string;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ conversationId, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(
    mockMessages.map(msg => ({
      ...msg,
      showTranslation: false,
      detectedLanguage: msg.isSent ? 'en' : 'fr',
    }))
  );
  const [autoTranslate, setAutoTranslate] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get conversation and partner
  const conversation = mockConversations.find(c => c.id === conversationId);
  const partner = mockPartners.find(p => p.id === conversation?.partnerId) || mockPartners[1];

  // Mock translation function
  const translateMessage = (text: string, fromLang: string, toLang: string): string => {
    const translations: Record<string, string> = {
      "Hey! How's your French practice going?":
        'Salut ! Comment se passe ta pratique du français ?',
      'Bonjour! Ça va très bien, merci! 🇫🇷': "Hello! It's going very well, thank you! 🇫🇷",
      'Great! Want to have a conversation session this weekend?':
        'Super ! Tu veux avoir une session de conversation ce week-end ?',
      'Oui! Saturday at 2pm works for me': 'Yes! Saturday at 2pm works for me',
      'Perfect! See you then 😊': 'Parfait ! À samedi 😊',
    };
    return translations[text] || `[Translated: ${text}]`;
  };

  const handleTranslate = (messageId: string) => {
    setMessages(
      messages.map(msg => {
        if (msg.id === messageId) {
          if (!msg.translated) {
            const targetLang = msg.isSent ? 'fr' : 'en';
            msg.translated = translateMessage(msg.text, msg.detectedLanguage || 'auto', targetLang);
          }
          return { ...msg, showTranslation: !msg.showTranslation };
        }
        return msg;
      })
    );
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        timestamp: 'Just now',
        isSent: true,
        isRead: false,
        showTranslation: false,
        detectedLanguage: 'en',
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.partnerInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: partner.avatar }} style={styles.avatar} />
              {partner.isOnline && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.partnerDetails}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <Text style={styles.partnerStatus}>
                {partner.isOnline ? 'Active now' : partner.lastActive || 'Offline'}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton}>
              <Ionicons name="call-outline" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <Ionicons name="videocam-outline" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Divider */}
        <View style={styles.dateDivider}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>Today</Text>
          </View>
        </View>

        {/* Messages */}
        {messages.map((msg, index) => (
          <View
            key={msg.id}
            style={[
              styles.messageWrapper,
              msg.isSent ? styles.messageWrapperSent : styles.messageWrapperReceived,
            ]}
          >
            {!msg.isSent && <Image source={{ uri: partner.avatar }} style={styles.messageAvatar} />}

            <View style={styles.messageContent}>
              <View
                style={[
                  styles.messageBubble,
                  msg.isSent ? styles.messageBubbleSent : styles.messageBubbleReceived,
                ]}
              >
                <Text style={[styles.messageText, msg.isSent && styles.messageTextSent]}>
                  {msg.text}
                </Text>

                {msg.showTranslation && msg.translated && (
                  <View style={styles.translationContainer}>
                    <View style={styles.translationHeader}>
                      <Ionicons
                        name="language"
                        size={12}
                        color={msg.isSent ? 'rgba(255, 255, 255, 0.6)' : COLORS.textMuted}
                      />
                      <Text
                        style={[styles.translationLabel, msg.isSent && styles.translationLabelSent]}
                      >
                        Translation:
                      </Text>
                    </View>
                    <Text
                      style={[styles.translationText, msg.isSent && styles.translationTextSent]}
                    >
                      {msg.translated}
                    </Text>
                  </View>
                )}
              </View>

              {/* Timestamp and Actions */}
              <View
                style={[
                  styles.messageFooter,
                  msg.isSent ? styles.messageFooterSent : styles.messageFooterReceived,
                ]}
              >
                <Text style={styles.timestamp}>{msg.timestamp}</Text>
                {!msg.isSent && (
                  <>
                    <TouchableOpacity
                      onPress={() => handleTranslate(msg.id)}
                      style={styles.messageAction}
                    >
                      <Ionicons
                        name="language-outline"
                        size={14}
                        color={msg.showTranslation ? COLORS.primary : COLORS.textMuted}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.messageAction}>
                      <Ionicons name="volume-high-outline" size={14} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <SafeAreaView style={styles.inputContainer} edges={['bottom']}>
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputActionButton}>
            <Ionicons name="add" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Message..."
              placeholderTextColor={COLORS.textMuted}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!message.trim()}
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          >
            {message.trim() ? (
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </LinearGradient>
            ) : (
              <Ionicons name="send" size={20} color={COLORS.textMuted} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  partnerDetails: {
    flex: 1,
  },
  partnerName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  partnerStatus: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.accent,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  headerActionButton: {
    padding: SPACING.xs,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  dateDivider: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dateBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
  },
  dateText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    maxWidth: '80%',
  },
  messageWrapperSent: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageWrapperReceived: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: SPACING.sm,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
  },
  messageBubbleSent: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: RADIUS.sm,
  },
  messageBubbleReceived: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: RADIUS.sm,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  messageTextSent: {
    color: '#FFFFFF',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  messageFooterSent: {
    justifyContent: 'flex-end',
  },
  messageFooterReceived: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  messageAction: {
    padding: SPACING.xs,
  },
  translationContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  translationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  translationLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  translationLabelSent: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  translationText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  translationTextSent: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  inputActionButton: {
    padding: SPACING.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.xs,
    maxHeight: 80,
  },
  emojiButton: {
    padding: SPACING.xs,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  messageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  messageActionText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
});

export default ChatScreen;
