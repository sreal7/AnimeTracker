import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppTheme } from './src/theme';
import { useThemeStore } from './src/stores/themeStore';
import { useSubscriptionStore } from './src/stores/subscriptionStore';
import { requestNotificationPermissions } from './src/services/notificationService';

export default function App() {
  const loadTheme = useThemeStore((state) => state.loadTheme);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const loadSubscriptions = useSubscriptionStore((state) => state.loadSubscriptions);
  const theme = useAppTheme();

  useEffect(() => {
    const initApp = async () => {
      await loadTheme();
      await loadSubscriptions();
      await requestNotificationPermissions();
    };

    initApp();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}