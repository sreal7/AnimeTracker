import {
  Bangumi,
  Episode,
  SubtitleGroup,
  SeasonGroup,
  SeasonKey,
  Weekday,
  WeekdayGroup,
  EpisodeGroup,
  SeasonOption,
  WEEKDAY_NAMES,
  WEEKDAY_ORDER,
} from '../types/bangumi';
import axios from 'axios';

// 蜜柑计划API服务
const MIKAN_BASE_URL = 'https://mikanani.kas.pub';

// 季度名称映射
const seasonNames: Record<SeasonKey, string> = {
  spring: '春季',
  summer: '夏季',
  fall: '秋季',
  winter: '冬季',
};

// 根据年份和季度生成标题
export const getSeasonTitle = (year: number, season: SeasonKey): string => {
  return `${year}年${seasonNames[season]}番组`;
};

// 获取当前季度
export const getCurrentSeason = (): { year: number; season: SeasonKey } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  // 日本动画季度划分：冬季(1-3月)、春季(4-6月)、夏季(7-9月)、秋季(10-12月)
  if (month >= 0 && month <= 2) return { year, season: 'winter' };
  if (month >= 3 && month <= 5) return { year, season: 'spring' };
  if (month >= 6 && month <= 8) return { year, season: 'summer' };
  return { year, season: 'fall' };
};

// 获取所有可用季度选项
export const getAvailableSeasons = (bangumis: Bangumi[]): SeasonOption[] => {
  const seasonsMap: Map<string, { year: number; season: SeasonKey }> = new Map();

  bangumis.forEach((b) => {
    if (b.year && b.season) {
      const key = `${b.year}-${b.season}`;
      seasonsMap.set(key, { year: b.year, season: b.season });
    }
  });

  const seasonOrder: SeasonKey[] = ['winter', 'fall', 'summer', 'spring'];
  return Array.from(seasonsMap.values())
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return seasonOrder.indexOf(a.season) - seasonOrder.indexOf(b.season);
    })
    .map((s) => ({
      ...s,
      label: getSeasonTitle(s.year, s.season),
    }));
};

// 按星期分组番剧（周一到周日排序）
export const groupByWeekday = (bangumis: Bangumi[]): WeekdayGroup[] => {
  const groups: Map<Weekday, Bangumi[]> = new Map();

  // 初始化所有星期
  for (let i = 0; i <= 6; i++) {
    groups.set(i as Weekday, []);
  }

  bangumis.forEach((bangumi) => {
    if (bangumi.weekday !== undefined) {
      groups.get(bangumi.weekday)!.push(bangumi);
    }
  });

  // 按周一到周日排序返回
  return WEEKDAY_ORDER
    .map((weekday) => ({
      weekday,
      title: WEEKDAY_NAMES[weekday],
      data: groups.get(weekday)!,
    }))
    .filter((g) => g.data.length > 0);
};

// 按字幕组分组剧集
export const groupEpisodesBySubtitleGroup = (episodes: Episode[]): EpisodeGroup[] => {
  const groups: Map<string, Episode[]> = new Map();

  episodes.forEach((episode) => {
    const group = episode.subtitleGroup || '未知字幕组';
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(episode);
  });

  return Array.from(groups.entries())
    .map(([subtitleGroup, data]) => ({
      subtitleGroup,
      title: subtitleGroup,
      data,
    }))
    .sort((a, b) => a.subtitleGroup.localeCompare(b.subtitleGroup));
};

// 将番剧按季度分组
export const groupBySeason = (bangumis: Bangumi[]): SeasonGroup[] => {
  const groups: Map<string, SeasonGroup> = new Map();

  bangumis.forEach((bangumi) => {
    if (!bangumi.year || !bangumi.season) return;

    const key = `${bangumi.year}-${bangumi.season}`;
    if (!groups.has(key)) {
      groups.set(key, {
        year: bangumi.year,
        season: bangumi.season,
        title: getSeasonTitle(bangumi.year, bangumi.season),
        data: [],
      });
    }
    groups.get(key)!.data.push(bangumi);
  });

  // 按年份和季度排序（最新的在前）
  const seasonOrder: SeasonKey[] = ['winter', 'fall', 'summer', 'spring'];
  return Array.from(groups.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return seasonOrder.indexOf(a.season) - seasonOrder.indexOf(b.season);
  });
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// 模拟数据（默认使用）
const mockBangumis: Bangumi[] = [
  // 2026年春季番组（最新）
  {
    id: 9,
    name: '石纪元 新石纪 第四季',
    cover: 'https://myanimelist.net/images/anime/1910/138282l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2026年4月',
    status: 'ongoing',
    description: '千空与科学团队继续在石纪元世界中探索科技的奥秘。',
    year: 2026,
    season: 'spring',
    weekday: 4, // 周四
  },
  {
    id: 10,
    name: '从零开始的异世界生活 第三季',
    cover: 'https://myanimelist.net/images/anime/1172/138006l.jpg',
    subtitleGroup: 'ANIME/LoliHouse',
    airDate: '2026年4月',
    status: 'ongoing',
    description: '昴继续在异世界中奋斗，面对新的挑战和考验。',
    year: 2026,
    season: 'spring',
    weekday: 3, // 周三
  },
  {
    id: 11,
    name: '关于我转生变成史莱姆这档事 第三季',
    cover: 'https://myanimelist.net/images/anime/1170/130292l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2026年4月',
    status: 'ongoing',
    description: '利姆露继续壮大他的魔国联邦，面对更多强敌。',
    year: 2026,
    season: 'spring',
    weekday: 2, // 周二
  },
  {
    id: 14,
    name: '我推的孩子 第二季',
    cover: 'https://myanimelist.net/images/anime/1880/142928l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2026年4月',
    status: 'ongoing',
    description: '阿奎和阿利亚继续在演艺圈中成长的故事。',
    year: 2026,
    season: 'spring',
    weekday: 6, // 周六
  },
  {
    id: 15,
    name: '电锯人 第二季',
    cover: 'https://myanimelist.net/images/anime/1800/142822l.jpg',
    subtitleGroup: 'ANIME/VCB-Studio',
    airDate: '2026年4月',
    status: 'ongoing',
    description: '电次继续与恶魔战斗，更多黑暗故事。',
    year: 2026,
    season: 'spring',
    weekday: 1, // 周一
  },
  {
    id: 16,
    name: '蓝色监狱 第二季',
    cover: 'https://myanimelist.net/images/anime/1700/140022l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2026年4月',
    status: 'ongoing',
    description: '洁士郎继续在蓝色监狱中追求成为世界第一前锋。',
    year: 2026,
    season: 'spring',
    weekday: 5, // 周五
  },
  // 2025年冬季番组
  {
    id: 2,
    name: '药屋少女的呢喃 第二季',
    cover: 'https://myanimelist.net/images/anime/1059/152815l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2025年1月',
    status: 'ongoing',
    description: '药师少女猫猫在后宫中运用医学知识解开各种谜团的故事。',
    year: 2025,
    season: 'winter',
    weekday: 6, // 周六
  },
  {
    id: 3,
    name: '迷宫饭',
    cover: 'https://myanimelist.net/images/anime/1711/142478l.jpg',
    subtitleGroup: 'ANIME/VCB-Studio',
    airDate: '2025年1月',
    status: 'ongoing',
    description: '冒险者莱俄斯深入迷宫，用魔物做成料理来生存。',
    year: 2025,
    season: 'winter',
    weekday: 4, // 周四
  },
  // 2025年秋季番组
  {
    id: 12,
    name: '鬼灭之刃 柱训练篇',
    cover: 'https://myanimelist.net/images/anime/1000/142822l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2025年10月',
    status: 'ongoing',
    description: '柱们进行特训，为最终决战做准备。',
    year: 2025,
    season: 'fall',
    weekday: 0, // 周日
  },
  // 2025年春季番组
  {
    id: 13,
    name: '咒术回战 第二季 后半',
    cover: 'https://myanimelist.net/images/anime/1120/138298l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2025年4月',
    status: 'ongoing',
    description: '咒术师与诅咒师的战斗进入白热化阶段。',
    year: 2025,
    season: 'spring',
    weekday: 4, // 周四
  },
  // 2024年秋季番组
  {
    id: 1,
    name: '葬送的芙莉莲',
    cover: 'https://myanimelist.net/images/anime/1015/138006l.jpg',
    subtitleGroup: 'ANIME/LoliHouse',
    airDate: '2024年10月',
    status: 'ongoing',
    description: '勇者一行人在打败魔王后，结束了长达十年的冒险旅程。',
    year: 2024,
    season: 'fall',
    weekday: 5, // 周五
  },
  {
    id: 4,
    name: '地。 -关于地球的运动-',
    cover: 'https://myanimelist.net/images/anime/1749/145922l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024年10月',
    status: 'ongoing',
    description: '故事发生在P王国，人们仰望星空，探索地球运动的真理。',
    year: 2024,
    season: 'fall',
    weekday: 0, // 周日
  },
  {
    id: 8,
    name: '进击的巨人 最终季',
    cover: 'https://myanimelist.net/images/anime/10/47347l.jpg',
    subtitleGroup: 'VCB-Studio',
    airDate: '2024年',
    status: 'completed',
    description: '人类与巨人的最终决战，艾伦与调查兵团的命运将如何落幕。',
    year: 2024,
    season: 'fall',
    weekday: 1, // 周一
  },
  // 2024年冬季番组
  {
    id: 17,
    name: '物语系列 OFF & MONSTER Season',
    cover: 'https://myanimelist.net/images/anime/1900/142298l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024年1月',
    status: 'ongoing',
    description: '阿良良木历的物语继续上演。',
    year: 2024,
    season: 'winter',
    weekday: 2, // 周二
  },
  // 2023年秋季番组
  {
    id: 6,
    name: '间谍过家家 第二季',
    cover: 'https://myanimelist.net/images/anime/1441/122795l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2023年10月',
    status: 'ongoing',
    description: '黄昏为了执行任务组建了临时家庭，却意外收获了真正的亲情。',
    year: 2023,
    season: 'fall',
    weekday: 6, // 周六
  },
  // 2022年春季番组
  {
    id: 5,
    name: '夏日重现',
    cover: 'https://myanimelist.net/images/anime/1120/120796l.jpg',
    subtitleGroup: 'ANIME/LoliHouse',
    airDate: '2022年4月',
    status: 'completed',
    description: '网代慎平回到故乡日都岛参加葬礼，却发现岛上流传着"影子"的传说。',
    year: 2022,
    season: 'spring',
    weekday: 5, // 周五
  },
  {
    id: 7,
    name: '辉夜大小姐想让我告白 第四季',
    cover: 'https://myanimelist.net/images/anime/1935/93606l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2022年4月',
    status: 'completed',
    description: '学生会长白银御行与副会长四宫辉夜之间的恋爱头脑战继续上演。',
    year: 2022,
    season: 'spring',
    weekday: 6, // 周六
  },
];

const mockEpisodes: Record<number, Episode[]> = {
  1: [
    { id: 101, bangumiId: 1, title: '葬送的芙莉莲 第01话 「旅行的开端」', episodeNumber: '01', publishTime: '2024-10-11', fileSize: '1.2GB', magnetLink: 'magnet:?xt=urn:btih:a1b2c3d4e5f6', torrentUrl: '', subtitleGroup: 'ANIME' },
    { id: 102, bangumiId: 1, title: '葬送的芙莉莲 第02话 「不再是配角」', episodeNumber: '02', publishTime: '2024-10-18', fileSize: '1.1GB', magnetLink: 'magnet:?xt=urn:btih:b2c3d4e5f6a1', torrentUrl: '', subtitleGroup: 'ANIME' },
    { id: 103, bangumiId: 1, title: '葬送的芙莉莲 第03话 「魔法的作用」', episodeNumber: '03', publishTime: '2024-10-25', fileSize: '1.3GB', magnetLink: 'magnet:?xt=urn:btih:c3d4e5f6a1b2', torrentUrl: '', subtitleGroup: 'ANIME' },
    { id: 104, bangumiId: 1, title: '葬送的芙莉莲 第04话 「未来的路」', episodeNumber: '04', publishTime: '2024-11-01', fileSize: '1.2GB', magnetLink: 'magnet:?xt=urn:btih:d4e5f6a1b2c3', torrentUrl: '', subtitleGroup: 'LoliHouse' },
  ],
  2: [
    { id: 201, bangumiId: 2, title: '药屋少女的呢喃 S2 第01话', episodeNumber: '01', publishTime: '2025-01-10', fileSize: '1.0GB', magnetLink: 'magnet:?xt=urn:btih:e5f6a1b2c3d4', torrentUrl: '', subtitleGroup: 'ANIME' },
    { id: 202, bangumiId: 2, title: '药屋少女的呢喃 S2 第02话', episodeNumber: '02', publishTime: '2025-01-17', fileSize: '1.1GB', magnetLink: 'magnet:?xt=urn:btih:f6a1b2c3d4e5', torrentUrl: '', subtitleGroup: 'ANIME' },
  ],
  3: [
    { id: 301, bangumiId: 3, title: '迷宫饭 第01话 「 Dungeon Meshi」', episodeNumber: '01', publishTime: '2024-01-04', fileSize: '1.5GB', magnetLink: 'magnet:?xt=urn:btih:a1b2c3d4', torrentUrl: '', subtitleGroup: 'VCB-Studio' },
    { id: 302, bangumiId: 3, title: '迷宫饭 第02话', episodeNumber: '02', publishTime: '2024-01-11', fileSize: '1.4GB', magnetLink: 'magnet:?xt=urn:btih:b2c3d4a1', torrentUrl: '', subtitleGroup: 'VCB-Studio' },
    { id: 303, bangumiId: 3, title: '迷宫饭 第03话', episodeNumber: '03', publishTime: '2024-01-18', fileSize: '1.3GB', magnetLink: 'magnet:?xt=urn:btih:c3d4a1b2', torrentUrl: '', subtitleGroup: 'ANIME' },
  ],
  4: [
    { id: 401, bangumiId: 4, title: '地。 第01话', episodeNumber: '01', publishTime: '2024-10-05', fileSize: '1.2GB', magnetLink: 'magnet:?xt=urn:btih:d4a1b2c3', torrentUrl: '', subtitleGroup: 'ANIME' },
  ],
  5: [
    { id: 501, bangumiId: 5, title: '夏日重现 第01话', episodeNumber: '01', publishTime: '2022-04-14', fileSize: '1.1GB', magnetLink: 'magnet:?xt=urn:btih:e1b2c3d4', torrentUrl: '', subtitleGroup: 'LoliHouse' },
    { id: 502, bangumiId: 5, title: '夏日重现 第02话', episodeNumber: '02', publishTime: '2022-04-21', fileSize: '1.2GB', magnetLink: 'magnet:?xt=urn:btih:f2c3d4a1', torrentUrl: '', subtitleGroup: 'LoliHouse' },
  ],
  6: [
    { id: 601, bangumiId: 6, title: '间谍过家家 S2 第01话', episodeNumber: '01', publishTime: '2023-10-07', fileSize: '0.9GB', magnetLink: 'magnet:?xt=urn:btih:a3d4e5f6', torrentUrl: '', subtitleGroup: 'ANIME' },
  ],
  7: [
    { id: 701, bangumiId: 7, title: '辉夜大小姐 S4 第01话', episodeNumber: '01', publishTime: '2022-04-01', fileSize: '1.0GB', magnetLink: 'magnet:?xt=urn:btih:b4e5f6a1', torrentUrl: '', subtitleGroup: 'ANIME' },
  ],
  8: [
    { id: 801, bangumiId: 8, title: '进击的巨人 最终季 Part1', episodeNumber: '完结', publishTime: '2024-11', fileSize: '2.5GB', magnetLink: 'magnet:?xt=urn:btih:c5f6a1b2', torrentUrl: '', subtitleGroup: 'VCB-Studio' },
  ],
};

// 获取首页番剧列表（使用模拟数据）
export const getHomeBangumis = async (): Promise<Bangumi[]> => {
  // 尝试获取真实数据，失败则使用模拟数据
  try {
    const response = await axios.get(`${MIKAN_BASE_URL}/RSS/MyRSS`, {
      timeout: 5000,
    });

    // 如果成功获取数据，解析RSS
    if (response.data && response.data.includes('<item>')) {
      const items = response.data.match(/<item>([\s\S]*?)<\/item>/g) || [];
      if (items.length > 0) {
        const bangumis: Bangumi[] = [];
        const seenIds = new Set<number>();

        for (const item of items.slice(0, 20)) {
          const titleMatch = item.match(/<title>(.*?)<\/title>/);
          const linkMatch = item.match(/<link>(.*?)<\/link>/);
          const bangumiIdMatch = linkMatch?.[1]?.match(/bangumiId=(\d+)/);

          if (bangumiIdMatch) {
            const id = parseInt(bangumiIdMatch[1]);
            if (!seenIds.has(id)) {
              seenIds.add(id);
              bangumis.push({
                id,
                name: titleMatch ? titleMatch[1].replace(/\[.*?\]/g, '').trim() : '未知番剧',
                cover: '',
                subtitleGroup: '多字幕组',
                airDate: '',
                status: 'ongoing',
              });
            }
          }
        }

        if (bangumis.length > 0) {
          return bangumis;
        }
      }
    }
  } catch (error) {
    console.log('Using mock data due to API unavailable');
  }

  // 返回模拟数据
  return mockBangumis;
};

// 获取首页番剧分组列表（按季度分组）
export const getHomeSeasonGroups = async (): Promise<SeasonGroup[]> => {
  const bangumis = await getHomeBangumis();
  return groupBySeason(bangumis);
};

// 获取番剧详情
export const getBangumiDetail = async (id: number): Promise<Bangumi> => {
  // 从模拟数据查找
  const bangumi = mockBangumis.find((b) => b.id === id);
  if (bangumi) {
    return bangumi;
  }

  // 返回默认数据
  return {
    id,
    name: `番剧 ${id}`,
    cover: '',
    subtitleGroup: '未知字幕组',
    airDate: '',
    status: 'ongoing',
  };
};

// 获取番剧剧集列表
export const getBangumiEpisodes = async (bangumiId: number): Promise<Episode[]> => {
  // 返回模拟剧集数据
  return mockEpisodes[bangumiId] || [
    {
      id: bangumiId * 100 + 1,
      bangumiId,
      title: '第01话',
      episodeNumber: '01',
      publishTime: '2024-01-01',
      fileSize: '1.0GB',
      magnetLink: 'magnet:?xt=urn:btih:mockdata',
      torrentUrl: '',
      subtitleGroup: 'ANIME',
    },
    {
      id: bangumiId * 100 + 2,
      bangumiId,
      title: '第02话',
      episodeNumber: '02',
      publishTime: '2024-01-08',
      fileSize: '1.1GB',
      magnetLink: 'magnet:?xt=urn:btih:mockdata2',
      torrentUrl: '',
      subtitleGroup: 'ANIME',
    },
  ];
};

// 搜索番剧
export const searchBangumis = async (keyword: string): Promise<Bangumi[]> => {
  if (!keyword.trim()) {
    return [];
  }

  // 在模拟数据中搜索
  return mockBangumis.filter(
    (b) =>
      b.name.toLowerCase().includes(keyword.toLowerCase()) ||
      b.description?.toLowerCase().includes(keyword.toLowerCase()) ||
      b.subtitleGroup.toLowerCase().includes(keyword.toLowerCase())
  );
};

// 获取字幕组列表
export const getSubtitleGroups = async (): Promise<SubtitleGroup[]> => {
  return [
    { id: 1, name: 'ANIME' },
    { id: 2, name: 'LoliHouse' },
    { id: 3, name: 'VCB-Studio' },
    { id: 4, name: '悠哈C9' },
    { id: 5, name: '喵萌奶茶屋' },
  ];
};

// 获取RSS订阅链接
export const getRSSUrl = (bangumiId: number): string => {
  return `${MIKAN_BASE_URL}/RSS/Bangumi?bangumiId=${bangumiId}`;
};