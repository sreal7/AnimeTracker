import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Episode } from '../types/bangumi';
import { useThemeColors, spacing, typography } from '../theme';

interface EpisodeItemProps {
  episode: Episode;
}

export const EpisodeItem: React.FC<EpisodeItemProps> = ({ episode }) => {
  const colors = useThemeColors();

  const styles = useMemo(() => StyleSheet.create({
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.card,
      borderRadius: 8,
      marginBottom: spacing.sm,
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border.secondary,
    },
    episodeInfo: {
      flex: 1,
    },
    title: {
      color: colors.text.primary,
      fontWeight: '500',
    },
    meta: {
      flexDirection: 'row',
      marginTop: spacing.xs,
    },
    metaItem: {
      color: colors.text.secondary,
      fontSize: typography.caption.fontSize,
      marginRight: spacing.sm,
    },
    actions: {
      flexDirection: 'row',
    },
    actionButton: {
      marginLeft: spacing.sm,
    },
  }), [colors]);

  const copyMagnet = () => {
    Alert.alert('复制成功', '磁力链接已复制到剪贴板');
    // 实际实现需要使用 Clipboard API
  };

  const downloadTorrent = () => {
    Alert.alert('下载', `即将下载: ${episode.title}`);
    // 实际实现需要打开下载链接或调用下载服务
  };

  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.7}>
      <View style={styles.episodeInfo}>
        <Text variant="bodyMedium" style={styles.title}>
          {episode.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.metaItem}>{episode.publishTime}</Text>
          <Text style={styles.metaItem}>{episode.fileSize}</Text>
          <Text style={styles.metaItem}>{episode.subtitleGroup}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <IconButton
          icon="link"
          size={20}
          iconColor={colors.primary[500]}
          style={styles.actionButton}
          onPress={copyMagnet}
        />
        <IconButton
          icon="download"
          size={20}
          iconColor={colors.accent}
          style={styles.actionButton}
          onPress={downloadTorrent}
        />
      </View>
    </TouchableOpacity>
  );
};