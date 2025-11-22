/**
 * Main application component
 *
 * Root component of the TaalMeet application.
 * This component sets up the app structure and initializes core services.
 *
 * @module App
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';

/**
 * Main App component
 *
 * This is the entry point of the application. It renders the navigation
 * structure and sets up the overall app layout.
 *
 * @returns Root app component
 */
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <ExpoStatusBar style="light" />
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
