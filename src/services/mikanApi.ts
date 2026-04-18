import { Bangumi, Episode, SubtitleGroup } from '../types/bangumi';
import axios from 'axios';

// 蜜柑计划API服务
// 注意：实际使用时需要配置正确的域名和解析HTML

const MIKAN_BASE_URL = 'https://mikanani.kas.pub';

// 模拟数据（实际需要从网站解析）
const mockBangumis: Bangumi[] = [
  {
    id: 1,
    name: '葬送的芙莉莲',
    cover: 'https://example.com/frieren.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024-01',
    status: 'ongoing',
    description: '勇者辛美尔死后，精灵魔法使芙莉莲踏上寻找理解人类之旅',
  },
  {
    id: 2,
    name: '药屋少女的呢喃',
    cover: 'https://example.com/kusuriya.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024-01',
    status: 'ongoing',
    description: '药师少女猫猫在后宫中解开各种谜团',
  },
  {
    id: 3,
    name: '迷宫饭',
    cover: 'https://example.com/dungeon.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024-01',
    status: 'ongoing',
    description: '冒险者们在迷宫中用魔物做成料理',
  },
];

const mockEpisodes: Episode[] = [
  {
    id: 101,
    bangumiId: 1,
    title: '葬送的芙莉莲 第01话',
    episodeNumber: '01',
    publishTime: '2024-01-05',
    fileSize: '1.2GB',
    magnetLink: 'magnet:?xt=urn:btih:example1',
    torrentUrl: 'https://example.com/frieren01.torrent',
    subtitleGroup: 'ANIME',
  },
  {
    id: 102,
    bangumiId: 1,
    title: '葬送的芙莉莲 第02话',
    episodeNumber: '02',
    publishTime: '2024-01-12',
    fileSize: '1.1GB',
    magnetLink: 'magnet:?xt=urn:btih:example2',
    torrentUrl: 'https://example.com/frieren02.torrent',
    subtitleGroup: 'ANIME',
  },
];

// 获取首页番剧列表
export const getHomeBangumis = async (): Promise<Bangumi[]> => {
  // 实际实现需要解析RSS或HTML
  // 这里返回模拟数据
  return mockBangumis;
};

// 获取番剧详情
export const getBangumiDetail = async (id: number): Promise<Bangumi> => {
  return mockBangumis.find((b) => b.id === id) || mockBangumis[0];
};

// 获取番剧剧集列表
export const getBangumiEpisodes = async (bangumiId: number): Promise<Episode[]> => {
  return mockEpisodes.filter((e) => e.bangumiId === bangumiId);
};

// 搜索番剧
export const searchBangumis = async (keyword: string): Promise<Bangumi[]> => {
  return mockBangumis.filter(
    (b) => b.name.includes(keyword) || b.description?.includes(keyword)
  );
};

// 获取字幕组列表
export const getSubtitleGroups = async (): Promise<SubtitleGroup[]> => {
  return [
    { id: 1, name: 'ANIME' },
    { id: 2, name: 'LoliHouse' },
    { id: 3, name: 'VCB-Studio' },
  ];
};

// 获取RSS订阅链接
export const getRSSUrl = (bangumiId: number): string => {
  return `${MIKAN_BASE_URL}/RSS/Bangumi?bangumiId=${bangumiId}`;
};