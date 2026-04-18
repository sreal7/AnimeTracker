import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { useThemeColors, spacing } from '../theme';

export const SettingsScreen: React.FC = () => {
  const colors = useThemeColors();

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
  }), [colors]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          通知设置
        </Text>
        <Divider />
        <TouchableOpacity style={styles.item}>
          <Text variant="bodyMedium" style={styles.itemTitle}>
            新剧集提醒
          </Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </Surface>

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          数据设置
        </Text>
        <Divider />
        <TouchableOpacity style={styles.item}>
          <View>
            <Text variant="bodyMedium" style={styles.itemTitle}>
              清除缓存
            </Text>
            <Text variant="bodySmall" style={styles.itemDesc}>
              清除已下载的番剧数据
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.item}>
          <View>
            <Text variant="bodyMedium" style={styles.itemTitle}>
              导出订阅
            </Text>
            <Text variant="bodySmall" style={styles.itemDesc}>
              导出订阅列表到文件
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
        <TouchableOpacity style={styles.item}>
          <View>
            <Text variant="bodyMedium" style={styles.itemTitle}>
              AnimeTracker
            </Text>
            <Text variant="bodySmall" style={styles.itemDesc}>
              番剧订阅追踪工具
            </Text>
          </View>
        </TouchableOpacity>
      </Surface>

      <Text variant="bodySmall" style={styles.version}>
        AnimeTracker v1.0.0
      </Text>
    </ScrollView>
  );
};