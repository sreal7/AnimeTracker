import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Episode, Bangumi } from '../types/bangumi';

// 配置通知行为
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 请求通知权限
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  // Android需要创建通知频道
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('anime-updates', {
      name: '番剧更新通知',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2196F3',
    });
  }

  return true;
};

// 获取推送token（可选，用于服务器推送）
export const getPushToken = async (): Promise<string | null> => {
  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    return token;
  } catch (error) {
    console.log('Failed to get push token:', error);
    return null;
  }
};

// 发送新剧集通知
export const notifyNewEpisode = async (episode: Episode, bangumiName: string): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `新剧集发布: ${bangumiName}`,
      body: `${episode.title} (${episode.fileSize})`,
      data: {
        episodeId: episode.id,
        bangumiId: episode.bangumiId,
        type: 'new_episode',
      },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // 立即发送
  });
};

// 发送批量新剧集通知
export const notifyMultipleEpisodes = async (
  episodes: Episode[],
  bangumiName: string
): Promise<void> => {
  if (episodes.length === 0) return;

  if (episodes.length === 1) {
    await notifyNewEpisode(episodes[0], bangumiName);
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${bangumiName} 有 ${episodes.length} 个新剧集`,
      body: episodes.map((ep) => ep.episodeNumber).join(', ') + ' 等剧集已更新',
      data: {
        bangumiId: episodes[0].bangumiId,
        episodeIds: episodes.map((ep) => ep.id),
        type: 'multiple_episodes',
      },
    },
    trigger: null,
  });
};

// 发送订阅提醒
export const notifySubscribedBangumi = async (bangumi: Bangumi): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '订阅成功',
      body: `已订阅 ${bangumi.name}，新剧集发布时会收到通知`,
      data: {
        bangumiId: bangumi.id,
        type: 'subscription',
      },
    },
    trigger: null,
  });
};

// 设置定时检查通知（可选）
export const schedulePeriodicCheck = async (intervalMinutes: number = 30): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '检查番剧更新',
      body: '正在检查订阅的番剧是否有新剧集...',
      data: { type: 'periodic_check' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: intervalMinutes * 60,
      repeats: true,
    },
  });
};

// 取消所有通知
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// 获取待发送的通知列表
export const getPendingNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

// 设置通知badge
export const setNotificationBadge = async (count: number): Promise<void> => {
  await Notifications.setBadgeCountAsync(count);
};

// 清除通知badge
export const clearNotificationBadge = async (): Promise<void> => {
  await Notifications.setBadgeCountAsync(0);
};

// 监听通知接收事件
export const addNotificationListener = (
  callback: (notification: Notifications.Notification) => void
): Notifications.EventSubscription => {
  return Notifications.addNotificationReceivedListener(callback);
};

// 监听通知点击事件
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};