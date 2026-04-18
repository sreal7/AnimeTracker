import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';
import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { SubscriptionsScreen } from '../screens/SubscriptionsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { BangumiDetailScreen } from '../screens/BangumiDetailScreen';
import { useThemeColors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcons = {
  Home: 'home',
  Subscriptions: 'bookmark',
  Search: 'magnify',
  Settings: 'cog',
};

const MainTabs: React.FC = () => {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.muted,
        tabBarIcon: ({ color }) => (
          <IconButton
            icon={TabIcons[route.name as keyof typeof TabIcons]}
            iconColor={color}
            size={24}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '首页' }}
      />
      <Tab.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{ title: '订阅' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: '搜索' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: '设置' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const colors = useThemeColors();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background.card },
          headerTintColor: colors.text.primary,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BangumiDetail"
          component={BangumiDetailScreen}
          options={({ route }) => ({ title: route.params.bangumiName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};