/**
 * Home screen component
 * 
 * Main screen displayed when the app opens.
 * This is a placeholder component that will be implemented with
 * actual home screen functionality.
 * 
 * @module presentation/screens/HomeScreen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Home screen component
 * 
 * Placeholder for the main home screen of the app.
 * This will display user dashboard, recent activity, etc.
 * 
 * @returns Home screen component
 */
export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TaalMeet</Text>
      <Text style={styles.subtitle}>Your language exchange platform</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;

