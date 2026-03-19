# 企业IT知识门户 - 部署说明

## 项目简介

本项目是一个通用的企业内部IT系统知识资讯服务内容发布门户网站模板。可快速部署到企业内部环境使用。

## 功能模块

| 模块 | 说明 |
|------|------|
| 首页 | Banner、数据统计、快捷入口、热门内容 |
| 系统介绍 | IT系统分类、详情、文档链接 |
| 知识库 | 技术文档、标签搜索、附件上传 |
| 资讯中心 | 公告通知、分类筛选 |
| 问答社区 | 问题发布、回答互动 |
| IT团队 | 人员展示、值班表 |
| 管理后台 | 内容管理、用户管理 |

## 技术架构

### 前端技术栈
- Vue 3 + Composition API
- TypeScript
- Vite
- Element Plus
- Pinia (状态管理)
- wangeditor (富文本编辑器)
- DOMPurify (XSS防护)

### 后端技术选型建议

| 场景 | 推荐数据库 | 说明 |
|------|-----------|------|
| 通用企业内网 | PostgreSQL 15+ | 稳定、功能丰富、支持JSON、全文搜索 |
| 高并发问答 | MySQL 8.0 + Redis 7 | 读多写少，Redis缓存热门内容 |
| 文档类内容为主 | PostgreSQL + pgvector | 支持向量搜索，适合知识图谱 |
| 快速原型/小型 | SQLite + 文件存储 | 零配置，嵌入式部署 |

### 推荐架构

```
前端 (Vue 3 SPA)
    ↓ HTTPS
Nginx (反向代理 + 静态资源)
    ↓
后端 API (Node.js/Go/Java/Python)
    ↓
PostgreSQL (主数据库)
    ↓
Redis (缓存 + Session存储)
    ↓
OSS/MinIO (文件存储 - 附件)
```

## 敏感信息替换清单

部署前请将以下占位符替换为实际信息：

### 1. 环境变量配置
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
VITE_API_BASE_URL=https://api.yourcompany.com
VITE_COMPANY_NAME=您的公司名称
VITE_IT_EMAIL=it@yourcompany.com
VITE_HOTLINE=8000
```

### 2. Logo和图标
```bash
# 替换 src/assets/ 目录下的logo图片
```

## 架构说明

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                           │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Nginx (端口 80)                        │
│                  反向代理 + 静态资源                          │
└─────────────────────────┬─────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
┌──────────────────┐            ┌──────────────────┐
│   Vue 3 SPA      │            │   后端 API      │
│   (dist/)        │            │   (端口 3000)   │
└──────────────────┘            └────────┬─────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          │                             │
                          ▼                             ▼
               ┌──────────────────┐          ┌──────────────────┐
               │   PostgreSQL      │          │      Redis        │
               │   (端口 5432)    │          │    (端口 6379)    │
               └──────────────────┘          └──────────────────┘
```

### 端口对应关系

| 服务 | 端口 | 用途 | 访问方式 |
|------|------|------|----------|
| Nginx | 80 | 对外服务 | 浏览器直接访问 |
| Vite Dev | 5173 | 开发服务器 | `npm run dev` 后访问 |
| Node.js API | 3000 | 后端接口 | Docker 内部通信 |
| PostgreSQL | 5432 | 数据库 | Docker 内部通信 |
| Redis | 6379 | 缓存 | Docker 内部通信 |

### 开发 vs 生产

| 场景 | 命令 | 端口 | 说明 |
|------|------|------|------|
| 开发 | `npm run dev` | 5173 | 热更新，Mock 数据 |
| 预览 | `npm run preview` | 4173 | 预览构建结果 |
| 生产 (手动) | `npm run build` | 80 | Nginx 提供静态文件 |
| 生产 (Docker) | `docker-compose up` | 80 | 完整容器化部署 |

## 快速部署

### 环境要求
- Node.js >= 18.x
- npm >= 9.x 或 pnpm >= 8.x
- Docker (可选)

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/lcq225/ITservices.git
cd ITservices/it-knowledge-portal

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件配置实际信息

# 3. 安装依赖
npm install

# 4. 开发模式运行
npm run dev

# 5. 生产构建
npm run build
```

### Docker 部署（推荐）

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f frontend
```

### 手动 Nginx 部署

```bash
# 1. 构建项目
npm run build

# 2. 复制构建产物
cp -r dist/* /var/www/html/

# 3. 配置 Nginx
cp nginx.conf /etc/nginx/conf.d/it-portal.conf

# 4. 重载 Nginx
nginx -t && nginx -s reload
```

### 部署检查清单

- [ ] 配置环境变量 (.env)
- [ ] 配置正确的API后端地址
- [ ] 配置HTTPS证书
- [ ] 设置适当的缓存策略
- [ ] 配置日志存储路径
- [ ] 备份数据库和配置文件
- [ ] 配置防火墙规则
- [ ] 配置备份策略

## 数据库设计建议

### PostgreSQL 表结构

```sql
-- 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    avatar VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user', -- user, it, admin
    phone VARCHAR(20),
    email VARCHAR(100),
    department VARCHAR(100),
    title VARCHAR(100),
    expertise TEXT[],
    status VARCHAR(20) DEFAULT 'online',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 系统表
CREATE TABLE systems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50),
    description TEXT,
    manager_id INTEGER REFERENCES users(id),
    doc_links JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'online',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章表（知识库/资讯）
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    type VARCHAR(20) NOT NULL, -- knowledge, news
    system_id INTEGER REFERENCES systems(id),
    author_id INTEGER REFERENCES users(id),
    tags TEXT[],
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 附件表
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    article_id INTEGER REFERENCES articles(id),
    uploader_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 问题表
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    author_id INTEGER REFERENCES users(id),
    tags TEXT[],
    answer_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    has_accepted_answer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 回答表
CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT,
    author_id INTEGER REFERENCES users(id),
    is_accepted BOOLEAN DEFAULT FALSE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 全文搜索索引
CREATE INDEX idx_articles_title ON articles USING gin(to_tsvector('simple', title));
CREATE INDEX idx_articles_content ON articles USING gin(to_tsvector('simple', content));
CREATE INDEX idx_questions_title ON questions USING gin(to_tsvector('simple', title));
```

## 安全配置

### XSS 防护
- 使用 DOMPurify 过滤用户输入的 HTML 内容
- 限制允许的 HTML 标签和属性
- 内容展示使用纯文本或净化后的 HTML

### CSRF 防护
- API 请求使用 Bearer Token 认证
- 后端验证 Token 有效性

### SQL注入防护
- 使用 Prisma ORM 参数化查询
- 禁止字符串拼接 SQL

### 文件上传安全
- 限制文件类型和大小
- 文件存储在非 Web 根目录
- 生成随机文件名

### Rate Limiting 防暴力破解
- 登录接口：15分钟内最多10次尝试
- API 接口：每分钟最多100次请求
- 上传接口：每分钟最多20次上传

### 操作日志审计
- 所有 API 请求记录日志
- 敏感操作记录审计日志
- 日志文件存储在 `logs/` 目录

### Helmet 安全头
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### 生产环境安全建议

```bash
# 1. 设置强 JWT 密钥（至少32位随机字符）
JWT_SECRET=$(openssl rand -base64 32)

# 2. 设置前端域名
CORS_ORIGIN="https://your-domain.com"

# 3. 启用 HTTPS（使用 Nginx 反向代理）

# 4. 配置防火墙
# - 80/443 端口对外开放
# - 3000/5432/6379 仅内部访问

# 5. 定期备份数据库
pg_dump it_services > backup_$(date +%Y%m%d).sql
```

## 后端 API 对接

项目已实现 API 服务层，配置后端地址后可直接对接。

```typescript
// src/api/request.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
```

### API 结构

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/auth/login | POST | 用户登录 |
| /api/auth/logout | POST | 退出登录 |
| /api/auth/current | GET | 获取当前用户 |
| /api/articles | GET | 获取文章列表 |
| /api/articles/:id | GET | 获取文章详情 |
| /api/articles | POST | 创建文章 |
| /api/articles/:id | PUT | 更新文章 |
| /api/articles/:id | DELETE | 删除文章 |
| /api/systems | GET | 获取系统列表 |
| /api/questions | GET | 获取问题列表 |
| /api/questions | POST | 发布问题 |
| /api/questions/:id/answers | POST | 回答问题 |

## 目录结构

```
it-knowledge-portal/
├── src/                        # 前端源码
│   ├── api/                    # API 接口
│   │   ├── request.ts         # Axios 封装
│   │   ├── services/          # API 服务
│   │   └── mock.ts            # Mock 数据
│   ├── assets/                # 静态资源
│   ├── components/             # 公共组件
│   ├── router/                # 路由配置
│   ├── stores/                # Pinia 状态管理
│   ├── types/                 # TypeScript 类型
│   ├── utils/                 # 工具函数
│   │   ├── socket.ts          # WebSocket 服务
│   │   ├── search.ts          # 搜索服务
│   │   └── xss.ts            # XSS 防护
│   └── views/                 # 页面视图
├── screenshots/               # 界面截图
├── .env.example               # 环境变量模板
├── .env.development          # 开发环境变量
├── vite.config.ts            # Vite 配置（含 API 代理）
├── docker-compose.yml         # Docker 编排
├── Dockerfile                # 前端 Docker 构建
└── nginx.conf                # Nginx 配置

it-services-backend/           # 后端项目（独立目录）
├── src/
│   ├── config/               # 配置文件
│   ├── controllers/           # 控制器
│   ├── middleware/           # 中间件
│   ├── routes/                # 路由
│   ├── types/                 # 类型定义
│   ├── utils/                # 工具函数
│   └── index.ts              # 入口文件
├── prisma/
│   ├── schema.prisma         # 数据库模型
│   └── seed.ts               # 种子数据
├── uploads/                   # 文件上传目录
├── .env.example              # 环境变量模板
└── package.json
```

## 后端服务

### 技术栈

- Node.js 18+ / Express
- Prisma ORM
- PostgreSQL 15+
- Socket.IO (WebSocket)
- JWT 认证
- Multer (文件上传)

### 快速启动

```bash
# 1. 进入后端目录
cd it-services-backend

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 4. 生成 Prisma Client
npx prisma generate

# 5. 创建数据库表
npx prisma db push

# 6. 填充种子数据
npx prisma db seed

# 7. 启动开发服务器
npm run dev
```

### 测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| IT人员 | zhangmh | it123456 |

### API 端点

#### 认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 退出登录
- `GET /api/auth/current` - 获取当前用户

#### 文章
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:id` - 获取文章详情
- `POST /api/articles` - 创建文章（需IT角色）
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章
- `POST /api/articles/:id/like` - 点赞

#### 问题
- `GET /api/questions` - 获取问题列表
- `GET /api/questions/:id` - 获取问题详情
- `POST /api/questions` - 发布问题
- `DELETE /api/questions/:id` - 删除问题
- `POST /api/questions/:id/answers` - 回答问题
- `POST /api/questions/:id/answers/:answerId/accept` - 采纳答案

#### 系统
- `GET /api/systems` - 获取系统列表
- `GET /api/systems/:id` - 获取系统详情
- `POST /api/systems` - 创建系统（需Admin角色）
- `PUT /api/systems/:id` - 更新系统
- `DELETE /api/systems/:id` - 删除系统

#### 附件
- `POST /api/attachments` - 上传附件
- `DELETE /api/attachments/:id` - 删除附件

## 技术支持

如有问题，请联系IT部门或提交Issue。
