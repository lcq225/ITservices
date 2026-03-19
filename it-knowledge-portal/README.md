# 企业IT知识门户

企业内部IT系统知识资讯服务的内容发布门户网站，提供知识库管理、资讯发布、问答社区、系统介绍和IT团队展示等功能。

## 界面预览

### 首页
![首页](screenshots/首页.png)

### 系统介绍
![系统介绍](screenshots/系统介绍.png)

### 知识库
![知识库](screenshots/知识库.png)

### 资讯中心
![资讯中心](screenshots/资讯中心.png)

### 问答社区
![问答社区](screenshots/问答社区.png)

### IT团队
![IT团队](screenshots/IT团队.png)

### 登录页
![登录](screenshots/登录.png)

## 系统功能

### 1. 首页
- Banner轮播展示重要通知和公告
- 数据统计面板（在线系统、知识文档、资讯、问答数量）
- 快捷入口快速跳转到各模块
- 热门知识、最新资讯、热门问答展示

### 2. 系统介绍
- IT系统分类展示（核心系统、基础设施、安全系统、应用系统）
- 系统详情页（简介、负责人、联系方式、相关文档）
- 系统状态标识（运行中、维护中、已下线）

### 3. 知识库
- 技术文档分类浏览和搜索
- 标签筛选功能
- 富文本编辑器支持图文混排
- 附件上传下载功能
- 点赞和浏览统计

### 4. 资讯中心
- 系统公告、维护通知、安全预警分类
- 富文本文章详情
- 发布时间展示

### 5. 问答社区
- 发布技术问题
- 回答和互动交流
- 答案采纳标记
- 标签分类和搜索

### 6. IT团队
- 运维人员展示（头像、职位、专长）
- 联系方式展示（电话、邮箱）
- 值班表安排

### 7. 管理后台
- 内容管理（知识文档、问答审核）
- 系统管理（增删改查）
- 用户管理（IT人员账号）
- 数据统计面板

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 + Composition API |
| 构建工具 | Vite |
| 语言 | TypeScript |
| UI组件库 | Element Plus |
| 富文本编辑器 | wangeditor |
| 路由 | Vue Router |
| 状态管理 | Pinia |
| HTTP客户端 | Axios |

## 项目结构

```
it-knowledge-portal/
├── src/
│   ├── api/              # API接口和Mock数据
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   │   └── Layout.vue    # 布局组件
│   ├── router/           # 路由配置
│   ├── types/            # TypeScript类型定义
│   ├── views/            # 页面视图
│   │   ├── home/         # 首页
│   │   ├── systems/      # 系统介绍
│   │   ├── knowledge/    # 知识库
│   │   ├── news/         # 资讯中心
│   │   ├── qa/           # 问答社区
│   │   ├── team/         # IT团队
│   │   └── admin/        # 管理后台
│   ├── App.vue
│   └── main.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 安装部署

### 环境要求

- Node.js >= 18.x
- npm >= 9.x 或 pnpm >= 8.x

### 安装依赖

```bash
cd it-knowledge-portal
npm install
```

### 开发运行

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录

### 预览构建结果

```bash
npm run preview
```

## 后续优化建议

1. **对接后端API**：将Mock数据替换为真实API接口
2. **用户认证**：实现登录注册和权限管理
3. **附件存储**：集成文件上传到OSS/S3等对象存储
4. **全文搜索**：集成Elasticsearch或类似搜索引擎
5. **消息通知**：WebSocket实现实时消息推送
6. **数据统计**：添加访问日志和用户行为分析

## License

MIT
