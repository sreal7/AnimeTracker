import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BangumiCard } from '../components/BangumiCard';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { RootStackParamList } from '../types/navigation';
import { useThemeColors, spacing } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SubscriptionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const subscribedBangumis = useSubscriptionStore((state) => state.subscribedBangumis);
  const loadSubscriptions = useSubscriptionStore((state) => state.loadSubscriptions);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleBangumiPress = (bangumi: any) => {
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
    countText: {
      color: colors.text.muted,
      marginTop: spacing.xs,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          我的订阅
        </Text>
        <Text variant="bodySmall" style={styles.countText}>
          共 {subscribedBangumis.length} 个番剧
        </Text>
      </View>

      <FlatList
        data={subscribedBangumis}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BangumiCard
            bangumi={item}
            onPress={handleBangumiPress}
          />
        )}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              暂无订阅，去首页订阅喜欢的番剧吧
            </Text>
          </View>
        }
      />
    </View>
  );
};