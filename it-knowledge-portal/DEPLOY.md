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
- 使用参数化查询或 ORM
- 禁止字符串拼接 SQL

### 文件上传安全
- 限制文件类型和大小
- 文件存储在非 Web 根目录
- 生成随机文件名

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
├── src/
│   ├── api/
│   │   ├── request.ts          # Axios 封装
│   │   ├── services/           # API 服务
│   │   └── mock.ts             # Mock数据
│   ├── assets/                 # 静态资源
│   ├── components/             # 公共组件
│   ├── router/                 # 路由配置
│   ├── stores/                 # Pinia 状态管理
│   ├── types/                  # TypeScript类型
│   ├── utils/                  # 工具函数 (XSS防护等)
│   └── views/                  # 页面视图
├── .env.example                # 环境变量模板
├── .env.development           # 开发环境变量
├── docker-compose.yml         # Docker 编排
├── Dockerfile                  # Docker 构建
├── nginx.conf                  # Nginx 配置
└── package.json
```

## 技术支持

如有问题，请联系IT部门或提交Issue。
