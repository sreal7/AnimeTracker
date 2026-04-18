import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BangumiCard } from '../components/BangumiCard';
import { getHomeBangumis } from '../services/mikanApi';
import { Bangumi } from '../types/bangumi';
import { RootStackParamList } from '../types/navigation';
import { useThemeColors, spacing } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const [bangumis, setBangumis] = useState<Bangumi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadBangumis();
  }, []);

  const loadBangumis = async () => {
    setIsLoading(true);
    try {
      const data = await getHomeBangumis();
      setBangumis(data);
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
    content: {
      padding: spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    header: {
      padding: spacing.md,
      backgroundColor: colors.background.card,
    },
    headerTitle: {
      color: colors.text.primary,
      fontWeight: '700',
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
        <Text variant="titleLarge" style={styles.headerTitle}>
          最新番剧
        </Text>
      </View>

      <FlatList
        data={bangumis}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BangumiCard
            bangumi={item}
            onPress={handleBangumiPress}
          />
        )}
        contentContainerStyle={styles.content}
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
      />
    </View>
  );
};