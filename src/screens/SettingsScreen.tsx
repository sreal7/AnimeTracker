import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { useThemeStore } from '../stores/themeStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { requestNotificationPermissions, cancelAllNotifications } from '../services/notificationService';
import { useThemeColors, spacing } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsScreen: React.FC = () => {
  const colors = useThemeColors();
  const { isDarkMode, toggleTheme, loadTheme } = useThemeStore();
  const subscribedBangumis = useSubscriptionStore((state) => state.subscribedBangumis);
  const [notifyEnabled, setNotifyEnabled] = React.useState(true);

  useEffect(() => {
    loadTheme();
    loadNotifySetting();
  }, []);

  const loadNotifySetting = async () => {
    const saved = await AsyncStorage.getItem('@anime_notify');
    setNotifyEnabled(saved !== 'false');
  };

  const toggleNotify = async (value: boolean) => {
    setNotifyEnabled(value);
    await AsyncStorage.setItem('@anime_notify', value ? 'true' : 'false');

    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        setNotifyEnabled(false);
        await AsyncStorage.setItem('@anime_notify', 'false');
      }
    } else {
      await cancelAllNotifications();
    }
  };

  const clearCache = async () => {
    await AsyncStorage.clear();
    Alert.alert('清除成功', '缓存已清除');
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.base,
    },
    content: {
      padding: spacing.md,
    },
    section: {
      marginBottom: spacing.md,
      padding: spacing.md,
      borderRadius: 12,
      backgroundColor: colors.background.card,
    },
    sectionTitle: {
      color: colors.text.primary,
      marginBottom: spacing.sm,
      fontWeight: '600',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
    },
    itemInfo: {
      flex: 1,
    },
    itemTitle: {
      color: colors.text.primary,
    },
    itemDesc: {
      color: colors.text.muted,
      marginTop: spacing.xs,
    },
    arrow: {
      color: colors.text.muted,
    },
    version: {
      color: colors.text.muted,
      textAlign: 'center',
      marginTop: spacing.lg,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.sm,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      color: colors.primary[500],
      fontWeight: '700',
    },
    statLabel: {
      color: colors.text.secondary,
    },
  }), [colors]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.section}>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text variant="titleLarge" style={styles.statNumber}>
              {subscribedBangumis.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              订阅番剧
            </Text>
          </View>
        </View>
      </Surface>

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          显示设置
        </Text>
        <Divider />
        <View style={styles.item}>
          <View style={styles.itemInfo}>
            <Text variant="bodyMedium" style={styles.itemTitle}>
              夜间模式
            </Text>
            <Text variant="bodySmall" style={styles.itemDesc}>
              切换深色主题，减少屏幕亮度
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor={isDarkMode ? colors.primary[500] : colors.primary[300]}
          />
        </View>
      </Surface>

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          通知设置
        </Text>
        <Divider />
        <View style={styles.item}>
          <View style={styles.itemInfo}>
            <Text variant="bodyMedium" style={styles.itemTitle}>
              新剧集提醒
            </Text>
            <Text variant="bodySmall" style={styles.itemDesc}>
              订阅的番剧有新剧集时推送通知
            </Text>
          </View>
          <Switch
            value={notifyEnabled}
            onValueChange={toggleNotify}
            thumbColor={notifyEnabled ? colors.accent : colors.primary[300]}
          />
        </View>
      </Surface>

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          数据设置
        </Text>
        <Divider />
        <TouchableOpacity style={styles.item} onPress={clearCache}>
          <View style={styles.itemInfo}>
            <Text variant="bodyMedium" style={styles.itemTitle}>
              清除缓存
            </Text>
            <Text variant="bodySmall" style={styles.itemDesc}>
              清除订阅和设置数据
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </Surface>

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          关于
        </Text>
        <Divider />
        <View style={styles.item}>
          <View style={styles.itemInfo}>
            <Text variant="bodyMedium" style={styles.itemTitle}>
              AnimeTracker
            </Text>
            <Text variant="bodySmall" style={styles.itemDesc}>
              番剧订阅追踪工具 - 基于蜜柑计划
            </Text>
          </View>
        </View>
      </Surface>

      <Text variant="bodySmall" style={styles.version}>
        AnimeTracker v1.0.0
      </Text>
    </ScrollView>
  );
};

import { Alert } from 'react-native';