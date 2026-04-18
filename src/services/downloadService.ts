import Clipboard from '@react-native-clipboard/clipboard';
import { Linking, Alert, Platform } from 'react-native';
import { Episode } from '../types/bangumi';

// 复制磁力链接到剪贴板
export const copyMagnetLink = async (episode: Episode): Promise<boolean> => {
  try {
    if (!episode.magnetLink) {
      Alert.alert('错误', '该剧集没有磁力链接');
      return false;
    }

    Clipboard.setString(episode.magnetLink);
    Alert.alert('复制成功', '磁力链接已复制到剪贴板\n可粘贴到下载工具中使用');
    return true;
  } catch (error) {
    console.error('Failed to copy magnet link:', error);
    Alert.alert('复制失败', '无法复制磁力链接');
    return false;
  }
};

// 复制种子下载链接
export const copyTorrentUrl = async (episode: Episode): Promise<boolean> => {
  try {
    if (!episode.torrentUrl) {
      Alert.alert('错误', '该剧集没有种子链接');
      return false;
    }

    Clipboard.setString(episode.torrentUrl);
    Alert.alert('复制成功', '种子链接已复制到剪贴板');
    return true;
  } catch (error) {
    console.error('Failed to copy torrent url:', error);
    Alert.alert('复制失败', '无法复制种子链接');
    return false;
  }
};

// 打开种子下载链接
export const openTorrentDownload = async (episode: Episode): Promise<boolean> => {
  try {
    const url = episode.torrentUrl || episode.magnetLink;

    if (!url) {
      Alert.alert('错误', '该剧集没有下载链接');
      return false;
    }

    // 磁力链接直接打开，系统会调用BT客户端
    if (url.startsWith('magnet:')) {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return true;
      } else {
        // 如果系统不支持，复制到剪贴板
        return copyMagnetLink(episode);
      }
    }

    // HTTP链接下载种子文件
    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error('Failed to open download:', error);
    Alert.alert('打开失败', '无法打开下载链接，请手动复制');
    return copyTorrentUrl(episode);
  }
};

// 获取所有剧集的磁力链接（批量）
export const getAllMagnetLinks = (episodes: Episode[]): string => {
  return episodes
    .filter((ep) => ep.magnetLink)
    .map((ep) => ep.magnetLink)
    .join('\n');
};

// 批量复制磁力链接
export const copyAllMagnetLinks = async (episodes: Episode[]): Promise<boolean> => {
  try {
    const links = getAllMagnetLinks(episodes);
    if (!links) {
      Alert.alert('错误', '没有可复制的磁力链接');
      return false;
    }

    Clipboard.setString(links);
    Alert.alert('复制成功', `已复制 ${episodes.length} 个磁力链接到剪贴板`);
    return true;
  } catch (error) {
    console.error('Failed to copy all links:', error);
    Alert.alert('复制失败', '无法复制磁力链接');
    return false;
  }
};