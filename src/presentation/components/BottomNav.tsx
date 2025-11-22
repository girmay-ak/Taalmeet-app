/**
 * Bottom navigation component
 *
 * Main navigation bar at the bottom of the app.
 * Matches the Figma design with animated icons and badges.
 *
 * @module presentation/components/BottomNav
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING } from '@shared/constants/theme';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface Tab {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
}

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  unreadMessages?: number;
}

/**
 * Bottom navigation component
 *
 * Displays the main navigation tabs at the bottom of the screen.
 *
 * @param props - Bottom navigation props
 * @returns Bottom navigation component
 */
export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadMessages = 0,
}) => {
  const tabs: Tab[] = [
    { id: 'discover', icon: 'home-outline', label: 'Home' },
    { id: 'map', icon: 'map-outline', label: 'Maps' },
    { id: 'available', icon: 'time-outline', label: 'Available' },
    { id: 'messages', icon: 'chatbubbles-outline', label: 'Chat', badge: unreadMessages },
    { id: 'profile', icon: 'person-outline', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          const activeIcon = tab.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                {isActive && <View style={styles.activeIndicator} />}
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={isActive ? activeIcon : tab.icon}
                    size={24}
                    color={isActive ? COLORS.primary : COLORS.textMuted}
                  />
                  {tab.badge && tab.badge > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {tab.badge > 9 ? '9+' : String(tab.badge)}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.primary,
  },
});

export default BottomNav;
