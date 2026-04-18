import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { lightTheme } from './src/theme';
import { useSubscriptionStore } from './src/stores/subscriptionStore';

export default function App() {
  const loadSubscriptions = useSubscriptionStore((state) => state.loadSubscriptions);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <StatusBar style="auto" />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}