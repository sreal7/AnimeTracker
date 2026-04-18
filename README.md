# AnimeTracker

一款基于蜜柑计划(Mikan Project)的番剧订阅追踪工具，帮助你追踪订阅的番剧更新。

## 功能特性

- 📺 **番剧列表** - 查看最新发布的番剧资源
- 🔍 **搜索番剧** - 快速搜索你想看的番剧
- 📌 **订阅管理** - 订阅喜欢的番剧，追踪更新
- 🔔 **更新通知** - 新剧集发布时推送通知提醒
- 📥 **下载支持** - 一键复制磁力链接或下载种子
- 🌙 **夜间模式** - 深色主题，护眼体验

## 截图

<!-- 添加截图 -->

## 安装

### 前置要求

- Node.js 18+
- npm 或 yarn
- Expo CLI

### 运行

```bash
# 克隆项目
git clone https://github.com/sreal7/AnimeTracker.git

# 进入目录
cd AnimeTracker

# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npx expo start
```

### 平台支持

| 平台 | 命令 |
|------|------|
| Web | `npx expo start --web` |
| Android | `npx expo start --android` |
| iOS | `npx expo start --ios` |

## 项目结构

```
src/
├── components/          # UI组件
│   ├── BangumiCard.tsx  # 番剧卡片
│   └── EpisodeItem.tsx  # 剧集列表项
├── screens/             # 页面
│   ├── HomeScreen.tsx   # 首页
│   ├── BangumiDetailScreen.tsx # 番剧详情
│   ├── SubscriptionsScreen.tsx # 我的订阅
│   ├── SearchScreen.tsx # 搜索页
│   └── SettingsScreen.tsx # 设置页
├── navigation/          # 导航配置
│   └── AppNavigator.tsx
├── stores/              # 状态管理
│   ├── subscriptionStore.ts # 订阅状态
│   └── themeStore.ts    # 主题状态
├── services/            # 服务层
│   ├── mikanApi.ts      # 蜜柑计划API
│   ├── downloadService.ts # 下载服务
│   └── notificationService.ts # 通知服务
├── types/               # TypeScript类型
│   ├── bangumi.ts       # 番剧类型定义
│   └── navigation.ts    # 导航类型
└── theme/               # 主题配置
    ├── colors.ts        # 颜色定义
    └── index.ts         # 主题导出
```

## 技术栈

- **框架**: React Native + Expo
- **导航**: React Navigation (Tab + Stack)
- **状态管理**: Zustand
- **UI组件**: React Native Paper (Material Design 3)
- **存储**: AsyncStorage
- **通知**: Expo Notifications
- **图片**: Expo Image
- **剪贴板**: @react-native-clipboard/clipboard

## 使用说明

### 订阅番剧

1. 在首页或搜索页找到想看的番剧
2. 点击番剧进入详情页
3. 点击「订阅番剧」按钮
4. 新剧集发布时会收到通知

### 下载剧集

1. 进入番剧详情页
2. 在剧集列表中找到想下载的剧集
3. 点击「链接」图标复制磁力链接
4. 或点击「下载」图标直接打开下载

### 批量下载

在番剧详情页点击「批量复制」按钮，一次性复制所有剧集的磁力链接。

## 数据来源

番剧数据来自 [蜜柑计划 - Mikan Project](https://mikanani.kas.pub/)，通过解析RSS获取最新番剧资源信息。

## 隐私说明

- 所有订阅数据仅存储在本地设备
- 不收集任何用户个人信息
- 不需要账号登录

## 开发计划

- [ ] 后台自动检查更新
- [ ] 番剧封面缓存
- [ ] 下载进度显示
- [ ] 番剧评分/评论显示
- [ ] 多语言支持

## 许可证

MIT License

## 致谢

- 数据来源：[蜜柑计划](https://mikanani.kas.pub/)
- UI框架：[React Native Paper](https://callstack.github.io/react-native-paper/)
- 图片托管：[Bangumi](https://bgm.tv/)