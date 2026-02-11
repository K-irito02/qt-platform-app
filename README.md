# Qt 产品发布平台

Qt 软件产品发布与分发平台 — Phase One MVP

## 技术栈

- **后端**: Spring Boot 3.2 + Spring Security 6.2 + MyBatis-Plus + PostgreSQL 15 + Redis 7
- **前端**: React 18 + TypeScript + Vite 5 + Ant Design 5 + Redux Toolkit
- **部署**: Docker + Nginx + GitHub Actions

## 快速开始

### 1. 环境要求

| 软件 | 版本 |
|------|------|
| JDK | OpenJDK 17 (Temurin) |
| Node.js | 22.x LTS |
| Docker Desktop | Latest |
| Maven | 3.9.x |
| Git | Latest |

### 2. 启动依赖服务

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 3. 启动后端

```bash
cd qt-platform-app
../mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# 访问 http://localhost:8080/swagger-ui.html
```

### 4. 启动前端

```bash
cd qt-platform-web
npm install
npm run dev
# 访问 http://localhost:5173
```

## 项目结构

```
qt-platform/
├── qt-platform-common/     # 公共模块
├── qt-platform-user/       # 用户模块
├── qt-platform-product/    # 产品模块
├── qt-platform-comment/    # 评论模块
├── qt-platform-file/       # 文件模块
├── qt-platform-admin/      # 后台管理模块
├── qt-platform-app/        # 主应用启动模块
├── qt-platform-web/        # 前端项目
├── sql/                    # 数据库脚本
├── docker/                 # Docker 配置
├── nginx/                  # Nginx 配置
└── .github/workflows/      # CI/CD
```

## 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 超级管理员 | admin | Admin@123456 |
# qt-platform-app
