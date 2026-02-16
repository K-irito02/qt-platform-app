/**
 * Mock 数据拦截器 — 在后端未启动时提供模拟数据
 * 通过 axios 拦截器实现，无需额外依赖
 */
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// ===== Mock 数据 =====

const mockUsers = [
  { 
    id: 1, 
    username: 'admin', 
    email: 'admin@qtplatform.com', 
    nickname: '超级管理员', 
    roles: ['SUPER_ADMIN'], 
    status: 'ACTIVE', 
    avatarUrl: '', 
    bio: '平台超级管理员', 
    emailVerified: true, 
    createdAt: '2025-01-01T00:00:00Z', 
    lastLoginAt: '2025-07-15T10:30:00Z',
    themeConfig: JSON.stringify({
      background: {
        type: 'video',
        url: '/test-assets/4k水墨素材分享.mp4',
        opacity: 0.8
      }
    })
  },
  { 
    id: 2, 
    username: 'zhangsan', 
    email: 'zhangsan@example.com', 
    nickname: '张三', 
    roles: ['USER'], 
    status: 'ACTIVE', 
    avatarUrl: '', 
    bio: 'Qt 爱好者，擅长跨平台开发', 
    emailVerified: true, 
    createdAt: '2025-02-15T08:00:00Z', 
    lastLoginAt: '2025-07-14T16:20:00Z',
    themeConfig: JSON.stringify({
      background: {
        type: 'image',
        url: '/test-assets/08caf9aec472.jpeg',
        opacity: 0.5
      }
    })
  },
  { id: 3, username: 'lisi', email: 'lisi@example.com', nickname: '李四', roles: ['USER'], status: 'ACTIVE', avatarUrl: '', bio: '独立开发者，专注桌面应用', emailVerified: true, createdAt: '2025-03-01T12:00:00Z', lastLoginAt: '2025-07-13T09:45:00Z' },
  { id: 4, username: 'wangwu', email: 'wangwu@example.com', nickname: '王五', roles: ['USER', 'VIP'], status: 'ACTIVE', avatarUrl: '', bio: 'VIP 用户，资深 Qt 开发', emailVerified: true, createdAt: '2025-03-20T14:00:00Z', lastLoginAt: '2025-07-15T08:00:00Z' },
  { id: 5, username: 'dev_chen', email: 'chen@example.com', nickname: '陈开发', roles: ['USER'], status: 'ACTIVE', avatarUrl: '', bio: '热爱开源', emailVerified: true, createdAt: '2025-04-10T09:00:00Z', lastLoginAt: '2025-07-10T14:30:00Z' },
  { id: 6, username: 'test_banned', email: 'banned@example.com', nickname: '被封禁用户', roles: ['USER'], status: 'BANNED', avatarUrl: '', bio: '', emailVerified: true, createdAt: '2025-05-01T10:00:00Z', lastLoginAt: '2025-06-01T10:00:00Z' },
];

const mockCategories = [
  { id: 1, name: '开发工具', nameEn: 'Dev Tools', slug: 'dev-tools', icon: '🛠️', sortOrder: 1 },
  { id: 2, name: '图形图像', nameEn: 'Graphics', slug: 'graphics', icon: '🎨', sortOrder: 2 },
  { id: 3, name: '网络通信', nameEn: 'Network', slug: 'network', icon: '🌐', sortOrder: 3 },
  { id: 4, name: '多媒体', nameEn: 'Multimedia', slug: 'multimedia', icon: '🎵', sortOrder: 4 },
  { id: 5, name: '系统工具', nameEn: 'System', slug: 'system', icon: '⚙️', sortOrder: 5 },
  { id: 6, name: '教育学习', nameEn: 'Education', slug: 'education', icon: '📚', sortOrder: 6 },
];

const mockProducts = [
  {
    id: 1, name: 'QtCreator Pro', nameEn: 'QtCreator Pro', slug: 'qtcreator-pro',
    description: '一款增强版的 Qt 开发环境，支持智能代码补全、实时预览、多项目管理和内置版本控制，为 Qt 开发者提供极致的编码体验。',
    categoryId: 1, categoryName: '开发工具', developerId: 2,
    status: 'PUBLISHED', iconUrl: '', bannerUrl: '',
    downloadCount: 15680, ratingAverage: 4.7, ratingCount: 234, viewCount: 45230,
    isFeatured: true, license: 'GPL-3.0',
    homepageUrl: 'https://example.com/qtcreator-pro',
    sourceUrl: 'https://github.com/example/qtcreator-pro',
    tags: ['IDE', 'Qt', '开发工具'],
    createdAt: '2025-01-15T10:00:00Z', publishedAt: '2025-02-01T08:00:00Z',
  },
  {
    id: 2, name: '墨笔绘图', nameEn: 'InkDraw', slug: 'ink-draw',
    description: '基于 Qt 的专业矢量绘图工具，支持水墨风格笔刷、图层管理、SVG 导出，适合数字艺术创作和 UI 设计。',
    categoryId: 2, categoryName: '图形图像', developerId: 3,
    status: 'PUBLISHED', iconUrl: '', bannerUrl: '',
    downloadCount: 8920, ratingAverage: 4.5, ratingCount: 156, viewCount: 28450,
    isFeatured: true, license: 'MIT',
    homepageUrl: 'https://example.com/inkdraw',
    sourceUrl: '',
    tags: ['绘图', '矢量', '水墨'],
    createdAt: '2025-02-10T14:00:00Z', publishedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 3, name: 'NetMonitor', nameEn: 'NetMonitor', slug: 'net-monitor',
    description: '轻量级网络监控工具，实时显示网络流量、连接状态和带宽使用，支持 TCP/UDP/HTTP 协议分析。',
    categoryId: 3, categoryName: '网络通信', developerId: 4,
    status: 'PUBLISHED', iconUrl: '', bannerUrl: '',
    downloadCount: 6340, ratingAverage: 4.2, ratingCount: 89, viewCount: 19800,
    isFeatured: true, license: 'Apache-2.0',
    homepageUrl: '', sourceUrl: 'https://github.com/example/netmonitor',
    tags: ['网络', '监控', '流量分析'],
    createdAt: '2025-03-05T09:00:00Z', publishedAt: '2025-03-20T12:00:00Z',
  },
  {
    id: 4, name: 'MusicBox', nameEn: 'MusicBox', slug: 'music-box',
    description: '跨平台音乐播放器，支持无损音频格式、均衡器调节、歌词同步显示和播放列表管理。',
    categoryId: 4, categoryName: '多媒体', developerId: 5,
    status: 'PUBLISHED', iconUrl: '', bannerUrl: '',
    downloadCount: 12450, ratingAverage: 4.6, ratingCount: 198, viewCount: 35600,
    isFeatured: true, license: 'LGPL-3.0',
    homepageUrl: 'https://example.com/musicbox', sourceUrl: '',
    tags: ['音乐', '播放器', '无损'],
    createdAt: '2025-02-20T16:00:00Z', publishedAt: '2025-03-10T08:00:00Z',
  },
  {
    id: 5, name: 'SysInfo', nameEn: 'SysInfo', slug: 'sys-info',
    description: '系统信息查看器，展示 CPU、内存、磁盘、GPU 等硬件详情和实时使用率，支持导出报告。',
    categoryId: 5, categoryName: '系统工具', developerId: 2,
    status: 'PUBLISHED', iconUrl: '', bannerUrl: '',
    downloadCount: 4280, ratingAverage: 4.0, ratingCount: 67, viewCount: 14500,
    isFeatured: false, license: 'MIT',
    homepageUrl: '', sourceUrl: '',
    tags: ['系统', '硬件', '监控'],
    createdAt: '2025-04-01T10:00:00Z', publishedAt: '2025-04-15T09:00:00Z',
  },
  {
    id: 6, name: 'CodeTeach', nameEn: 'CodeTeach', slug: 'code-teach',
    description: '编程教学辅助工具，集成代码编辑器、实时运行和互动练习，适合 C++/Qt 入门教学。',
    categoryId: 6, categoryName: '教育学习', developerId: 3,
    status: 'PUBLISHED', iconUrl: '', bannerUrl: '',
    downloadCount: 3150, ratingAverage: 4.3, ratingCount: 45, viewCount: 11200,
    isFeatured: false, license: 'GPL-3.0',
    homepageUrl: '', sourceUrl: 'https://github.com/example/codeteach',
    tags: ['教学', '编程', 'C++'],
    createdAt: '2025-04-20T14:00:00Z', publishedAt: '2025-05-01T10:00:00Z',
  },
  {
    id: 7, name: 'FileSync Pro', nameEn: 'FileSync Pro', slug: 'filesync-pro',
    description: '高效文件同步工具，支持增量同步、冲突检测、多端协同，基于 Qt 网络库构建。',
    categoryId: 3, categoryName: '网络通信', developerId: 4,
    status: 'PUBLISHED', iconUrl: '', bannerUrl: '',
    downloadCount: 5670, ratingAverage: 4.4, ratingCount: 112, viewCount: 20100,
    isFeatured: false, license: 'MIT',
    homepageUrl: '', sourceUrl: '',
    tags: ['同步', '文件', '网络'],
    createdAt: '2025-05-10T08:00:00Z', publishedAt: '2025-05-20T10:00:00Z',
  },
  {
    id: 8, name: 'PixelEditor', nameEn: 'PixelEditor', slug: 'pixel-editor',
    description: '像素画编辑器，支持多图层、动画帧编辑、自定义调色板，适合游戏美术和像素艺术创作。',
    categoryId: 2, categoryName: '图形图像', developerId: 5,
    status: 'PENDING', iconUrl: '', bannerUrl: '',
    downloadCount: 0, ratingAverage: 0, ratingCount: 0, viewCount: 340,
    isFeatured: false, license: 'MIT',
    homepageUrl: '', sourceUrl: '',
    tags: ['像素', '编辑器', '游戏'],
    createdAt: '2025-06-01T10:00:00Z', publishedAt: null,
  },
];

const mockVersions: Record<number, any[]> = {
  1: [
    { id: 1, productId: 1, versionNumber: '2.1.0', versionCode: 210, versionType: 'RELEASE', platform: 'WINDOWS', architecture: 'x64', fileName: 'qtcreator-pro-2.1.0-win-x64.exe', fileSize: 89456000, checksumSha256: 'abc123...', downloadCount: 8900, isMandatory: false, isLatest: true, releaseNotes: '新增智能代码补全引擎，修复多项已知问题', status: 'PUBLISHED', rolloutPercentage: 100, createdAt: '2025-06-15T10:00:00Z', publishedAt: '2025-06-15T12:00:00Z' },
    { id: 2, productId: 1, versionNumber: '2.1.0', versionCode: 210, versionType: 'RELEASE', platform: 'LINUX', architecture: 'x64', fileName: 'qtcreator-pro-2.1.0-linux-x64.AppImage', fileSize: 76800000, checksumSha256: 'def456...', downloadCount: 4200, isMandatory: false, isLatest: true, releaseNotes: '新增智能代码补全引擎，修复多项已知问题', status: 'PUBLISHED', rolloutPercentage: 100, createdAt: '2025-06-15T10:00:00Z', publishedAt: '2025-06-15T12:00:00Z' },
    { id: 3, productId: 1, versionNumber: '2.0.3', versionCode: 203, versionType: 'RELEASE', platform: 'WINDOWS', architecture: 'x64', fileName: 'qtcreator-pro-2.0.3-win-x64.exe', fileSize: 85200000, checksumSha256: 'ghi789...', downloadCount: 2580, isMandatory: false, isLatest: false, releaseNotes: '紧急修复：修复项目无法加载的问题', status: 'PUBLISHED', rolloutPercentage: 100, createdAt: '2025-05-20T14:00:00Z', publishedAt: '2025-05-20T16:00:00Z' },
  ],
  2: [
    { id: 4, productId: 2, versionNumber: '1.3.0', versionCode: 130, versionType: 'RELEASE', platform: 'WINDOWS', architecture: 'x64', fileName: 'inkdraw-1.3.0-win-x64.exe', fileSize: 45600000, checksumSha256: 'jkl012...', downloadCount: 5600, isMandatory: false, isLatest: true, releaseNotes: '新增水墨风格笔刷包，优化图层性能', status: 'PUBLISHED', rolloutPercentage: 100, createdAt: '2025-06-01T08:00:00Z', publishedAt: '2025-06-01T10:00:00Z' },
    { id: 5, productId: 2, versionNumber: '1.3.0', versionCode: 130, versionType: 'RELEASE', platform: 'MACOS', architecture: 'arm64', fileName: 'inkdraw-1.3.0-macos-arm64.dmg', fileSize: 52300000, checksumSha256: 'mno345...', downloadCount: 3320, isMandatory: false, isLatest: true, releaseNotes: '新增水墨风格笔刷包，优化图层性能', status: 'PUBLISHED', rolloutPercentage: 100, createdAt: '2025-06-01T08:00:00Z', publishedAt: '2025-06-01T10:00:00Z' },
  ],
  3: [
    { id: 6, productId: 3, versionNumber: '1.0.2', versionCode: 102, versionType: 'RELEASE', platform: 'WINDOWS', architecture: 'x64', fileName: 'netmonitor-1.0.2-win-x64.exe', fileSize: 23400000, checksumSha256: 'pqr678...', downloadCount: 6340, isMandatory: false, isLatest: true, releaseNotes: '优化 TCP 连接追踪性能', status: 'PUBLISHED', rolloutPercentage: 100, createdAt: '2025-05-10T10:00:00Z', publishedAt: '2025-05-10T12:00:00Z' },
  ],
  4: [
    { id: 7, productId: 4, versionNumber: '3.2.1', versionCode: 321, versionType: 'RELEASE', platform: 'WINDOWS', architecture: 'x64', fileName: 'musicbox-3.2.1-win-x64.exe', fileSize: 34500000, checksumSha256: 'stu901...', downloadCount: 12450, isMandatory: false, isLatest: true, releaseNotes: '支持 DSD 音频格式，修复歌词同步延迟', status: 'PUBLISHED', rolloutPercentage: 100, createdAt: '2025-06-20T08:00:00Z', publishedAt: '2025-06-20T10:00:00Z' },
  ],
};

const mockComments: Record<number, any[]> = {
  1: [
    { id: 1, productId: 1, userId: 2, nickname: '张三', content: '非常好用的开发工具，代码补全功能比原版强大很多！', rating: 5, status: 'PUBLISHED', likeCount: 23, liked: false, createdAt: '2025-06-16T14:30:00Z', replies: [{ id: 10, userId: 1, nickname: '超级管理员', content: '感谢支持！我们会继续改进。', createdAt: '2025-06-16T16:00:00Z' }] },
    { id: 2, productId: 1, userId: 3, nickname: '李四', content: '多项目管理功能节省了我大量的时间，推荐。', rating: 4, status: 'PUBLISHED', likeCount: 15, liked: false, createdAt: '2025-06-17T09:00:00Z', replies: [] },
    { id: 3, productId: 1, userId: 4, nickname: '王五', content: '版本控制集成做得不错，但希望能支持更多 Git 操作。', rating: 4, status: 'PUBLISHED', likeCount: 8, liked: false, createdAt: '2025-06-18T11:20:00Z', replies: [] },
    { id: 4, productId: 1, userId: 5, nickname: '陈开发', content: '在大项目中偶尔有卡顿，希望下个版本能优化内存占用。', rating: 3, status: 'PUBLISHED', likeCount: 5, liked: false, createdAt: '2025-06-20T15:00:00Z', replies: [] },
  ],
  2: [
    { id: 5, productId: 2, userId: 4, nickname: '王五', content: '水墨笔刷效果令人惊艳，非常适合中国风的设计！', rating: 5, status: 'PUBLISHED', likeCount: 31, liked: false, createdAt: '2025-06-02T10:00:00Z', replies: [] },
    { id: 6, productId: 2, userId: 2, nickname: '张三', content: '图层管理很直觉，SVG导出质量也很好。', rating: 4, status: 'PUBLISHED', likeCount: 12, liked: false, createdAt: '2025-06-05T14:30:00Z', replies: [] },
  ],
};

const mockNotifications = [
  { id: 1, userId: 2, type: 'COMMENT_REPLY', title: '管理员回复了你的评论', content: '感谢支持！我们会继续改进。', link: '/products/qtcreator-pro', isRead: false, createdAt: '2025-07-15T10:00:00Z' },
  { id: 2, userId: 2, type: 'VERSION_UPDATE', title: 'QtCreator Pro 发布了新版本 2.1.0', content: '新增智能代码补全引擎', link: '/products/qtcreator-pro', isRead: true, createdAt: '2025-06-15T12:00:00Z' },
  { id: 3, userId: 2, type: 'SYSTEM', title: '欢迎加入 Qt 产品发布平台', content: '感谢注册，请完善个人资料。', link: '/profile', isRead: true, createdAt: '2025-02-15T08:00:00Z' },
];

const mockDashboardStats = {
  totalUsers: 1256,
  totalProducts: 48,
  totalDownloads: 156800,
  totalComments: 2340,
  newUsersToday: 12,
  downloadsToday: 890,
  recentUsers: mockUsers.slice(1, 6),
  recentProducts: mockProducts.slice(0, 5),
  downloadTrend: [
    { date: '07-09', count: 720 }, { date: '07-10', count: 850 }, { date: '07-11', count: 680 },
    { date: '07-12', count: 920 }, { date: '07-13', count: 1100 }, { date: '07-14', count: 780 },
    { date: '07-15', count: 890 },
  ],
  categoryDistribution: mockCategories.map(c => ({ name: c.name, count: Math.floor(Math.random() * 15) + 3 })),
};

const mockSystemConfigs = [
  { id: 1, configKey: 'site.name', configValue: 'Qt 产品发布平台', description: '站点名称' },
  { id: 2, configKey: 'site.name_en', configValue: 'Qt Product Platform', description: '站点英文名称' },
  { id: 3, configKey: 'site.description', configValue: 'Qt 软件产品发布与分发', description: '站点描述' },
  { id: 4, configKey: 'upload.max_file_size', configValue: '1073741824', description: '最大上传文件大小（字节）' },
  { id: 5, configKey: 'comment.auto_approve', configValue: 'false', description: '评论是否自动通过审核' },
  { id: 6, configKey: 'register.enabled', configValue: 'true', description: '是否开放注册' },
];

const mockAuditLogs = [
  { id: 1, userId: 1, action: 'USER_LOGIN', targetType: 'USER', targetId: 1, detail: { ip: '127.0.0.1' }, ipAddress: '127.0.0.1', createdAt: '2025-07-15T10:30:00Z' },
  { id: 2, userId: 1, action: 'PRODUCT_AUDIT', targetType: 'PRODUCT', targetId: 1, detail: { status: 'PUBLISHED' }, ipAddress: '127.0.0.1', createdAt: '2025-07-15T10:35:00Z' },
  { id: 3, userId: 1, action: 'COMMENT_AUDIT', targetType: 'COMMENT', targetId: 1, detail: { status: 'PUBLISHED' }, ipAddress: '127.0.0.1', createdAt: '2025-07-15T10:40:00Z' },
];

// ===== Mock 路由匹配 =====

const ok = (data: unknown) => ({ code: 0, message: 'success', data });
const page = (records: unknown[], total: number) => ok({ records, total });

type MockHandler = (config: InternalAxiosRequestConfig) => unknown;

const mockRoutes: Array<{ method: string; pattern: RegExp; handler: MockHandler }> = [
  // Auth
  {
    method: 'post', pattern: /\/auth\/login$/, handler: (cfg) => {
      const body = typeof cfg.data === 'string' ? JSON.parse(cfg.data || '{}') : (cfg.data || {});
      const input = (body.email || body.username || '').toLowerCase();
      const matched = mockUsers.find(u => u.email.toLowerCase() === input || u.username.toLowerCase() === input);
      if (!matched) return { code: 401, message: '用户名或密码错误', data: null };
      if (matched.status === 'BANNED') return { code: 403, message: '该账号已被封禁', data: null };
      return ok({ user: matched, accessToken: `mock-token-${matched.id}-${matched.username}`, refreshToken: `mock-refresh-${matched.id}` });
    },
  },
  { method: 'post', pattern: /\/auth\/register$/, handler: () => ok(null) },
  { method: 'post', pattern: /\/auth\/logout$/, handler: () => ok(null) },
  { method: 'post', pattern: /\/auth\/send-code$/, handler: () => ok(null) },
  { method: 'post', pattern: /\/auth\/reset-password$/, handler: () => ok(null) },
  { method: 'put', pattern: /\/auth\/change-password$/, handler: () => ok(null) },
  { method: 'get', pattern: /\/auth\/oauth\/github$/, handler: () => ok({ url: 'https://github.com/login/oauth/authorize?client_id=mock' }) },

  // Users
  {
    method: 'get', pattern: /\/users\/profile$/, handler: (cfg) => {
      const token = cfg.headers?.Authorization?.toString() || '';
      const match = token.match(/mock-token-(\d+)-/);
      const userId = match ? Number(match[1]) : 1;
      const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
      return ok(user);
    },
  },
  {
    method: 'put', pattern: /\/users\/profile$/, handler: (cfg) => {
      const token = cfg.headers?.Authorization?.toString() || '';
      const match = token.match(/mock-token-(\d+)-/);
      const userId = match ? Number(match[1]) : 1;
      const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
      const d = JSON.parse(cfg.data || '{}');
      return ok({ ...user, ...d });
    },
  },
  {
    method: 'get', pattern: /\/users\/me\/theme$/, handler: (cfg) => {
      const token = cfg.headers?.Authorization?.toString() || '';
      const match = token.match(/mock-token-(\d+)-/);
      const userId = match ? Number(match[1]) : 1;
      const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
      return ok({ themeConfig: user.themeConfig || null });
    },
  },
  { method: 'put', pattern: /\/users\/me\/theme$/, handler: () => ok(null) },

  // Products
  {
    method: 'get', pattern: /\/products$/, handler: (cfg) => {
      const p = cfg.params || {};
      let list = mockProducts.filter(pr => pr.status === 'PUBLISHED');
      if (p.categoryId) list = list.filter(pr => pr.categoryId === Number(p.categoryId));
      if (p.keyword) list = list.filter(pr => pr.name.toLowerCase().includes(p.keyword.toLowerCase()) || pr.description.includes(p.keyword));
      if (p.sort === 'downloads') list.sort((a, b) => b.downloadCount - a.downloadCount);
      else if (p.sort === 'rating') list.sort((a, b) => b.ratingAverage - a.ratingAverage);
      else if (p.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
      const pg = Number(p.page) || 1;
      const sz = Number(p.size) || 12;
      return page(list.slice((pg - 1) * sz, pg * sz), list.length);
    },
  },
  { method: 'get', pattern: /\/products\/featured$/, handler: () => ok(mockProducts.filter(p => p.isFeatured)) },
  {
    method: 'get', pattern: /\/products\/([^/]+)$/, handler: (cfg) => {
      const slug = cfg.url?.match(/\/products\/([^/?]+)/)?.[1];
      const p = mockProducts.find(pr => pr.slug === slug || String(pr.id) === slug);
      return p ? ok(p) : ok(null);
    },
  },
  {
    method: 'get', pattern: /\/products\/(\d+)\/versions/, handler: (cfg) => {
      const id = Number(cfg.url?.match(/\/products\/(\d+)\/versions/)?.[1]);
      return ok(mockVersions[id] || []);
    },
  },

  // Categories
  { method: 'get', pattern: /\/categories$/, handler: () => ok(mockCategories) },

  // Comments
  {
    method: 'get', pattern: /\/comments\/product\/(\d+)/, handler: (cfg) => {
      const id = Number(cfg.url?.match(/\/comments\/product\/(\d+)/)?.[1]);
      const comments = mockComments[id] || [];
      return page(comments, comments.length);
    },
  },
  { method: 'post', pattern: /\/comments\/product\//, handler: () => ok({ id: 100, status: 'PENDING' }) },
  { method: 'post', pattern: /\/comments\/\d+\/like/, handler: () => ok(null) },
  { method: 'delete', pattern: /\/comments\/\d+\/like/, handler: () => ok(null) },

  // Notifications
  { method: 'get', pattern: /\/notifications$/, handler: () => page(mockNotifications, mockNotifications.length) },
  { method: 'get', pattern: /\/notifications\/unread-count/, handler: () => ok({ count: 1 }) },
  { method: 'put', pattern: /\/notifications\//, handler: () => ok(null) },

  // Admin
  { method: 'get', pattern: /\/admin\/dashboard\/stats/, handler: () => ok(mockDashboardStats) },
  {
    method: 'get', pattern: /\/admin\/users$/, handler: (cfg) => {
      const p = cfg.params || {};
      let list = [...mockUsers];
      if (p.keyword) list = list.filter(u => u.username.includes(p.keyword) || u.nickname.includes(p.keyword) || u.email.includes(p.keyword));
      if (p.status) list = list.filter(u => u.status === p.status);
      return page(list, list.length);
    },
  },
  { method: 'get', pattern: /\/admin\/users\/\d+/, handler: (cfg) => { const id = Number(cfg.url?.match(/\/admin\/users\/(\d+)/)?.[1]); return ok(mockUsers.find(u => u.id === id)); } },
  { method: 'put', pattern: /\/admin\/users\/\d+\/status/, handler: () => ok(null) },
  {
    method: 'get', pattern: /\/admin\/products$/, handler: (cfg) => {
      const p = cfg.params || {};
      let list = [...mockProducts];
      if (p.status) list = list.filter(pr => pr.status === p.status);
      if (p.categoryId) list = list.filter(pr => pr.categoryId === Number(p.categoryId));
      return page(list, list.length);
    },
  },
  { method: 'put', pattern: /\/admin\/products\/\d+\/audit/, handler: () => ok(null) },
  { method: 'delete', pattern: /\/admin\/products\/\d+/, handler: () => ok(null) },
  {
    method: 'get', pattern: /\/admin\/comments$/, handler: (cfg) => {
      const p = cfg.params || {};
      const all = Object.values(mockComments).flat();
      let list = [...all];
      if (p.status) list = list.filter(c => c.status === p.status);
      return page(list, list.length);
    },
  },
  { method: 'put', pattern: /\/admin\/comments\/\d+\/audit/, handler: () => ok(null) },
  { method: 'delete', pattern: /\/admin\/comments\/\d+/, handler: () => ok(null) },
  { method: 'post', pattern: /\/admin\/products\/categories/, handler: () => ok({ id: 7 }) },
  { method: 'put', pattern: /\/admin\/products\/categories\//, handler: () => ok(null) },
  { method: 'delete', pattern: /\/admin\/products\/categories\//, handler: () => ok(null) },
  { method: 'get', pattern: /\/admin\/system\/configs/, handler: () => ok(mockSystemConfigs) },
  { method: 'put', pattern: /\/admin\/system\/configs\//, handler: () => ok(null) },
  { method: 'get', pattern: /\/admin\/audit-logs/, handler: () => page(mockAuditLogs, mockAuditLogs.length) },
  { method: 'get', pattern: /\/admin\/system\/theme/, handler: () => {
    const saved = localStorage.getItem('systemThemeConfig');
    if (saved) return ok({ themeConfig: saved });
    return ok({ themeConfig: null });
  }},
  { method: 'put', pattern: /\/admin\/system\/theme/, handler: (cfg) => {
    // cfg.data 已经是 JSON 字符串，直接保存
    const body = typeof cfg.data === 'string' ? cfg.data : JSON.stringify(cfg.data);
    localStorage.setItem('systemThemeConfig', body);
    return ok(null);
  }},

  // File upload
  { method: 'post', pattern: /\/files\/upload/, handler: () => ok({ id: 1, url: '/mock/uploaded-file.png', path: '/uploads/mock.png' }) },

  // Update check
  { method: 'get', pattern: /\/updates\/check/, handler: () => ok({ hasUpdate: false }) },
];

// ===== 安装 Mock 拦截器 =====

export function setupMock(axiosInstance: import('axios').AxiosInstance) {
  axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toLowerCase() || 'get';
    const url = config.url || '';

    for (const route of mockRoutes) {
      if (route.method === method && route.pattern.test(url)) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

        const mockData = route.handler(config);

        // 构造伪造的 axios 响应并通过 adapter 短路
        const response: AxiosResponse = {
          data: mockData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };

        // 用 adapter 返回 mock 响应
        config.adapter = () => Promise.resolve(response);
        return config;
      }
    }

    return config;
  });
}
