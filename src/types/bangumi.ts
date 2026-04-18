// 番剧类型定义

export interface Bangumi {
  id: number;
  name: string;
  cover: string;
  subtitleGroup: string;
  airDate: string;
  status: 'ongoing' | 'completed';
  description?: string;
  year?: number;
  season?: 'spring' | 'summer' | 'fall' | 'winter';
}

export type SeasonKey = 'spring' | 'summer' | 'fall' | 'winter';

export interface SeasonGroup {
  year: number;
  season: SeasonKey;
  title: string;
  data: Bangumi[];
}

export interface Episode {
  id: number;
  bangumiId: number;
  title: string;
  episodeNumber: string;
  publishTime: string;
  fileSize: string;
  magnetLink: string;
  torrentUrl: string;
  subtitleGroup: string;
}

export interface SubtitleGroup {
  id: number;
  name: string;
  icon?: string;
}

export interface Subscription {
  bangumiId: number;
  subscribedAt: string;
  notify: boolean;
}