// 番剧类型定义

// 星期类型 (0=周日, 1=周一, ..., 6=周六)
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAY_NAMES: Record<Weekday, string> = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
};

export const WEEKDAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0]; // 周一到周日

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
  weekday?: Weekday;
}

export type SeasonKey = 'spring' | 'summer' | 'fall' | 'winter';

export interface SeasonGroup {
  year: number;
  season: SeasonKey;
  title: string;
  data: Bangumi[];
}

// 按星期分组
export interface WeekdayGroup {
  weekday: Weekday;
  title: string;
  data: Bangumi[];
}

// 季度选择选项
export interface SeasonOption {
  year: number;
  season: SeasonKey;
  label: string;
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

// 剧集按字幕组分组
export interface EpisodeGroup {
  subtitleGroup: string;
  title: string;
  data: Episode[];
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