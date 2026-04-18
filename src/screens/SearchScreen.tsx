import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Searchbar, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BangumiCard } from '../components/BangumiCard';
import { searchBangumis } from '../services/mikanApi';
import { Bangumi } from '../types/bangumi';
import { RootStackParamList } from '../types/navigation';
import { useThemeColors, spacing } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Bangumi[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const onSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchBangumis(query);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
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
    searchbar: {
      margin: spacing.md,
      backgroundColor: colors.background.card,
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
    hint: {
      padding: spacing.lg,
      textAlign: 'center',
      color: colors.text.muted,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="搜索番剧..."
        onChangeText={(text) => {
          setSearchQuery(text);
          onSearch(text);
        }}
        value={searchQuery}
        style={styles.searchbar}
      />

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BangumiCard
              bangumi={item}
              onPress={handleBangumiPress}
            />
          )}
          contentContainerStyle={styles.content}
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>未找到相关番剧</Text>
              </View>
            ) : (
              <Text style={styles.hint}>输入番剧名称开始搜索</Text>
            )
          }
        />
      )}
    </View>
  );
};