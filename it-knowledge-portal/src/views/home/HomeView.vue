<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articles, questions, systems } from '@/api/mock'
import {
  Bell,
  Document,
  ChatDotRound,
  Monitor,
  Files,
  Notebook,
  QuestionFilled,
  User,
  Lightning,
  Fire,
  Tickets,
  DArrowRight,
  View,
  Star,
  ChatLineSquare
} from '@element-plus/icons-vue'

const router = useRouter()

const currentBannerIndex = ref(0)
const searchQuery = ref('')

const banners = [
  {
    id: 1,
    title: 'IT服务门户全新上线',
    subtitle: '一站式获取IT知识、资讯与支持'
  },
  {
    id: 2,
    title: '知识库已收录100+技术文档',
    subtitle: '覆盖核心系统操作指南与运维手册'
  },
  {
    id: 3,
    title: '问答社区已解决500+问题',
    subtitle: '遇到问题？来这里寻求帮助'
  }
]

const stats = [
  { label: 'IT系统', value: systems.length, icon: Monitor },
  { label: '知识文档', value: articles.filter(a => a.type === 'knowledge').length + 10, icon: Document },
  { label: '资讯文章', value: articles.filter(a => a.type === 'news').length + 20, icon: Notebook },
  { label: '互动问答', value: questions.length + 50, icon: QuestionFilled }
]

const quickLinks = [
  { title: '知识库', desc: '技术文档与操作指南', icon: Document, path: '/knowledge', color: '#0070F3' },
  { title: '资讯中心', desc: '系统公告与通知', icon: Bell, path: '/news', color: '#00D4FF' },
  { title: '问答社区', desc: '问题咨询与交流', icon: ChatDotRound, path: '/qa', color: '#0099CC' },
  { title: 'IT团队', desc: '运维人员与值班表', icon: User, path: '/team', color: '#00F5A0' }
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
            <el-input
              v-model="searchQuery"
              placeholder="搜索知识、问题、系统..."
              @keyup.enter="handleSearch"
              class="search-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" class="search-btn" @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </div>
          <div class="hero-tags">
            <el-tag v-for="tag in ['ERP系统', 'VPN连接', '账号申请', '邮箱设置']" :key="tag" effect="plain" round>{{ tag }}</el-tag>
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
            <div class="banner-icon-wrapper">
              <el-icon class="banner-icon"><Bell /></el-icon>
            </div>
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
          <div class="stat-icon-wrapper">
            <el-icon class="stat-icon"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Links Section -->
      <section class="section">
        <h2 class="section-title">
          <el-icon class="title-icon"><Lightning /></el-icon>
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
              <el-icon :style="{ color: link.color }"><component :is="link.icon" /></el-icon>
            </div>
            <div class="quick-info">
              <h3>{{ link.title }}</h3>
              <p>{{ link.desc }}</p>
            </div>
            <el-icon class="quick-arrow"><DArrowRight /></el-icon>
          </div>
        </div>
      </section>

      <!-- Hot Knowledge Section -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon class="title-icon fire"><Fire /></el-icon>
            热门知识
          </h2>
          <el-button text type="primary" @click="router.push('/knowledge')">查看更多</el-button>
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
                <el-tag v-for="tag in article.tags.slice(0, 2)" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
              </div>
            </div>
            <div class="article-meta">
              <div class="meta-left">
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  {{ formatViews(article.views) }}
                </span>
                <span class="meta-item">
                  <el-icon><Star /></el-icon>
                  {{ article.likes }}
                </span>
              </div>
              <span class="article-author">{{ article.author }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Two Column Layout -->
      <el-row :gutter="24" class="two-col-section">
        <!-- Latest News -->
        <el-col :xs="24" :sm="24" :md="12">
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">
                <el-icon class="title-icon"><Tickets /></el-icon>
                最新资讯
              </h2>
              <el-button text type="primary" @click="router.push('/news')">查看更多</el-button>
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
                    <span class="news-views"><el-icon><View /></el-icon> {{ formatViews(news.views) }} 阅读</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </el-col>

        <!-- Hot Questions -->
        <el-col :xs="24" :sm="24" :md="12">
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">
                <el-icon class="title-icon"><ChatLineSquare /></el-icon>
                热门问答
              </h2>
              <el-button text type="primary" @click="router.push('/qa')">查看更多</el-button>
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
                    <el-tag v-for="tag in q.tags.slice(0, 2)" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                  </div>
                </div>
                <div class="qa-stats">
                  <span class="qa-answers" :class="{ accepted: q.hasAcceptedAnswer }">
                    <el-icon><ChatDotRound /></el-icon>
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

<script lang="ts">
import { Search } from '@element-plus/icons-vue'
export default {
  components: { Search }
}
</script>

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

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
  }
}

.hero-content {
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  padding: 48px;
  color: #fff;
}

@media (max-width: 768px) {
  .hero-content {
    padding: 32px 24px;
  }
}

.hero-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 24px;
  }
}

.hero-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 32px;
}

.hero-search {
  display: flex;
  gap: 8px;
  background: #fff;
  border-radius: 28px;
  padding: 6px 6px 6px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.search-input {
  flex: 1;
}

.search-input :deep(.el-input__wrapper) {
  box-shadow: none;
  background: transparent;
}

.search-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-tags {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.hero-tags .el-tag {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
}

.hero-tags .el-tag:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hero-banner {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 1024px) {
  .hero-banner {
    display: none;
  }
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

.banner-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-icon {
  font-size: 24px;
  color: var(--primary-color);
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

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
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

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  font-size: 28px;
  color: var(--primary-color);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1.2;
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
  color: var(--primary-color);
}

.title-icon.fire {
  color: #ff6b35;
}

/* Quick Links */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .quick-grid {
    grid-template-columns: 1fr;
  }
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

.quick-icon .el-icon {
  font-size: 28px;
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
  font-size: 18px;
}

/* Articles Grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
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

/* Two Column Section */
.two-col-section {
  margin: 0 -12px;
}

.two-col-section .el-col {
  padding: 0 12px;
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

.news-content {
  flex: 1;
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

.news-views {
  display: flex;
  align-items: center;
  gap: 4px;
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

.qa-content {
  flex: 1;
  min-width: 0;
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

.qa-stats {
  flex-shrink: 0;
  margin-left: 16px;
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
