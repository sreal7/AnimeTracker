import { Bangumi, Episode, SubtitleGroup } from '../types/bangumi';
import axios from 'axios';

// 蜜柑计划API服务
const MIKAN_BASE_URL = 'https://mikanani.kas.pub';
const MIKAN_API_URL = 'https://mikanani.kas.pub/api';

// RSS解析器
const parseRSS = (xml: string): { items: any[] } => {
  const items: any[] = [];

  // 简单的XML解析（实际建议使用fast-xml-parser等库）
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const item of itemMatches) {
    const titleMatch = item.match(/<title>(.*?)<\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const descMatch = item.match(/<description>(.*?)<\/description>/);
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    const enclosureMatch = item.match(/<enclosure[^>]*url="([^"]*)"[^>]*length="([^"]*)"/);

    items.push({
      title: titleMatch ? titleMatch[1] : '',
      link: linkMatch ? linkMatch[1] : '',
      description: descMatch ? descMatch[1] : '',
      pubDate: pubDateMatch ? pubDateMatch[1] : '',
      torrentUrl: enclosureMatch ? enclosureMatch[1] : '',
      fileSize: enclosureMatch ? formatFileSize(parseInt(enclosureMatch[2])) : '',
    });
  }

  return { items };
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// 从标题解析剧集信息
const parseEpisodeInfo = (title: string): { episodeNumber: string; subtitleGroup: string } => {
  // 常见格式: [字幕组] 番剧名 第XX话/EPXX
  const epMatch = title.match(/第(\d+|[零一二三四五六七八九十]+)话|EP(\d+)|\[(\d+)\]/i);
  const groupMatch = title.match(/\[([^\]]+)\]/);

  return {
    episodeNumber: epMatch ? (epMatch[1] || epMatch[2] || epMatch[3]) : '??',
    subtitleGroup: groupMatch ? groupMatch[1] : '未知',
  };
};

// 从链接解析番剧ID
const parseBangumiId = (link: string): number | null => {
  const match = link.match(/bangumiId=(\d+)/);
  return match ? parseInt(match[1]) : null;
};

// 获取首页番剧列表（RSS）
export const getHomeBangumis = async (): Promise<Bangumi[]> => {
  try {
    const response = await axios.get(`${MIKAN_BASE_URL}/RSS/MyRSS`, {
      timeout: 10000,
    });

    const { items } = parseRSS(response.data);
    const bangumiMap = new Map<number, Bangumi>();

    for (const item of items) {
      const bangumiId = parseBangumiId(item.link);
      if (bangumiId && !bangumiMap.has(bangumiId)) {
        const { subtitleGroup } = parseEpisodeInfo(item.title);

        bangumiMap.set(bangumiId, {
          id: bangumiId,
          name: item.title.replace(/\[.*?\]/g, '').trim(),
          cover: extractCoverFromDescription(item.description),
          subtitleGroup: subtitleGroup,
          airDate: new Date(item.pubDate).toLocaleDateString('zh-CN'),
          status: 'ongoing',
          description: item.description,
        });
      }
    }

    return Array.from(bangumiMap.values());
  } catch (error) {
    console.error('Failed to fetch home bangumis:', error);
    // 返回空数组而不是模拟数据，让用户知道加载失败
    return [];
  }
};

// 从描述中提取封面图
const extractCoverFromDescription = (desc: string): string => {
  const imgMatch = desc.match(/<img[^>]*src="([^"]*)"/);
  return imgMatch ? imgMatch[1] : '';
};

// 获取番剧详情
export const getBangumiDetail = async (id: number): Promise<Bangumi | null> => {
  try {
    const response = await axios.get(`${MIKAN_BASE_URL}/Home/Bangumi/${id}`, {
      timeout: 10000,
    });

    // 解析HTML获取番剧详情
    const html = response.data;

    const nameMatch = html.match(/<h1[^>]*class="bangumi-title"[^>]*>(.*?)<\/h1>/);
    const imgMatch = html.match(/<img[^>]*class="bangumi-cover"[^>]*src="([^"]*)"/);
    const descMatch = html.match(/<div[^>]*class="bangumi-desc"[^>]*>(.*?)<\/div>/);

    return {
      id,
      name: nameMatch ? nameMatch[1].trim() : `番剧 ${id}`,
      cover: imgMatch ? imgMatch[1] : '',
      subtitleGroup: '多字幕组',
      airDate: '',
      status: 'ongoing',
      description: descMatch ? descMatch[1].trim() : '',
    };
  } catch (error) {
    console.error('Failed to fetch bangumi detail:', error);
    return null;
  }
};

// 获取番剧剧集列表（RSS）
export const getBangumiEpisodes = async (bangumiId: number): Promise<Episode[]> => {
  try {
    const response = await axios.get(`${MIKAN_BASE_URL}/RSS/Bangumi?bangumiId=${bangumiId}`, {
      timeout: 10000,
    });

    const { items } = parseRSS(response.data);

    return items.map((item, index) => {
      const { episodeNumber, subtitleGroup } = parseEpisodeInfo(item.title);

      // 提取磁力链接
      const magnetMatch = item.description.match(/magnet:\?xt=urn:btih:[a-f0-9]+[^<]*/) ||
                         item.link.match(/magnet:\?xt=urn:btih:[a-f0-9]+/);

      return {
        id: bangumiId * 100 + index,
        bangumiId,
        title: item.title,
        episodeNumber,
        publishTime: new Date(item.pubDate).toLocaleDateString('zh-CN'),
        fileSize: item.fileSize,
        magnetLink: magnetMatch ? magnetMatch[0] : '',
        torrentUrl: item.torrentUrl || item.link,
        subtitleGroup,
      };
    });
  } catch (error) {
    console.error('Failed to fetch episodes:', error);
    return [];
  }
};

// 搜索番剧
export const searchBangumis = async (keyword: string): Promise<Bangumi[]> => {
  try {
    const response = await axios.get(`${MIKAN_BASE_URL}/Home/Search`, {
      params: { search: keyword },
      timeout: 10000,
    });

    // 解析搜索结果HTML
    const html = response.data;
    const bangumiMatches = html.match(/<div[^>]*class="bangumi-item"[^>]*>[\s\S]*?<\/div>/g) || [];

    return bangumiMatches.map((match: string, index: number) => {
      const nameMatch = match.match(/<a[^>]*class="bangumi-name"[^>]*>(.*?)<\/a>/);
      const imgMatch = match.match(/<img[^>]*src="([^"]*)"/);
      const idMatch = match.match(/bangumiId=(\d+)/);

      return {
        id: idMatch ? parseInt(idMatch[1]) : index,
        name: nameMatch ? nameMatch[1].trim() : '未知番剧',
        cover: imgMatch ? imgMatch[1] : '',
        subtitleGroup: '多字幕组',
        airDate: '',
        status: 'ongoing',
      };
    });
  } catch (error) {
    console.error('Failed to search bangumis:', error);
    return [];
  }
};

// 获取字幕组列表
export const getSubtitleGroups = async (): Promise<SubtitleGroup[]> => {
  try {
    const response = await axios.get(`${MIKAN_BASE_URL}/Home/SubtitleGroup`, {
      timeout: 10000,
    });

    const html = response.data;
    const groupMatches = html.match(/<a[^>]*class="subgroup"[^>]*>(.*?)<\/a>/g) || [];

    return groupMatches.map((match: string, index: number) => {
      const nameMatch = match.match(/>(.*?)<\/a>/);
      return {
        id: index,
        name: nameMatch ? nameMatch[1].trim() : '未知字幕组',
      };
    });
  } catch (error) {
    console.error('Failed to fetch subtitle groups:', error);
    return [];
  }
};

// 获取RSS订阅链接
export const getRSSUrl = (bangumiId: number): string => {
  return `${MIKAN_BASE_URL}/RSS/Bangumi?bangumiId=${bangumiId}`;
};

// 备用：使用模拟数据（当API不可用时）
export const getMockBangumis = (): Bangumi[] => [
  {
    id: 1,
    name: '葬送的芙莉莲',
    cover: 'https://lain.bgm.tv/pic/cover/l/79/9d/404399_3lLLL.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024-01',
    status: 'ongoing',
    description: '勇者辛美尔死后，精灵魔法使芙莉莲踏上寻找理解人类之旅',
  },
  {
    id: 2,
    name: '药屋少女的呢喃',
    cover: 'https://lain.bgm.tv/pic/cover/l/bd/d8/422578_r2kKk.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024-01',
    status: 'ongoing',
    description: '药师少女猫猫在后宫中解开各种谜团',
  },
  {
    id: 3,
    name: '迷宫饭',
    cover: 'https://lain.bgm.tv/pic/cover/l/d1/62/424646_rKCJk.jpg',
    subtitleGroup: 'ANIME',
    airDate: '2024-01',
    status: 'ongoing',
    description: '冒险者们在迷宫中用魔物做成料理',
  },
];