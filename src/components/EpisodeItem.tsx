import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Episode } from '../types/bangumi';
import { useThemeColors, spacing, typography } from '../theme';
import { copyMagnetLink, openTorrentDownload } from '../services/downloadService';

const localSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  xxs: 2,
};

const localTypography = {
  caption: { fontSize: 12 },
};

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
      marginBottom: localSpacing.sm,
      padding: localSpacing.sm,
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
      marginTop: localSpacing.xs,
    },
    metaItem: {
      color: colors.text.secondary,
      fontSize: localTypography.caption.fontSize,
      marginRight: localSpacing.sm,
    },
    actions: {
      flexDirection: 'row',
    },
    actionButton: {
      marginLeft: localSpacing.sm,
    },
  }), [colors]);

  const handleCopyMagnet = () => {
    copyMagnetLink(episode);
  };

  const handleDownload = () => {
    openTorrentDownload(episode);
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
          onPress={handleCopyMagnet}
        />
        <IconButton
          icon="download"
          size={20}
          iconColor={colors.accent}
          style={styles.actionButton}
          onPress={handleDownload}
        />
      </View>
    </TouchableOpacity>
  );
};