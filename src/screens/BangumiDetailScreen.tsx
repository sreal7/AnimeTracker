import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Surface, Button, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EpisodeItem } from '../components/EpisodeItem';
import { getBangumiDetail, getBangumiEpisodes } from '../services/mikanApi';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { Bangumi, Episode } from '../types/bangumi';
import { RootStackParamList } from '../types/navigation';
import { useThemeColors, spacing, typography } from '../theme';
import { Image } from 'expo-image';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BangumiDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();

  const bangumiId = route.params?.bangumiId;

  const [bangumi, setBangumi] = useState<Bangumi | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed(bangumiId));
  const subscribe = useSubscriptionStore((state) => state.subscribe);
  const unsubscribe = useSubscriptionStore((state) => state.unsubscribe);

  useEffect(() => {
    loadData();
  }, [bangumiId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bangumiData, episodeData] = await Promise.all([
        getBangumiDetail(bangumiId),
        getBangumiEpisodes(bangumiId),
      ]);
      setBangumi(bangumiData);
      setEpisodes(episodeData);
    } catch (error) {
      console.error('Failed to load bangumi detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribeToggle = () => {
    if (bangumi) {
      if (isSubscribed) {
        unsubscribe(bangumiId);
      } else {
        subscribe(bangumi);
      }
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.base,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      padding: spacing.md,
      backgroundColor: colors.background.card,
    },
    coverContainer: {
      height: 200,
      marginBottom: spacing.md,
    },
    cover: {
      width: '100%',
      height: 200,
      borderRadius: 12,
    },
    title: {
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    meta: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
    },
    metaItem: {
      color: colors.text.secondary,
      marginRight: spacing.md,
    },
    description: {
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    subscribeButton: {
      marginBottom: spacing.md,
    },
    episodesSection: {
      marginTop: spacing.md,
    },
    sectionTitle: {
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    episodeList: {
      marginTop: spacing.sm,
    },
  }), [colors]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!bangumi) {
    return (
      <View style={styles.loadingContainer}>
        <Text>番剧信息不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        {bangumi.cover && (
          <View style={styles.coverContainer}>
            <Image
              source={{ uri: bangumi.cover }}
              style={styles.cover}
              contentFit="cover"
            />
          </View>
        )}

        <Text variant="titleLarge" style={styles.title}>
          {bangumi.name}
        </Text>

        <View style={styles.meta}>
          <Text variant="bodySmall" style={styles.metaItem}>
            {bangumi.subtitleGroup}
          </Text>
          <Text variant="bodySmall" style={styles.metaItem}>
            {bangumi.airDate}
          </Text>
          <Text variant="bodySmall" style={styles.metaItem}>
            {bangumi.status === 'ongoing' ? '连载中' : '已完结'}
          </Text>
        </View>

        {bangumi.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {bangumi.description}
          </Text>
        )}

        <Button
          mode={isSubscribed ? 'outlined' : 'contained'}
          onPress={handleSubscribeToggle}
          style={styles.subscribeButton}
          icon={isSubscribed ? 'bookmark-remove' : 'bookmark-plus'}
        >
          {isSubscribed ? '取消订阅' : '订阅番剧'}
        </Button>
      </Surface>

      <View style={styles.episodesSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          剧集列表 ({episodes.length})
        </Text>

        <FlatList
          data={episodes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <EpisodeItem episode={item} />}
          scrollEnabled={false}
          contentContainerStyle={styles.episodeList}
        />
      </View>
    </ScrollView>
  );
};