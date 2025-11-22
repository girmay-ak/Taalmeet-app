/**
 * Application entry point
 * 
 * This is the main entry point for the Expo application.
 * Expo handles the registration automatically.
 */

import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

// Register the root component with Expo
registerRootComponent(App);

