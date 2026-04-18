export type RootStackParamList = {
  MainTabs: undefined;
  BangumiDetail: { bangumiId: number; bangumiName: string };
  EpisodeList: { bangumiId: number };
};

export type MainTabParamList = {
  Home: undefined;
  Subscriptions: undefined;
  Search: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}