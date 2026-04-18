import { Bangumi, Episode, SubtitleGroup, SeasonGroup, SeasonKey } from '../types/bangumi';
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
  {
    id: 1,
    name: '葬送的芙莉莲',
    cover: 'https://myanimelist.net/images/anime/1015/138006l.jpg',
    subtitleGroup: 'ANIME/LoliHouse',
    airDate: '2024年10月',
    status: 'ongoing',
    description: '勇者一行人在打败魔王后，结束了长达十年的冒险旅程。精灵魔法使芙莉莲寿命长达千年，她将与人类的十年冒险视为短暂插曲，直到勇者辛美尔去世才真正理解人类。',
    year: 2024,
    season: 'fall',
  },
  {
    id: 2,
    name: '药屋少女的呢喃 第二季',
    cover: 'https://myanimelist.net/images/anime/1059/152815l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2025年1月',
    status: 'ongoing',
    description: '药师少女猫猫在后宫中运用医学知识解开各种谜团的故事。第二季继续讲述猫猫的宫廷冒险。',
    year: 2025,
    season: 'winter',
  },
  {
    id: 3,
    name: '迷宫饭',
    cover: 'https://myanimelist.net/images/anime/1711/142478l.jpg',
    subtitleGroup: 'ANIME/VCB-Studio',
    airDate: '2024年1月',
    status: 'ongoing',
    description: '冒险者莱俄斯和他的队伍在迷宫深处遭遇红龙，全员覆灭。莱俄斯的妹妹法琳被龙吃掉，为了救回妹妹，他们必须深入迷宫，用魔物做成料理来生存。',
    year: 2024,
    season: 'winter',
  },
  {
    id: 4,
    name: '地。 -关于地球的运动-',
    cover: 'https://myanimelist.net/images/anime/1749/145922l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024年10月',
    status: 'ongoing',
    description: '故事发生在P王国，一个异端思想会被处以火刑的时代。人们仰望星空，探索地球运动的真理。',
    year: 2024,
    season: 'fall',
  },
  {
    id: 5,
    name: '夏日重现',
    cover: 'https://myanimelist.net/images/anime/1120/120796l.jpg',
    subtitleGroup: 'ANIME/LoliHouse',
    airDate: '2022年4月',
    status: 'completed',
    description: '网代慎平听闻青梅竹马小舟潮逝世的消息，回到故乡和歌山市日都岛参加葬礼。却发现岛上流传着"影子"的传说。',
    year: 2022,
    season: 'spring',
  },
  {
    id: 6,
    name: '间谍过家家 第二季',
    cover: 'https://myanimelist.net/images/anime/1441/122795l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2023年10月',
    status: 'ongoing',
    description: '黄昏为了执行任务组建了临时家庭，却意外收获了真正的亲情。阿尼亚的各种搞笑冒险。',
    year: 2023,
    season: 'fall',
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
  },
  // 2026年春季番组（最新）
  {
    id: 9,
    name: '石纪元 第四季',
    cover: 'https://myanimelist.net/images/anime/1910/138282l.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2026年4月',
    status: 'ongoing',
    description: '千空与科学团队继续在石纪元世界中探索科技的奥秘。',
    year: 2026,
    season: 'spring',
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