/**
 * Gamification Screen component
 * 
 * User progress, achievements, challenges, and leaderboard.
 * 
 * @module presentation/screens/GamificationScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface GamificationScreenProps {
  onBack: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'sessions' | 'streaks' | 'social' | 'learning' | 'special';
  progress: number;
  total: number;
  unlocked: boolean;
  reward: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  reward: string;
  expiresIn: string;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  badge?: string;
}

const userStats = {
  level: 12,
  currentXP: 3420,
  nextLevelXP: 4000,
  totalXP: 15420,
  currentStreak: 23,
  longestStreak: 45,
  totalSessions: 127,
  totalHours: 63.5,
  achievements: 24,
  totalAchievements: 50,
  rank: 42,
  weeklyXP: 850,
};

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first language exchange session',
    icon: '🎯',
    category: 'sessions',
    progress: 1,
    total: 1,
    unlocked: true,
    reward: '+50 XP',
    rarity: 'common',
  },
  {
    id: '2',
    title: 'Fire Starter',
    description: 'Maintain a 7-day practice streak',
    icon: '🔥',
    category: 'streaks',
    progress: 7,
    total: 7,
    unlocked: true,
    reward: '+100 XP',
    rarity: 'rare',
  },
  {
    id: '3',
    title: 'Social Butterfly',
    description: 'Connect with 10 language partners',
    icon: '🦋',
    category: 'social',
    progress: 10,
    total: 10,
    unlocked: true,
    reward: '+150 XP',
    rarity: 'rare',
  },
  {
    id: '4',
    title: 'Triple Threat',
    description: 'Learn 3 different languages',
    icon: '🌍',
    category: 'learning',
    progress: 2,
    total: 3,
    unlocked: false,
    reward: '+200 XP',
    rarity: 'epic',
  },
  {
    id: '5',
    title: 'Century Club',
    description: 'Complete 100 practice sessions',
    icon: '💯',
    category: 'sessions',
    progress: 127,
    total: 100,
    unlocked: true,
    reward: '+500 XP',
    rarity: 'epic',
  },
  {
    id: '6',
    title: 'Marathon Master',
    description: 'Maintain a 30-day streak',
    icon: '⚡',
    category: 'streaks',
    progress: 23,
    total: 30,
    unlocked: false,
    reward: '+300 XP',
    rarity: 'epic',
  },
  {
    id: '7',
    title: 'Legend',
    description: 'Reach level 25',
    icon: '👑',
    category: 'special',
    progress: 12,
    total: 25,
    unlocked: false,
    reward: 'Golden Crown Badge',
    rarity: 'legendary',
  },
  {
    id: '8',
    title: 'Polyglot',
    description: 'Practice 5 different languages',
    icon: '🗣️',
    category: 'learning',
    progress: 2,
    total: 5,
    unlocked: false,
    reward: '+1000 XP',
    rarity: 'legendary',
  },
];

const dailyChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Daily Conversation',
    description: 'Complete a 30-minute session',
    icon: '💬',
    progress: 15,
    total: 30,
    reward: '+100 XP',
    expiresIn: '8h 23m',
  },
  {
    id: '2',
    title: 'Make a Friend',
    description: 'Send 3 connection requests',
    icon: '👋',
    progress: 2,
    total: 3,
    reward: '+75 XP',
    expiresIn: '8h 23m',
  },
  {
    id: '3',
    title: 'Chat Master',
    description: 'Send 20 messages',
    icon: '✉️',
    progress: 20,
    total: 20,
    reward: '+50 XP',
    expiresIn: '8h 23m',
  },
];

const leaderboard: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Emma Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    points: 12450,
    rank: 1,
    badge: '👑',
  },
  {
    id: '2',
    name: 'Lucas Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    points: 11280,
    rank: 2,
    badge: '🥈',
  },
  {
    id: '3',
    name: 'Sophie Martin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    points: 10950,
    rank: 3,
    badge: '🥉',
  },
  {
    id: '4',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    points: 9820,
    rank: 42,
  },
];

const rarityColors = {
  common: [COLORS.textMuted, '#4B5563'],
  rare: ['#3B82F6', '#2563EB'],
  epic: ['#A855F7', '#7E22CE'],
  legendary: [COLORS.warning, '#D97706'],
};

const categories = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'sessions', label: 'Sessions', icon: '📚' },
  { id: 'streaks', label: 'Streaks', icon: '🔥' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'learning', label: 'Learning', icon: '🎓' },
  { id: 'special', label: 'Special', icon: '👑' },
];

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'trending-up' },
  { id: 'achievements', label: 'Achievements', icon: 'trophy' },
  { id: 'challenges', label: 'Challenges', icon: 'target' },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'medal' },
];

type TabType = 'overview' | 'achievements' | 'challenges' | 'leaderboard';

export const GamificationScreen: React.FC<GamificationScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [claimedChallenge, setClaimedChallenge] = useState<string | null>(null);

  const levelProgress = (userStats.currentXP / userStats.nextLevelXP) * 100;
  const achievementProgress = (userStats.achievements / userStats.totalAchievements) * 100;

  const filteredAchievements =
    selectedCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  const handleClaimReward = (challengeId: string) => {
    setClaimedChallenge(challengeId);
    setTimeout(() => {
      setClaimedChallenge(null);
    }, 3000);
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Level Card */}
      <View style={styles.levelCard}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight, COLORS.secondary]}
          style={styles.levelGradient}
        >
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelLabel}>Current Level</Text>
              <View style={styles.levelRow}>
                <Text style={styles.levelNumber}>{String(userStats.level)}</Text>
                <Ionicons name="sparkles" size={24} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.trophyEmoji}>🏆</Text>
          </View>

          {/* XP Progress */}
          <View style={styles.xpProgress}>
            <View style={styles.xpRow}>
              <Text style={styles.xpText}>{userStats.currentXP.toLocaleString()} XP</Text>
              <Text style={styles.xpText}>{userStats.nextLevelXP.toLocaleString()} XP</Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: `${levelProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.xpToNext}>
              {userStats.nextLevelXP - userStats.currentXP} XP to Level{' '}
              {userStats.level + 1}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Streak Card */}
      <View style={styles.streakCard}>
        <LinearGradient
          colors={['#FF6B35', '#F7931E', '#FFB800']}
          style={styles.streakGradient}
        >
          <View style={styles.streakHeader}>
            <View>
              <Text style={styles.streakLabel}>Current Streak</Text>
              <View style={styles.streakRow}>
                <Text style={styles.streakNumber}>{String(userStats.currentStreak)}</Text>
                <Text style={styles.streakDays}>days</Text>
              </View>
            </View>
            <Ionicons name="flame" size={64} color="#FFFFFF" />
          </View>

          <View style={styles.streakFooter}>
            <View>
              <Text style={styles.streakSubLabel}>Longest Streak</Text>
              <Text style={styles.streakSubValue}>
                {String(userStats.longestStreak)} days 🎖️
              </Text>
            </View>
            <View style={styles.streakSubRight}>
              <Text style={styles.streakSubLabel}>Keep it up!</Text>
              <Text style={styles.streakSubValue}>+5 XP/day</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        {[
          {
            label: 'Total Sessions',
            value: String(userStats.totalSessions),
            icon: '📚',
            colors: ['#6366F1', '#4F46E5'],
          },
          {
            label: 'Practice Hours',
            value: `${userStats.totalHours}h`,
            icon: '⏱️',
            colors: ['#EC4899', '#DB2777'],
          },
          {
            label: 'Global Rank',
            value: `#${userStats.rank}`,
            icon: '🌍',
            colors: ['#14B8A6', '#0D9488'],
          },
          {
            label: 'Weekly XP',
            value: String(userStats.weeklyXP),
            icon: '⚡',
            colors: ['#F59E0B', '#D97706'],
          },
        ].map((stat, index) => (
          <LinearGradient
            key={stat.label}
            colors={stat.colors}
            style={styles.statCard}
          >
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Recent Achievements Preview */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Achievements</Text>
          <TouchableOpacity onPress={() => setActiveTab('achievements')}>
            <View style={styles.viewAllRow}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.recentList}>
          {achievements
            .filter((a) => a.unlocked)
            .slice(0, 3)
            .map((achievement) => (
              <LinearGradient
                key={achievement.id}
                colors={rarityColors[achievement.rarity]}
                style={styles.recentAchievement}
              >
                <Text style={styles.recentIcon}>{achievement.icon}</Text>
                <View style={styles.recentContent}>
                  <Text style={styles.recentAchievementTitle}>{achievement.title}</Text>
                  <Text style={styles.recentAchievementDesc}>
                    {achievement.description}
                  </Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              </LinearGradient>
            ))}
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.tabContent}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id)}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id && styles.categoryChipActive,
            ]}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Progress Overview */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Achievement Progress</Text>
          <Text style={styles.progressValue}>
            {userStats.achievements}/{userStats.totalAchievements}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { width: `${achievementProgress}%` },
            ]}
          />
        </View>
      </View>

      {/* Achievements List */}
      <View style={styles.achievementsList}>
        {filteredAchievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.achievementCardLocked,
            ]}
          >
            {achievement.unlocked ? (
              <LinearGradient
                colors={rarityColors[achievement.rarity]}
                style={styles.achievementGradient}
              >
                <View style={styles.achievementContent}>
                  <View style={styles.achievementIconContainer}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <View style={styles.achievementCheck}>
                      <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                    </View>
                  </View>
                  <View style={styles.achievementInfo}>
                    <View style={styles.achievementHeader}>
                      <Text style={styles.achievementTitle}>{achievement.title}</Text>
                      <View style={styles.rarityBadge}>
                        <Text style={styles.rarityText}>
                          {achievement.rarity.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    <View style={styles.rewardRow}>
                      <Ionicons name="gift" size={16} color="#FFFFFF" />
                      <Text style={styles.rewardText}>{achievement.reward}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            ) : (
              <View style={styles.achievementContent}>
                <View style={styles.achievementIconContainer}>
                  <Text style={[styles.achievementIcon, styles.achievementIconLocked]}>
                    {achievement.icon}
                  </Text>
                </View>
                <View style={styles.achievementInfo}>
                  <View style={styles.achievementHeader}>
                    <Text style={styles.achievementTitleLocked}>
                      {achievement.title}
                    </Text>
                    <View style={styles.rarityBadgeLocked}>
                      <Text style={styles.rarityTextLocked}>
                        {achievement.rarity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.achievementDescriptionLocked}>
                    {achievement.description}
                  </Text>
                  <View style={styles.progressSection}>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressText}>
                        {achievement.progress}/{achievement.total}
                      </Text>
                      <Text style={styles.progressPercent}>
                        {Math.round((achievement.progress / achievement.total) * 100)}%
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <Animated.View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${(achievement.progress / achievement.total) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.rewardRow}>
                    <Ionicons name="gift" size={16} color={COLORS.textMuted} />
                    <Text style={styles.rewardTextLocked}>{achievement.reward}</Text>
                  </View>
                </View>
                <Ionicons
                  name="lock-closed"
                  size={32}
                  color={COLORS.textMuted}
                  style={styles.lockIcon}
                />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderChallenges = () => (
    <View style={styles.tabContent}>
      {/* Timer Header */}
      <View style={styles.timerCard}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.timerGradient}
        >
          <View style={styles.timerContent}>
            <View>
              <Text style={styles.timerLabel}>Daily Challenges Reset In</Text>
              <Text style={styles.timerValue}>8h 23m</Text>
            </View>
            <Ionicons name="target" size={48} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </View>

      {/* Challenges List */}
      <View style={styles.challengesList}>
        {dailyChallenges.map((challenge) => {
          const isCompleted = challenge.progress >= challenge.total;
          const isClaimed = claimedChallenge === challenge.id;

          return (
            <View
              key={challenge.id}
              style={[
                styles.challengeCard,
                isCompleted && !isClaimed && styles.challengeCardCompleted,
              ]}
            >
              <Text style={styles.challengeIcon}>{challenge.icon}</Text>
              <View style={styles.challengeContent}>
                <View style={styles.challengeHeader}>
                  <View style={styles.challengeTitleSection}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDescription}>
                      {challenge.description}
                    </Text>
                  </View>
                  <Text style={styles.challengeExpires}>{challenge.expiresIn}</Text>
                </View>

                <View style={styles.challengeProgress}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressText}>
                      {challenge.progress}/{challenge.total}
                    </Text>
                    <Text style={styles.progressPercent}>
                      {Math.round((challenge.progress / challenge.total) * 100)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <Animated.View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${(challenge.progress / challenge.total) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                {isCompleted && !isClaimed && (
                  <TouchableOpacity
                    onPress={() => handleClaimReward(challenge.id)}
                    style={styles.claimButton}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primaryLight]}
                      style={styles.claimButtonGradient}
                    >
                      <Ionicons name="gift" size={20} color="#FFFFFF" />
                      <Text style={styles.claimButtonText}>
                        Claim {challenge.reward}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {isClaimed && (
                  <View style={styles.claimedButton}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                    <Text style={styles.claimedText}>Claimed!</Text>
                  </View>
                )}

                {!isCompleted && (
                  <View style={styles.rewardInfo}>
                    <Ionicons name="flash" size={16} color={COLORS.warning} />
                    <Text style={styles.rewardInfoText}>
                      Reward: {challenge.reward}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Weekly Challenges Teaser */}
      <View style={styles.weeklyCard}>
        <LinearGradient
          colors={['#A855F7', '#7E22CE']}
          style={styles.weeklyGradient}
        >
          <Ionicons name="medal" size={32} color="#FFFFFF" />
          <View style={styles.weeklyContent}>
            <Text style={styles.weeklyTitle}>Weekly Challenges</Text>
            <Text style={styles.weeklySubtitle}>Coming Soon!</Text>
          </View>
          <Text style={styles.weeklyDescription}>
            Complete weekly challenges for bigger rewards and exclusive badges! 🎁
          </Text>
        </LinearGradient>
      </View>
    </View>
  );

  const renderLeaderboard = () => (
    <View style={styles.tabContent}>
      {/* Time Filter */}
      <View style={styles.timeFilter}>
        {['Today', 'This Week', 'All Time'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.timeFilterButton,
              period === 'This Week' && styles.timeFilterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.timeFilterText,
                period === 'This Week' && styles.timeFilterTextActive,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podium}>
        {/* 2nd Place */}
        <View style={styles.podiumItem}>
          <Image
            source={{ uri: leaderboard[1].avatar }}
            style={styles.podiumAvatar}
          />
          <View style={styles.podiumRank}>
            <Text style={styles.podiumRankText}>2</Text>
          </View>
          <Text style={styles.podiumName}>
            {leaderboard[1].name.split(' ')[0]}
          </Text>
          <Text style={styles.podiumPoints}>
            {leaderboard[1].points.toLocaleString()}
          </Text>
          <View style={styles.podiumBase}>
            <Text style={styles.podiumBadge}>{leaderboard[1].badge}</Text>
          </View>
        </View>

        {/* 1st Place */}
        <View style={[styles.podiumItem, styles.podiumItemFirst]}>
          <Image
            source={{ uri: leaderboard[0].avatar }}
            style={styles.podiumAvatarFirst}
          />
          <View style={styles.podiumRankFirst}>
            <Text style={styles.podiumRankTextFirst}>1</Text>
          </View>
          <Text style={styles.podiumNameFirst}>
            {leaderboard[0].name.split(' ')[0]}
          </Text>
          <Text style={styles.podiumPointsFirst}>
            {leaderboard[0].points.toLocaleString()}
          </Text>
          <View style={styles.podiumBaseFirst}>
            <Text style={styles.podiumBadgeFirst}>{leaderboard[0].badge}</Text>
          </View>
        </View>

        {/* 3rd Place */}
        <View style={styles.podiumItem}>
          <Image
            source={{ uri: leaderboard[2].avatar }}
            style={styles.podiumAvatar}
          />
          <View style={styles.podiumRank}>
            <Text style={styles.podiumRankText}>3</Text>
          </View>
          <Text style={styles.podiumName}>
            {leaderboard[2].name.split(' ')[0]}
          </Text>
          <Text style={styles.podiumPoints}>
            {leaderboard[2].points.toLocaleString()}
          </Text>
          <View style={styles.podiumBase}>
            <Text style={styles.podiumBadge}>{leaderboard[2].badge}</Text>
          </View>
        </View>
      </View>

      {/* Your Rank Card */}
      <View style={styles.yourRankCard}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.yourRankGradient}
        >
          <Image
            source={{ uri: leaderboard[3].avatar }}
            style={styles.yourRankAvatar}
          />
          <View style={styles.yourRankInfo}>
            <Text style={styles.yourRankLabel}>Your Rank</Text>
            <Text style={styles.yourRankValue}>#{leaderboard[3].rank}</Text>
          </View>
          <View style={styles.yourRankPoints}>
            <Text style={styles.yourRankLabel}>Total XP</Text>
            <Text style={styles.yourRankValue}>
              {leaderboard[3].points.toLocaleString()}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Full Leaderboard */}
      <View style={styles.fullLeaderboard}>
        <Text style={styles.leaderboardTitle}>Top Language Learners</Text>
        {leaderboard.map((user) => (
          <View
            key={user.id}
            style={[
              styles.leaderboardItem,
              user.id === '4' && styles.leaderboardItemYou,
            ]}
          >
            <Text style={styles.leaderboardRank}>
              {user.badge || `#${user.rank}`}
            </Text>
            <Image source={{ uri: user.avatar }} style={styles.leaderboardAvatar} />
            <View style={styles.leaderboardInfo}>
              <Text style={styles.leaderboardName}>{user.name}</Text>
              <Text style={styles.leaderboardPoints}>
                {user.points.toLocaleString()} XP
              </Text>
            </View>
            {user.badge && <Text style={styles.leaderboardBadge}>{user.badge}</Text>}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as TabType)}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive,
              ]}
            >
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.id ? '#FFFFFF' : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'challenges' && renderChallenges()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  tabsScroll: {
    maxHeight: 60,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
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
  content: {
    flex: 1,
  },
  tabContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  // Level Card
  levelCard: {
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
  },
  levelGradient: {
    padding: SPACING['2xl'],
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  levelLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.xs,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  levelNumber: {
    fontSize: 48,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  trophyEmoji: {
    fontSize: 48,
  },
  xpProgress: {
    gap: SPACING.sm,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: '#FFFFFF',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
  },
  xpToNext: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Streak Card
  streakCard: {
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
  },
  streakGradient: {
    padding: SPACING['2xl'],
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  streakLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.xs,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  streakDays: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  streakFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  streakSubLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.xs,
  },
  streakSubValue: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  streakSubRight: {
    alignItems: 'flex-end',
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
    width: '47%',
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Recent Achievements
  recentSection: {
    gap: SPACING.md,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.primary,
  },
  recentList: {
    gap: SPACING.sm,
  },
  recentAchievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
  },
  recentIcon: {
    fontSize: 32,
  },
  recentContent: {
    flex: 1,
  },
  recentAchievementTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  recentAchievementDesc: {
    fontSize: TYPOGRAPHY.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Category Filter
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textMuted,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  // Progress Card
  progressCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  progressValue: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  // Achievements List
  achievementsList: {
    gap: SPACING.md,
  },
  achievementCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  achievementCardLocked: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  achievementGradient: {
    padding: SPACING.lg,
  },
  achievementContent: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  achievementIconContainer: {
    position: 'relative',
  },
  achievementIcon: {
    fontSize: 40,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  achievementTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
    flex: 1,
  },
  achievementTitleLocked: {
    color: COLORS.textMuted,
  },
  rarityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  rarityBadgeLocked: {
    backgroundColor: COLORS.border,
  },
  rarityText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  rarityTextLocked: {
    color: COLORS.textMuted,
  },
  achievementDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.md,
  },
  achievementDescriptionLocked: {
    color: COLORS.textMuted,
  },
  progressSection: {
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  progressPercent: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.primary,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rewardText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  rewardTextLocked: {
    color: COLORS.textMuted,
  },
  lockIcon: {
    position: 'absolute',
    right: SPACING.lg,
    top: '50%',
    transform: [{ translateY: -16 }],
    opacity: 0.2,
  },
  // Challenges
  timerCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  timerGradient: {
    padding: SPACING.lg,
  },
  timerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.xs,
  },
  timerValue: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  challengesList: {
    gap: SPACING.md,
  },
  challengeCard: {
    flexDirection: 'row',
    gap: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  challengeCardCompleted: {
    borderColor: COLORS.primary,
  },
  challengeIcon: {
    fontSize: 40,
  },
  challengeContent: {
    flex: 1,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  challengeTitleSection: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  challengeDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  challengeExpires: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.medium,
  },
  challengeProgress: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  claimButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  claimButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  claimButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  claimedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  claimedText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textMuted,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rewardInfoText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  weeklyCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  weeklyGradient: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  weeklyContent: {
    gap: SPACING.xs,
  },
  weeklyTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  weeklySubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weeklyDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Leaderboard
  timeFilter: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  timeFilterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeFilterText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textMuted,
  },
  timeFilterTextActive: {
    color: '#FFFFFF',
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: SPACING.md,
    height: 200,
    marginBottom: SPACING.lg,
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
  },
  podiumItemFirst: {
    zIndex: 1,
  },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#C0C0C0',
    marginBottom: SPACING.sm,
  },
  podiumAvatarFirst: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFD700',
    marginBottom: SPACING.sm,
  },
  podiumRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C0C0C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  podiumRankFirst: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
  },
  podiumRankText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  podiumRankTextFirst: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.background,
  },
  podiumName: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  podiumNameFirst: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  podiumPoints: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  podiumPointsFirst: {
    fontSize: TYPOGRAPHY.base,
  },
  podiumBase: {
    width: '100%',
    height: 80,
    backgroundColor: '#C0C0C0',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: SPACING.md,
  },
  podiumBaseFirst: {
    height: 120,
    backgroundColor: '#FFD700',
  },
  podiumBadge: {
    fontSize: 24,
  },
  podiumBadgeFirst: {
    fontSize: 32,
  },
  yourRankCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  yourRankGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  yourRankAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  yourRankInfo: {
    flex: 1,
  },
  yourRankLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.xs,
  },
  yourRankValue: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  yourRankPoints: {
    alignItems: 'flex-end',
  },
  fullLeaderboard: {
    gap: SPACING.sm,
  },
  leaderboardTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leaderboardItemYou: {
    backgroundColor: `${COLORS.primary}20`,
    borderColor: COLORS.primary,
  },
  leaderboardRank: {
    width: 32,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
  },
  leaderboardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  leaderboardPoints: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  leaderboardBadge: {
    fontSize: 24,
  },
});

export default GamificationScreen;

