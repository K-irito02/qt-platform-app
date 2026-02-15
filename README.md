# Qt 产品发布平台

> Qt 软件产品发布与分发平台 — 中式水墨风格 UI + 中英文双语支持

---

## 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.3 | UI 框架 |
| TypeScript | ~5.6 | 类型安全 |
| Vite | 5.4 | 构建工具 + HMR |
| Ant Design | 6.x | UI 组件库（水墨主题定制） |
| Redux Toolkit | 2.x | 状态管理 |
| React Router | 7.x | 路由（懒加载） |
| react-i18next | 16.x | 国际化（中/英） |
| Axios | 1.x | HTTP 请求 |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Spring Boot | 3.2.12 | 后端框架 |
| Spring Security | 6.2.x | JWT + RBAC 认证授权 |
| MyBatis-Plus | 3.5.x | ORM（复杂 SQL） |
| Spring Data JPA | 3.2.x | ORM（简单 CRUD） |
| PostgreSQL | 15.x | 主数据库（JSONB + 全文检索 + 表分区） |
| Redis | 7.x | 缓存 + 限流（单机模式） |
| SpringDoc OpenAPI | 2.x | API 文档（Swagger UI） |

### 基础设施

| 技术 | 说明 |
|------|------|
| Docker + Docker Compose | 容器化开发 + 生产部署 |
| Nginx | 反向代理 + SSL 终止 + 静态资源 |
| GitHub Actions | CI/CD 自动构建/测试/部署 |
| Spring Boot Actuator + Prometheus | 基础监控 |

---

## 快速开始

### 1. 环境要求

| 软件 | 版本 | 安装方式 |
|------|------|---------|
| JDK | OpenJDK 17+ (Temurin) | [adoptium.net](https://adoptium.net) |
| Node.js | 22.x LTS | nvm-windows |
| Maven | 3.9.x | 官网安装 |
| Docker Desktop | Latest | 官网安装，启用 WSL2 |
| Git | Latest | 官网安装 |

### 2. 克隆项目

```bash
git clone https://github.com/K-irito02/qt-platform-app.git
cd qt-platform
```

### 3. 启动依赖服务

```bash
docker compose -f docker-compose.dev.yml up -d
# 启动 PostgreSQL 15 (端口 5433) + Redis 7 (端口 6379)
# 自动执行 sql/init.sql 建表 + 初始化数据
```

> **注**: PostgreSQL 映射到宿主机端口 **5433**（非默认 5432），避免与本地 PostgreSQL 安装冲突

### 4. 启动后端

```bash
# 方式一：Maven 直接运行
mvn spring-boot:run -pl qt-platform-app "-Dspring-boot.run.profiles=dev"

# 方式二：打包后运行
mvn clean package -DskipTests
java -jar qt-platform-app/target/qt-platform-app-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev

# API 地址: http://localhost:8081
# Swagger UI: http://localhost:8081/swagger-ui.html
```

> **注**: 端口为 8081（非默认 8080），因本机 Apache httpd 占用 8080

### 5. 启动前端

```bash
cd qt-platform
cd qt-platform-web
npm install
npm run dev
# 访问: http://localhost:5173
# Vite 已配置代理 /api → http://localhost:8081
```

### 6. 导入种子数据（可选）

```bash
# 在 PostgreSQL 中执行种子数据（5 用户 + 6 分类 + 8 产品 + 版本 + 评论）
# Windows PowerShell:
Get-Content sql/seed.sql | docker exec -i qt-dev-postgres psql -U qt_user -d qt_platform
# Linux / macOS:
docker exec -i qt-dev-postgres psql -U qt_user -d qt_platform < sql/seed.sql
```

### 7. 禁用 Mock 数据（可选）

前端默认启用 Mock 拦截器（后端未启动时提供模拟数据）。后端运行时，可创建 `.env.local` 禁用 Mock 以使用真实 API：

```bash
# qt-platform-web/.env.local
VITE_ENABLE_MOCK=false
```

---

## 项目结构

```
qt-platform/
├── qt-platform-common/            # 公共模块（异常、响应格式、工具类、通用配置）
├── qt-platform-user/              # 用户模块（认证、OAuth、用户管理、Spring Security）
├── qt-platform-product/           # 产品模块（产品、版本、分类、下载、更新检查）
├── qt-platform-comment/           # 评论模块（评论 CRUD、评分、点赞）
├── qt-platform-file/              # 文件模块（上传、存储、校验）
├── qt-platform-admin/             # 后台管理模块（仪表盘、审核、系统配置）
├── qt-platform-app/               # 主应用启动模块（聚合所有模块 + 配置文件）
│   ├── Dockerfile                 # 后端多阶段构建
│   └── src/main/resources/
│       ├── application.yml        # 主配置
│       ├── application-dev.yml    # 开发环境
│       └── application-prod.yml   # 生产环境
├── qt-platform-web/               # 前端项目（React SPA）
│   └── src/
│       ├── components/            # 共享组件（ThemeProvider、DynamicBackground 等）
│       ├── layouts/               # 布局（MainLayout、AdminLayout）
│       ├── pages/                 # 页面（前台 9 个 + 后台 6 个）
│       ├── router/                # 路由配置（懒加载）
│       ├── store/                 # Redux（authSlice + themeSlice）
│       ├── locales/               # 国际化（zh-CN + en-US）
│       ├── theme/                 # Ant Design 水墨主题
│       ├── utils/                 # API 封装 + Axios 实例 + Mock
│       └── styles/                # 水墨特效 CSS
├── sql/
│   ├── init.sql                   # 建表 + 索引 + 触发器 + 初始化角色/权限
│   └── seed.sql                   # 种子数据
├── docker-compose.dev.yml         # 开发环境（PostgreSQL + Redis）
├── docker-compose.yml             # 生产环境（全栈部署）
├── .env.example                   # 环境变量模板
├── .github/workflows/ci.yml       # CI/CD 流水线
└── pom.xml                        # 父 POM
```

---

## 端口配置

| 服务 | 端口 | 说明 |
|------|------|------|
| 后端 API | 8081 | Spring Boot（非默认 8080，因本机 httpd 占用）|
| 前端开发 | 5173 | Vite 开发服务器 |
| PostgreSQL | 5433 | Docker 容器（非默认 5432，避免本地 PG 冲突）|
| Redis | 6379 | Docker 容器 |

---

## 默认账号

| 角色 | 邮箱 | 密码 | 说明 |
|------|------|------|------|
| 超级管理员 | admin@qtplatform.com | Admin@123456 | init.sql 创建 |
| 测试用户 | zhangsan@example.com | Test@123456 | seed.sql 创建 |
| 测试用户 | lisi@example.com | Test@123456 | seed.sql 创建 |
| 测试用户 | wangwu@example.com | Test@123456 | seed.sql 创建 |
| 测试开发者 | chen@example.com | Test@123456 | seed.sql 创建 |
| 封禁用户 | banned@example.com | Test@123456 | seed.sql 创建（状态: BANNED）|

---

## 阶段一已完成功能（MVP）

### 后端（Step 1-7）

- [x] **公共模块**: 统一响应 `ApiResponse<T>` / `PageResponse<T>`、全局异常处理、JWT 工具、Redis/Jackson/MyBatis-Plus 配置
- [x] **用户模块**: 邮箱注册/登录、GitHub OAuth、JWT 认证、邮箱验证码、密码找回/重置、个人信息管理、语言偏好
- [x] **产品模块**: 产品 CRUD、分类管理、产品列表（分页/筛选/排序）、产品详情、语义化版本管理、多平台支持、灰度发布
- [x] **文件模块**: 文件上传/下载、断点续传、SHA256 校验、本地存储
- [x] **评论模块**: 评论 CRUD、评分（1-5 星）、评论点赞、树形回复
- [x] **通知/审计**: 站内通知、审计日志
- [x] **管理后台**: 仪表盘统计、用户管理（封禁/角色）、产品审核、评论管理、分类管理、系统配置
- [x] **安全体系**: Spring Security + JWT + RBAC（5 角色 17 权限）、登录限流、CORS

### 前端（Step 8-9）

- [x] **基础架构**: Vite + React + TypeScript + Redux Toolkit + React Router (懒加载) + i18n
- [x] **水墨主题**: CSS 变量（墨色五阶 + 宣纸色 + 点缀色）、Ant Design Token 全覆盖、动态主题系统
- [x] **前台页面（9 个）**: Home、Products、ProductDetail、Login、Register、ForgotPassword、Profile、OAuthCallback、NotFound
- [x] **后台页面（6 个）**: Dashboard、Users、Products、Comments、Categories、System
- [x] **API 层**: Axios 封装（token 注入 + 401 刷新）、9 个 API 模块、Mock 数据拦截器
- [x] **国际化**: 中文 / 英文完整翻译

### 部署（Step 10）

- [x] **Docker**: 后端多阶段 Dockerfile、前端 Dockerfile + Nginx、docker-compose.yml（生产全栈）
- [x] **CI/CD**: GitHub Actions 流水线（构建 + 测试 + Docker + 部署）
- [x] **配置**: .env.example、.dockerignore、docker-compose.dev.yml

### 数据库

- [x] **28 张表**: 用户、角色、权限、OAuth 绑定、邮箱验证、产品、版本、增量更新、分类、评论、点赞、订单（占位）、订阅（占位）、通知、下载记录（分区）、访问日志（分区）、系统配置、文件记录、审计日志、多语言
- [x] **索引**: GIN (tags)、部分索引 (is_latest)、复合索引
- [x] **触发器**: updated_at 自动更新
- [x] **种子数据**: 5 用户 + 6 分类 + 8 产品 + 版本 + 评论

---

## 阶段一待完成内容

- [x] 前后端联调（Mock → 真实 API 对接，可通过 VITE_ENABLE_MOCK=false 切换）
- [ ] 邮件服务配置（SMTP 真实发送）
- [ ] 文件上传/下载端到端测试
- [ ] 单元测试编写（前端 Jest + 后端 JUnit 5）
- [ ] 响应式设计优化（移动端适配）
- [ ] SEO 优化（react-helmet-async Meta 标签）
- [ ] 性能优化（代码分割、图片压缩、Bundle 分析）
- [ ] 腾讯云 CVM 部署上线

---

## 未来阶段规划

### 阶段二：微服务架构

- 微信/QQ OAuth 登录
- 微信/支付宝支付 + 订单系统
- VIP 会员订阅
- Spring Cloud 微服务拆分（文件服务 → 用户服务 → 支付服务 → 产品服务 → 通知服务 → 统计服务）
- Spring Cloud Gateway API 网关
- Nacos 注册中心
- Elasticsearch 全文搜索
- 腾讯云 COS 文件存储 + CDN
- RabbitMQ 消息队列
- Redis 哨兵模式
- ELK 日志系统
- SkyWalking 链路追踪

### 阶段三：规模化

- Kubernetes 容器编排
- 多地域部署
- 数据库读写分离
- 分布式缓存集群
- 全链路压测

---

## 相关文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 架构文档 | `Planning Document/Architecture Document.md` | 完整技术架构设计 |
| 阶段一设计 | `Planning Document/Phase One.md` | MVP 详细设计文档 |
| 水墨画设计 | `Planning Document/水墨画设计.md` | UI 设计规范 |
| 项目记忆 | `Memory/` | AI 辅助开发记忆系统 |
| 代码规范 | `.windsurf/rules/` | 前后端代码规范 |
| 前端测试素材 | `Front-end testing/` | 水墨背景图片/视频 |

---

## License

Private
