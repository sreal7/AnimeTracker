import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BangumiCard } from '../components/BangumiCard';
import { getHomeSeasonGroups } from '../services/mikanApi';
import { Bangumi, SeasonGroup } from '../types/bangumi';
import { RootStackParamList } from '../types/navigation';
import { useThemeColors, spacing } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const [seasonGroups, setSeasonGroups] = useState<SeasonGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadBangumis();
  }, []);

  const loadBangumis = async () => {
    setIsLoading(true);
    try {
      const data = await getHomeSeasonGroups();
      setSeasonGroups(data);
    } catch (error) {
      console.error('Failed to load bangumis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadBangumis();
    setIsRefreshing(false);
  };

  const handleBangumiPress = (bangumi: Bangumi) => {
    navigation.navigate('BangumiDetail', {
      bangumiId: bangumi.id,
      bangumiName: bangumi.name,
    });
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
    sectionHeader: {
      padding: spacing.md,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    sectionTitle: {
      color: colors.text.primary,
      fontWeight: '700',
    },
    sectionCount: {
      color: colors.text.secondary,
      fontSize: 12,
      marginTop: 2,
    },
    itemContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      color: colors.text.secondary,
    },
  }), [colors]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={seasonGroups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContent}>
            <BangumiCard
              bangumi={item}
              onPress={handleBangumiPress}
            />
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {section.title}
            </Text>
            <Text style={styles.sectionCount}>
              {section.data.length} 部番剧
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无番剧数据</Text>
          </View>
        }
        stickySectionHeadersEnabled
      />
    </View>
  );
};