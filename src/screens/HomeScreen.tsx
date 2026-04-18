import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BangumiCard } from '../components/BangumiCard';
import {
  getHomeBangumis,
  getAvailableSeasons,
  groupByWeekday,
} from '../services/mikanApi';
import {
  Bangumi,
  WeekdayGroup,
  SeasonOption,
} from '../types/bangumi';
import { RootStackParamList } from '../types/navigation';
import { useThemeColors, spacing } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();

  const [allBangumis, setAllBangumis] = useState<Bangumi[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<SeasonOption | null>(null);
  const [seasonOptions, setSeasonOptions] = useState<SeasonOption[]>([]);
  const [weekdayGroups, setWeekdayGroups] = useState<WeekdayGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadBangumis();
  }, []);

  // 设置默认季度为最新
  useEffect(() => {
    if (seasonOptions.length > 0 && !selectedSeason) {
      setSelectedSeason(seasonOptions[0]);
    }
  }, [seasonOptions, selectedSeason]);

  // 选择季度后，按星期分组
  useEffect(() => {
    if (selectedSeason && allBangumis.length > 0) {
      const filtered = allBangumis.filter(
        (b) => b.year === selectedSeason.year && b.season === selectedSeason.season
      );
      setWeekdayGroups(groupByWeekday(filtered));
    }
  }, [selectedSeason, allBangumis]);

  const loadBangumis = async () => {
    setIsLoading(true);
    try {
      const data = await getHomeBangumis();
      setAllBangumis(data);
      const options = getAvailableSeasons(data);
      setSeasonOptions(options);
      if (options.length > 0 && !selectedSeason) {
        setSelectedSeason(options[0]);
      }
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

  const handleSeasonSelect = (season: SeasonOption) => {
    setSelectedSeason(season);
    setMenuVisible(false);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.base,
    },
    header: {
      padding: spacing.md,
      backgroundColor: colors.background.card,
    },
    selectorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionHeader: {
      padding: spacing.sm,
      paddingLeft: spacing.md,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    sectionTitle: {
      color: colors.text.primary,
      fontWeight: '600',
    },
    sectionCount: {
      color: colors.text.secondary,
      fontSize: 12,
      marginLeft: spacing.sm,
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
      <View style={styles.header}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              icon="chevron-down"
              contentStyle={{ flexDirection: 'row-reverse' }}
            >
              {selectedSeason?.label || '选择季度'}
            </Button>
          }
        >
          {seasonOptions.map((option) => (
            <Menu.Item
              key={`${option.year}-${option.season}`}
              onPress={() => handleSeasonSelect(option)}
              title={option.label}
              titleStyle={{
                fontWeight: selectedSeason?.year === option.year &&
                           selectedSeason?.season === option.season ? '700' : '400',
              }}
            />
          ))}
        </Menu>
      </View>

      <SectionList
        sections={weekdayGroups}
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
            <Text variant="titleSmall" style={styles.sectionTitle}>
              {section.title}
            </Text>
            <Text style={styles.sectionCount}>
              {section.data.length} 部
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
            <Text style={styles.emptyText}>
              {selectedSeason ? `${selectedSeason.label} 暂无番剧` : '暂无番剧数据'}
            </Text>
          </View>
        }
        stickySectionHeadersEnabled
      />
    </View>
  );
};