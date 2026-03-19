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

## 敏感信息替换清单

部署前请将以下占位符替换为实际信息：

### 1. 公司/组织名称
```bash
# 替换为实际公司名称
企业IT知识门户 → [实际公司名]IT知识门户
企业IT → [实际公司名]
```

### 2. 邮箱域名
```bash
# src/api/mock.ts 中的邮箱
@example.com → @yourcompany.com
```

### 3. 系统访问地址
```bash
# src/api/mock.ts
erp.example.com → erp.yourcompany.com
```

### 4. 联系方式
```bash
# src/components/Layout.vue
8000 → 实际服务热线
it@example.com → 实际IT邮箱
```

### 5. Logo和图标
```bash
# 替换 src/assets/ 目录下的logo图片
```

## 快速部署

### 环境要求
- Node.js >= 18.x
- npm >= 9.x 或 pnpm >= 8.x

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/lcq225/ITservices.git
cd ITservices/it-knowledge-portal

# 2. 安装依赖
npm install

# 3. 开发模式运行
npm run dev

# 4. 生产构建
npm run build
```

### 部署方式

#### 方式一：Nginx 静态部署

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/it-knowledge-portal/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server:port;
    }
}
```

#### 方式二：Docker 部署

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 部署检查清单

- [ ] 替换所有敏感信息占位符
- [ ] 配置正确的API后端地址
- [ ] 配置HTTPS证书
- [ ] 设置适当的缓存策略
- [ ] 配置日志存储路径
- [ ] 备份数据库和配置文件

## 后端对接

### API结构

项目预留以下API接口，需根据实际后端实现：

```typescript
// 知识库
GET    /api/knowledge          # 获取知识列表
GET    /api/knowledge/:id      # 获取知识详情
POST   /api/knowledge          # 创建知识
PUT    /api/knowledge/:id      # 更新知识
DELETE /api/knowledge/:id      # 删除知识

// 资讯
GET    /api/news               # 获取资讯列表
GET    /api/news/:id           # 获取资讯详情

// 问答
GET    /api/questions           # 获取问题列表
GET    /api/questions/:id      # 获取问题详情
POST   /api/questions          # 发布问题
POST   /api/questions/:id/answers  # 回答问题

// 系统
GET    /api/systems            # 获取系统列表
GET    /api/systems/:id       # 获取系统详情

// 团队
GET    /api/team               # 获取团队成员
```

### 替换Mock数据

将 `src/api/mock.ts` 中的模拟数据替换为axios请求：

```typescript
import axios from 'axios'

export const getKnowledgeList = async () => {
  const { data } = await axios.get('/api/knowledge')
  return data
}
```

## 目录结构

```
it-knowledge-portal/
├── src/
│   ├── api/
│   │   └── mock.ts           # Mock数据（替换为真实API）
│   ├── assets/               # 静态资源
│   ├── components/           # 公共组件
│   ├── router/               # 路由配置
│   ├── types/                # TypeScript类型
│   ├── views/                # 页面视图
│   ├── App.vue
│   └── main.ts
├── dist/                     # 构建产物
├── nginx.conf                # Nginx配置示例
├── Dockerfile                # Docker配置示例
└── package.json
```

## 技术支持

如有问题，请联系IT部门或提交Issue。
