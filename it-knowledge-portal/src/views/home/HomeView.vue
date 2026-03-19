<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articles, questions, systems } from '@/api/mock'

const router = useRouter()

const currentBannerIndex = ref(0)
const searchQuery = ref('')

const banners = [
  {
    id: 1,
    title: 'IT服务门户全新上线',
    subtitle: '一站式获取IT知识、资讯与支持',
    icon: '📢'
  },
  {
    id: 2,
    title: '知识库已收录100+技术文档',
    subtitle: '覆盖核心系统操作指南与运维手册',
    icon: '📚'
  },
  {
    id: 3,
    title: '问答社区已解决500+问题',
    subtitle: '遇到问题？来这里寻求帮助',
    icon: '💬'
  }
]

const stats = [
  { label: 'IT系统', value: systems.length, icon: '🖥️' },
  { label: '知识文档', value: articles.filter(a => a.type === 'knowledge').length + 10, icon: '📄' },
  { label: '资讯文章', value: articles.filter(a => a.type === 'news').length + 20, icon: '📰' },
  { label: '互动问答', value: questions.length + 50, icon: '💭' }
]

const quickLinks = [
  { title: '知识库', desc: '技术文档与操作指南', icon: '📚', path: '/knowledge', color: '#0070F3' },
  { title: '资讯中心', desc: '系统公告与通知', icon: '📢', path: '/news', color: '#00D4FF' },
  { title: '问答社区', desc: '问题咨询与交流', icon: '💬', path: '/qa', color: '#0099CC' },
  { title: 'IT团队', desc: '运维人员与值班表', icon: '👥', path: '/team', color: '#00F5A0' }
]

const hotArticles = articles.filter(a => a.type === 'knowledge').slice(0, 4)
const latestNews = articles.filter(a => a.type === 'news').slice(0, 3)
const hotQuestions = questions.slice(0, 4)

const formatViews = (views: number) => views > 1000 ? `${(views / 1000).toFixed(1)}k` : views.toString()
const formatDate = (date: string) => date

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/knowledge', query: { q: searchQuery.value } })
  }
}

const handleBannerChange = (index: number) => {
  currentBannerIndex.value = index
}
</script>

<template>
  <div class="home">
    <div class="container">
      <!-- Hero Section -->
      <div class="hero">
        <div class="hero-content">
          <h1 class="hero-title">欢迎使用企业IT服务门户</h1>
          <p class="hero-subtitle">轻松获取IT知识、浏览系统公告、解决技术问题</p>
          <div class="hero-search">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索知识、问题、系统..."
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          </div>
          <div class="hero-tags">
            <span class="tag">ERP系统</span>
            <span class="tag">VPN连接</span>
            <span class="tag">账号申请</span>
            <span class="tag">邮箱设置</span>
          </div>
        </div>
        <div class="hero-banner">
          <div
            v-for="(banner, index) in banners"
            :key="banner.id"
            class="banner-card"
            :class="{ active: currentBannerIndex === index }"
            @click="currentBannerIndex = index"
          >
            <span class="banner-icon">{{ banner.icon }}</span>
            <div class="banner-text">
              <h3>{{ banner.title }}</h3>
              <p>{{ banner.subtitle }}</p>
            </div>
          </div>
          <div class="banner-dots">
            <span
              v-for="(_, index) in banners"
              :key="index"
              class="dot"
              :class="{ active: currentBannerIndex === index }"
              @click="handleBannerChange(index)"
            ></span>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-info">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Links Section -->
      <section class="section">
        <h2 class="section-title">
          <span class="title-icon">⚡</span>
          快捷入口
        </h2>
        <div class="quick-grid">
          <div
            v-for="link in quickLinks"
            :key="link.path"
            class="quick-card"
            @click="router.push(link.path)"
          >
            <div class="quick-icon" :style="{ background: `${link.color}15` }">
              <span style="font-size: 24px">{{ link.icon }}</span>
            </div>
            <div class="quick-info">
              <h3>{{ link.title }}</h3>
              <p>{{ link.desc }}</p>
            </div>
            <svg class="quick-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- Hot Knowledge Section -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-icon">🔥</span>
            热门知识
          </h2>
          <button class="more-btn" @click="router.push('/knowledge')">查看更多</button>
        </div>
        <div class="articles-grid">
          <div
            v-for="article in hotArticles"
            :key="article.id"
            class="article-card"
            @click="router.push(`/knowledge/${article.id}`)"
          >
            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.content.replace(/<[^>]+>/g, '').substring(0, 80) }}...</p>
              <div class="article-tags">
                <span v-for="tag in article.tags.slice(0, 2)" :key="tag" class="article-tag">{{ tag }}</span>
              </div>
            </div>
            <div class="article-meta">
              <div class="meta-left">
                <span class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {{ formatViews(article.views) }}
                </span>
                <span class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  {{ article.likes }}
                </span>
              </div>
              <span class="article-author">{{ article.author }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Two Column Layout -->
      <el-row :gutter="24">
        <!-- Latest News -->
        <el-col :span="12">
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="title-icon">📰</span>
                最新资讯
              </h2>
              <button class="more-btn" @click="router.push('/news')">查看更多</button>
            </div>
            <div class="news-list">
              <div
                v-for="news in latestNews"
                :key="news.id"
                class="news-item"
                @click="router.push(`/news/${news.id}`)"
              >
                <div class="news-indicator"></div>
                <div class="news-content">
                  <h4>{{ news.title }}</h4>
                  <div class="news-meta">
                    <span class="news-date">{{ formatDate(news.createdAt) }}</span>
                    <span class="news-views">{{ formatViews(news.views) }} 阅读</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </el-col>

        <!-- Hot Questions -->
        <el-col :span="12">
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="title-icon">💬</span>
                热门问答
              </h2>
              <button class="more-btn" @click="router.push('/qa')">查看更多</button>
            </div>
            <div class="qa-list">
              <div
                v-for="q in hotQuestions"
                :key="q.id"
                class="qa-item"
                @click="router.push(`/qa/${q.id}`)"
              >
                <div class="qa-content">
                  <h4>{{ q.title }}</h4>
                  <div class="qa-tags">
                    <span v-for="tag in q.tags.slice(0, 2)" :key="tag" class="qa-tag">{{ tag }}</span>
                  </div>
                </div>
                <div class="qa-stats">
                  <span class="qa-answers" :class="{ accepted: q.hasAcceptedAnswer }">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {{ q.answerCount }}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: 40px;
}

/* Hero Section */
.hero {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  margin-bottom: 32px;
}

.hero-content {
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  padding: 48px;
  color: #fff;
}

.hero-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 32px;
}

.hero-search {
  display: flex;
  background: #fff;
  border-radius: 28px;
  padding: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.hero-search input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 20px;
  font-size: 15px;
  color: var(--text-primary);
  background: transparent;
}

.hero-search input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gradient-primary);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.search-btn:hover {
  transform: scale(1.05);
}

.hero-tags {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.tag {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hero-banner {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.banner-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.banner-card.active {
  opacity: 1;
  box-shadow: var(--shadow-md);
  border-left: 3px solid var(--primary-color);
}

.banner-icon {
  font-size: 32px;
}

.banner-text h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.banner-text p {
  font-size: 13px;
  color: var(--text-muted);
}

.banner-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dot.active {
  width: 24px;
  border-radius: 4px;
  background: var(--gradient-primary);
}

/* Stats Section */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  display: block;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
}

/* Sections */
.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 24px;
}

.more-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-btn:hover {
  text-decoration: underline;
}

/* Quick Links */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.quick-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-info {
  flex: 1;
  min-width: 0;
}

.quick-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.quick-info p {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-arrow {
  color: var(--text-muted);
  flex-shrink: 0;
}

/* Articles Grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.article-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.article-excerpt {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
  flex: 1;
}

.article-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.article-tag {
  padding: 4px 10px;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: 4px;
  font-size: 12px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.meta-left {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.article-author {
  font-size: 13px;
  color: var(--text-muted);
}

/* News List */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.news-indicator {
  width: 4px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 2px;
  flex-shrink: 0;
}

.news-content h4 {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.news-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

/* QA List */
.qa-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qa-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.qa-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.qa-content h4 {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.qa-tags {
  display: flex;
  gap: 8px;
}

.qa-tag {
  padding: 2px 8px;
  background: var(--bg-color);
  color: var(--text-secondary);
  border-radius: 4px;
  font-size: 12px;
}

.qa-stats {
  flex-shrink: 0;
}

.qa-answers {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--text-muted);
}

.qa-answers.accepted {
  color: var(--success-color);
}
</style>
