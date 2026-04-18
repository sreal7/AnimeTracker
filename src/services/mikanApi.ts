import { Bangumi, Episode, SubtitleGroup } from '../types/bangumi';
import axios from 'axios';

// 蜜柑计划API服务
const MIKAN_BASE_URL = 'https://mikanani.kas.pub';

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
    cover: 'https://lain.bgm.tv/pic/cover/l/79/9d/404399_3lLLL.jpg',
    subtitleGroup: 'ANIME/LoliHouse',
    airDate: '2024年10月',
    status: 'ongoing',
    description: '勇者一行人在打败魔王后，结束了长达十年的冒险旅程。精灵魔法使芙莉莲寿命长达千年，她将与人类的十年冒险视为短暂插曲，直到勇者辛美尔去世才真正理解人类。',
  },
  {
    id: 2,
    name: '药屋少女的呢喃 第二季',
    cover: 'https://lain.bgm.tv/pic/cover/l/bd/d8/422578_r2kKk.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2025年1月',
    status: 'ongoing',
    description: '药师少女猫猫在后宫中运用医学知识解开各种谜团的故事。第二季继续讲述猫猫的宫廷冒险。',
  },
  {
    id: 3,
    name: '迷宫饭',
    cover: 'https://lain.bgm.tv/pic/cover/l/d1/62/424646_rKCJk.jpg',
    subtitleGroup: 'ANIME/VCB-Studio',
    airDate: '2024年1月',
    status: 'ongoing',
    description: '冒险者莱俄斯和他的队伍在迷宫深处遭遇红龙，全员覆灭。莱俄斯的妹妹法琳被龙吃掉，为了救回妹妹，他们必须深入迷宫，用魔物做成料理来生存。',
  },
  {
    id: 4,
    name: '地。 -关于地球的运动-',
    cover: 'https://lain.bgm.tv/pic/cover/l/f7/73/466399_j7jJj.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024年10月',
    status: 'ongoing',
    description: '故事发生在P王国，一个异端思想会被处以火刑的时代。人们仰望星空，探索地球运动的真理。',
  },
  {
    id: 5,
    name: '夏日重现',
    cover: 'https://lain.bgm.tv/pic/cover/l/c5/53/354964_6Z61O.jpg',
    subtitleGroup: 'ANIME/LoliHouse',
    airDate: '2022年4月',
    status: 'completed',
    description: '网代慎平听闻青梅竹马小舟潮逝世的消息，回到故乡和歌山市日都岛参加葬礼。却发现岛上流传着"影子"的传说。',
  },
  {
    id: 6,
    name: '间谍过家家 第二季',
    cover: 'https://lain.bgm.tv/pic/cover/l/5a/b4/378802_7Z777.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2023年10月',
    status: 'ongoing',
    description: '黄昏为了执行任务组建了临时家庭，却意外收获了真正的亲情。阿尼亚的各种搞笑冒险。',
  },
  {
    id: 7,
    name: '辉夜大小姐想让我告白 第四季',
    cover: 'https://lain.bgm.tv/pic/cover/l/4e/98/342859_4yYyy.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2022年4月',
    status: 'completed',
    description: '学生会长白银御行与副会长四宫辉夜之间的恋爱头脑战继续上演。',
  },
  {
    id: 8,
    name: '进击的巨人 最终季',
    cover: 'https://lain.bgm.tv/pic/cover/l/e2/e9/468292_92y2Y.jpg',
    subtitleGroup: 'VCB-Studio',
    airDate: '2024年',
    status: 'completed',
    description: '人类与巨人的最终决战，艾伦与调查兵团的命运将如何落幕。',
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