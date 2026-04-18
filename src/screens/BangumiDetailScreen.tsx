import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, SectionList, Alert } from 'react-native';
import { Text, Surface, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EpisodeItem } from '../components/EpisodeItem';
import { getBangumiDetail, getBangumiEpisodes, groupEpisodesBySubtitleGroup } from '../services/mikanApi';
import { copyAllMagnetLinks } from '../services/downloadService';
import { notifySubscribedBangumi } from '../services/notificationService';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { Bangumi, Episode, EpisodeGroup } from '../types/bangumi';
import { RootStackParamList } from '../types/navigation';
import { useThemeColors, spacing } from '../theme';
import { Image } from 'expo-image';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BangumiDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();

  const bangumiId = route.params?.bangumiId;

  const [bangumi, setBangumi] = useState<Bangumi | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodeGroups, setEpisodeGroups] = useState<EpisodeGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coverError, setCoverError] = useState(false);

  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed(bangumiId));
  const subscribe = useSubscriptionStore((state) => state.subscribe);
  const unsubscribe = useSubscriptionStore((state) => state.unsubscribe);

  useEffect(() => {
    loadData();
  }, [bangumiId]);

  // 剧集按字幕组分组
  useEffect(() => {
    if (episodes.length > 0) {
      setEpisodeGroups(groupEpisodesBySubtitleGroup(episodes));
    }
  }, [episodes]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bangumiData, episodeData] = await Promise.all([
        getBangumiDetail(bangumiId),
        getBangumiEpisodes(bangumiId),
      ]);
      setBangumi(bangumiData);
      setEpisodes(episodeData);
      setCoverError(false);
    } catch (error) {
      console.error('Failed to load bangumi detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribeToggle = async () => {
    if (bangumi) {
      if (isSubscribed) {
        unsubscribe(bangumiId);
        Alert.alert('取消订阅', `已取消订阅 ${bangumi.name}`);
      } else {
        subscribe(bangumi);
        await notifySubscribedBangumi(bangumi);
      }
    }
  };

  const handleBatchCopy = () => {
    if (episodes.length > 0) {
      copyAllMagnetLinks(episodes);
    } else {
      Alert.alert('提示', '暂无剧集可复制');
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
      backgroundColor: colors.background.card,
    },
    coverContainer: {
      padding: spacing.md,
    },
    cover: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      backgroundColor: colors.background.elevated,
    },
    coverPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    coverPlaceholderText: {
      color: colors.text.muted,
    },
    infoSection: {
      padding: spacing.md,
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
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    button: {
      flex: 1,
    },
    episodesSection: {
      marginTop: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.background.card,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      color: colors.text.primary,
      fontWeight: '600',
    },
    episodeSectionHeader: {
      padding: spacing.sm,
      paddingLeft: spacing.md,
      backgroundColor: colors.background.elevated,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    episodeSectionTitle: {
      color: colors.text.primary,
      fontWeight: '600',
    },
    episodeSectionCount: {
      color: colors.text.secondary,
      fontSize: 12,
    },
    episodeListContent: {
      paddingBottom: spacing.sm,
    },
    emptyText: {
      color: colors.text.muted,
      textAlign: 'center',
      padding: spacing.lg,
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
        <Text style={{ color: colors.text.secondary }}>番剧信息不存在</Text>
      </View>
    );
  }

  const renderCover = () => {
    if (coverError || !bangumi.cover) {
      return (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={styles.coverPlaceholderText}>封面加载失败</Text>
        </View>
      );
    }
    return (
      <Image
        source={{ uri: bangumi.cover }}
        style={styles.cover}
        contentFit="cover"
        onError={() => setCoverError(true)}
        transition={200}
        cachePolicy="memory-disk"
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.coverContainer}>
          {renderCover()}
        </View>

        <View style={styles.infoSection}>
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

          <View style={styles.buttonRow}>
            <Button
              mode={isSubscribed ? 'outlined' : 'contained'}
              onPress={handleSubscribeToggle}
              style={styles.button}
              icon={isSubscribed ? 'bookmark-remove' : 'bookmark-plus'}
            >
              {isSubscribed ? '取消订阅' : '订阅番剧'}
            </Button>

            {episodes.length > 0 && (
              <Button
                mode="outlined"
                onPress={handleBatchCopy}
                style={styles.button}
                icon="content-copy"
              >
                批量复制
              </Button>
            )}
          </View>
        </View>
      </Surface>

      <View style={styles.episodesSection}>
        <View style={styles.sectionHeaderRow}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            剧集列表 ({episodes.length})
          </Text>
        </View>

        {episodeGroups.length > 0 ? (
          <SectionList
            sections={episodeGroups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <EpisodeItem episode={item} />}
            renderSectionHeader={({ section }) => (
              <View style={styles.episodeSectionHeader}>
                <Text variant="titleSmall" style={styles.episodeSectionTitle}>
                  {section.title}
                </Text>
                <Text style={styles.episodeSectionCount}>
                  {section.data.length} 集
                </Text>
              </View>
            )}
            scrollEnabled={false}
            contentContainerStyle={styles.episodeListContent}
            stickySectionHeadersEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>暂无剧集数据</Text>
        )}
      </View>
    </ScrollView>
  );
};