/**
 * Mock data for testing
 * 
 * Provides mock data structures matching the application's data models.
 * 
 * @module __tests__/mocks/mockData
 */

import { Partner } from '@data/mockData';

/**
 * Mock user data
 */
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  age: 25,
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  location: 'Amsterdam, Netherlands',
  verified: true,
  premium: false,
  teaching: {
    language: 'English',
    level: 'Native',
    flag: '🇬🇧',
  },
  learning: {
    language: 'Dutch',
    level: 'B1 - Intermediate',
    flag: '🇳🇱',
  },
  interests: ['Coffee', 'Travel', 'Music'],
  rating: 4.8,
  connectionCount: 10,
  exchangeCount: 5,
  memberSince: '2024',
  isOnline: true,
  distance: 2.5,
  matchScore: 85,
};

/**
 * Mock partner data
 */
export const mockPartner: Partner = {
  id: 'partner-123',
  name: 'John Doe',
  age: 28,
  avatar: 'https://example.com/partner.jpg',
  isOnline: true,
  distance: 1.5,
  matchScore: 90,
  verified: true,
  premium: false,
  bio: 'Partner bio',
  teaching: {
    language: 'Spanish',
    level: 'Native',
    flag: '🇪🇸',
  },
  learning: {
    language: 'English',
    level: 'B2 - Upper Intermediate',
    flag: '🇬🇧',
  },
  languages: {
    native: 'Spanish',
    learning: 'English',
  },
  interests: ['Cooking', 'Sports'],
  location: 'Amsterdam, Netherlands',
  rating: 4.9,
  reviewCount: 50,
  exchangeCount: 60,
  memberSince: '2023',
  availableNow: true,
  lastActive: 'Active now',
  availability: {
    status: 'available' as const,
    timeLeft: 120,
    preferences: ['in-person', 'video'],
  },
};

/**
 * Mock session data
 */
export const mockSession = {
  id: 'session-123',
  title: 'Spanish Conversation Practice',
  description: 'Practice Spanish with native speakers',
  language: 'Spanish',
  languageFlag: '🇪🇸',
  level: 'Intermediate',
  date: '2024-12-01',
  time: '18:00',
  duration: 60,
  attendees: [
    'https://example.com/avatar1.jpg',
    'https://example.com/avatar2.jpg',
  ],
  totalAttendees: 2,
  maxAttendees: 10,
  joinedPercentage: 20,
  type: 'in-person',
  isVirtual: false,
  location: 'Amsterdam Central',
  organizer: {
    name: 'Organizer Name',
    avatar: 'https://example.com/organizer.jpg',
  },
};

/**
 * Mock conversation data
 */
export const mockConversation = {
  id: 'conv-123',
  partnerId: 'partner-123',
  partnerName: 'John Doe',
  partnerAvatar: 'https://example.com/partner.jpg',
  lastMessage: 'Hello! How are you?',
  lastMessageTime: '2 hours ago',
  unreadCount: 3,
  isOnline: true,
};

/**
 * Mock message data
 */
export const mockMessage = {
  id: 'msg-123',
  conversationId: 'conv-123',
  senderId: 'partner-123',
  text: 'Hello! How are you?',
  timestamp: new Date().toISOString(),
  isRead: false,
  translatedText: null,
};

