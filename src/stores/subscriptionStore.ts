import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription, Bangumi, Episode } from '../types/bangumi';

interface SubscriptionState {
  subscriptions: Map<number, Subscription>;
  subscribedBangumis: Bangumi[];
  newEpisodes: Episode[];

  subscribe: (bangumi: Bangumi) => void;
  unsubscribe: (bangumiId: number) => void;
  isSubscribed: (bangumiId: number) => boolean;
  loadSubscriptions: () => Promise<void>;
  addNewEpisode: (episode: Episode) => void;
  clearNewEpisodes: (bangumiId: number) => void;
}

const STORAGE_KEY = '@anime_subscriptions';

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: new Map(),
  subscribedBangumis: [],
  newEpisodes: [],

  subscribe: (bangumi: Bangumi) => {
    const subscription: Subscription = {
      bangumiId: bangumi.id,
      subscribedAt: new Date().toISOString(),
      notify: true,
    };

    set((state) => {
      const newSubscriptions = new Map(state.subscriptions);
      newSubscriptions.set(bangumi.id, subscription);
      const newSubscribedBangumis = [...state.subscribedBangumis, bangumi];

      // 保存到存储
      const dataToSave = Array.from(newSubscriptions.entries());
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

      return {
        subscriptions: newSubscriptions,
        subscribedBangumis: newSubscribedBangumis,
      };
    });
  },

  unsubscribe: (bangumiId: number) => {
    set((state) => {
      const newSubscriptions = new Map(state.subscriptions);
      newSubscriptions.delete(bangumiId);
      const newSubscribedBangumis = state.subscribedBangumis.filter(
        (b) => b.id !== bangumiId
      );

      // 保存到存储
      const dataToSave = Array.from(newSubscriptions.entries());
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

      return {
        subscriptions: newSubscriptions,
        subscribedBangumis: newSubscribedBangumis,
      };
    });
  },

  isSubscribed: (bangumiId: number) => {
    return get().subscriptions.has(bangumiId);
  },

  loadSubscriptions: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const entries = JSON.parse(data) as [number, Subscription][];
        const subscriptions = new Map(entries);
        set({ subscriptions });
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  },

  addNewEpisode: (episode: Episode) => {
    set((state) => {
      if (get().isSubscribed(episode.bangumiId)) {
        return {
          newEpisodes: [...state.newEpisodes, episode],
        };
      }
      return state;
    });
  },

  clearNewEpisodes: (bangumiId: number) => {
    set((state) => ({
      newEpisodes: state.newEpisodes.filter((e) => e.bangumiId !== bangumiId),
    }));
  },
}));