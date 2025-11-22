/**
 * Application navigation configuration
 * 
 * Sets up the main navigation structure for the app using React Navigation.
 * This file configures the navigation stack and tab navigation.
 * 
 * @module presentation/navigation/AppNavigator
 */

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import MapScreen from '../screens/MapScreen';
import AvailableScreen from '../screens/AvailableScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';
import PartnerProfileScreen from '../screens/PartnerProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GamificationScreen from '../screens/GamificationScreen';
import SignupFlow from '../screens/signup/SignupFlow';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import ConnectionsScreen from '../screens/ConnectionsScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LanguagePreferencesScreen from '../screens/LanguagePreferencesScreen';
import PrivacySafetyScreen from '../screens/PrivacySafetyScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import ProfileVerificationScreen from '../screens/ProfileVerificationScreen';
import { BottomNav } from '../components/BottomNav';
import { mockConversations } from '@data/mockData';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Main tab navigator
 * 
 * Defines the bottom tab navigation structure.
 * This is a placeholder that will be populated with actual screens.
 * 
 * @returns Tab navigator component
 */
const MainTabs = ({ navigation, onLogout }: any) => {
  const [currentTab, setCurrentTab] = React.useState('discover');

  const handlePartnerClick = (partnerId: string) => {
    navigation.navigate('PartnerProfile', { partnerId });
  };

  const handleConversationClick = (conversationId: string) => {
    navigation.navigate('Chat', { conversationId });
  };

  return (
    <View style={{ flex: 1 }}>
      {currentTab === 'discover' && (
        <DiscoverScreen
          onPartnerClick={handlePartnerClick}
          onNavigateToChat={() => {
            setCurrentTab('messages');
          }}
        />
      )}
      {currentTab === 'messages' && (
        <MessagesScreen
          onConversationClick={handleConversationClick}
        />
      )}
      {currentTab === 'map' && (
        <MapScreen
          onPartnerClick={handlePartnerClick}
        />
      )}
      {currentTab === 'available' && <AvailableScreen />}
      {currentTab === 'profile' && (
        <ProfileScreen
          onNavigateToSettings={() => {
            navigation.navigate('Settings');
          }}
          onNavigateToLanguagePreferences={() => {
            navigation.navigate('LanguagePreferences');
          }}
          onNavigateToPrivacy={() => {
            navigation.navigate('PrivacySafety');
          }}
          onNavigateToHelp={() => {
            navigation.navigate('HelpSupport');
          }}
          onNavigateToVerification={() => {
            navigation.navigate('ProfileVerification');
          }}
          onNavigateToGamification={() => {
            navigation.navigate('Gamification');
          }}
          onLogout={onLogout}
        />
      )}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        unreadMessages={mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
      />
    </View>
  );
};

/**
 * Root navigator component
 * 
 * This is the main navigation container for the app.
 * It wraps all navigation and provides navigation context.
 * Handles splash screen and authentication flow.
 * 
 * @returns Navigation container with stack navigator
 * @example
 * <AppNavigator />
 */
export const AppNavigator: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // Auto-hide splash after 2.5 seconds
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return (
    <NavigationContainer>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : !isAuthenticated ? (
        showSignup ? (
          <SignupFlow
            onComplete={() => {
              setIsAuthenticated(true);
              setShowSignup(false);
            }}
            onBackToLogin={() => setShowSignup(false)}
          />
        ) : (
          <LoginScreen
            onLogin={() => setIsAuthenticated(true)}
            onSignup={() => setShowSignup(true)}
          />
        )
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main">
            {(props) => (
              <MainTabs
                {...props}
                onLogout={() => setIsAuthenticated(false)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="PartnerProfile"
            options={{ presentation: 'card' }}
          >
            {({ route, navigation }: any) => (
              <PartnerProfileScreen
                partnerId={route.params?.partnerId || '1'}
                onBack={() => navigation.goBack()}
                onMessage={() => {
                  // Navigate to chat
                  navigation.navigate('Chat', { conversationId: '1' });
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Chat"
            options={{ presentation: 'card', headerShown: false }}
          >
            {({ route, navigation }: any) => (
              <ChatScreen
                conversationId={route.params?.conversationId || '1'}
                onBack={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Gamification"
            options={{ presentation: 'card', headerShown: false }}
          >
            {({ navigation }: any) => (
              <GamificationScreen onBack={() => navigation.goBack()} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="VerificationCode"
            options={{ presentation: 'card', headerShown: false }}
          >
            {({ route, navigation }: any) => (
              <VerificationCodeScreen
                verificationType={route.params?.verificationType || 'email'}
                contactInfo={route.params?.contactInfo || ''}
                purpose={route.params?.purpose || 'signup'}
                onVerified={() => {
                  if (route.params?.onVerified) {
                    route.params.onVerified();
                  }
                  navigation.goBack();
                }}
                onBack={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Connections"
            options={{ presentation: 'card', headerShown: false }}
          >
            {({ navigation }: any) => (
              <ConnectionsScreen
                onPartnerClick={(partnerId) => {
                  navigation.navigate('PartnerProfile', { partnerId });
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="SessionDetail"
            options={{ presentation: 'modal', headerShown: false }}
          >
            {({ route, navigation }: any) => (
              <SessionDetailScreen
                session={route.params?.session || null}
                onClose={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Settings"
            options={{ presentation: 'card', headerShown: false }}
          >
            {({ navigation }: any) => (
              <SettingsScreen
                onBack={() => navigation.goBack()}
                onNavigateToBlockedUsers={() => {
                  // TODO: Navigate to blocked users
                }}
                onNavigateToChangePassword={() => {
                  // TODO: Navigate to change password modal
                }}
                onNavigateToLanguageSelection={() => {
                  navigation.navigate('LanguagePreferences');
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="LanguagePreferences"
            options={{ presentation: 'card', headerShown: false }}
          >
            {({ navigation }: any) => (
              <LanguagePreferencesScreen onBack={() => navigation.goBack()} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="PrivacySafety"
            options={{ presentation: 'card', headerShown: false }}
          >
            {({ navigation }: any) => (
              <PrivacySafetyScreen
                onBack={() => navigation.goBack()}
                onNavigateToBlockedUsers={() => {
                  // TODO: Navigate to blocked users
                }}
                onNavigateToReportIssue={() => {
                  // TODO: Navigate to report issue modal
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="HelpSupport"
            options={{ presentation: 'card', headerShown: false }}
          >
            {({ navigation }: any) => (
              <HelpSupportScreen onBack={() => navigation.goBack()} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="ProfileVerification"
            options={{ presentation: 'card', headerShown: false }}
          >
            {({ navigation }: any) => (
              <ProfileVerificationScreen
                onVerified={() => {
                  navigation.goBack();
                  // TODO: Update user profile to show verified badge
                }}
                onBack={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

