import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Bangumi } from '../types/bangumi';
import { useThemeColors } from '../theme';
import { Image } from 'expo-image';
import { useSubscriptionStore } from '../stores/subscriptionStore';

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  xxs: 2,
};

const typography = {
  caption: { fontSize: 12 },
};

interface BangumiCardProps {
  bangumi: Bangumi;
  onPress: (bangumi: Bangumi) => void;
}

export const BangumiCard: React.FC<BangumiCardProps> = ({ bangumi, onPress }) => {
  const colors = useThemeColors();
  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed(bangumi.id));
  const [coverError, setCoverError] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.background.card,
      borderRadius: 12,
      marginBottom: spacing.sm,
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    pressed: {
      backgroundColor: colors.background.elevated,
    },
    cover: {
      width: 80,
      height: 120,
      borderRadius: 8,
      backgroundColor: colors.background.elevated,
    },
    coverPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    coverPlaceholderText: {
      color: colors.text.muted,
      fontSize: 10,
    },
    info: {
      flex: 1,
      marginLeft: spacing.md,
    },
    title: {
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    meta: {
      flexDirection: 'row',
      marginBottom: spacing.xs,
    },
    metaItem: {
      color: colors.text.secondary,
      fontSize: typography.caption.fontSize,
      marginRight: spacing.sm,
    },
    description: {
      color: colors.text.muted,
      fontSize: typography.caption.fontSize,
    },
    subscribeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    subscribeText: {
      color: colors.primary[500],
      fontSize: typography.caption.fontSize,
      marginLeft: spacing.xxs,
    },
  }), [colors]);

  const renderCover = () => {
    if (coverError) {
      return (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={styles.coverPlaceholderText}>暂无封面</Text>
        </View>
      );
    }
    return (
      <Image
        source={{ uri: bangumi.cover || 'https://via.placeholder.com/80x120/2d2d2d/e0e0e0?text=No+Image' }}
        style={styles.cover}
        contentFit="cover"
        onError={() => setCoverError(true)}
        transition={200}
        cachePolicy="memory-disk"
      />
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(bangumi)}
      activeOpacity={0.7}
    >
      {renderCover()}

      <View style={styles.info}>
        <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
          {bangumi.name}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.metaItem}>{bangumi.subtitleGroup}</Text>
          <Text style={styles.metaItem}>{bangumi.airDate}</Text>
          <Text style={styles.metaItem}>
            {bangumi.status === 'ongoing' ? '连载' : '完结'}
          </Text>
        </View>

        {bangumi.description && (
          <Text style={styles.description} numberOfLines={2}>
            {bangumi.description}
          </Text>
        )}

        {isSubscribed && (
          <View style={styles.subscribeBadge}>
            <IconButton
              icon="bookmark"
              size={16}
              iconColor={colors.primary[500]}
            />
            <Text style={styles.subscribeText}>已订阅</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};