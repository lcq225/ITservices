<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { banners, articles, questions, systems } from '@/api/mock'

const router = useRouter()

const currentBannerIndex = ref(0)

const formatDate = (date: string) => date

const formatViews = (views: number) => views > 1000 ? `${(views / 1000).toFixed(1)}k` : views.toString()

const hotArticles = articles.filter(a => a.type === 'knowledge').slice(0, 5)
const latestNews = articles.filter(a => a.type === 'news').slice(0, 4)
const hotQuestions = questions.slice(0, 5)
const onlineSystems = systems.filter(s => s.status === 'online').length

const quickLinks = [
  { icon: 'Document', title: '知识库', desc: '技术文档与操作指南', path: '/knowledge', color: '#409EFF' },
  { icon: 'Collection', title: '资讯中心', desc: '系统公告与通知', path: '/news', color: '#67C23A' },
  { icon: 'ChatDotRound', title: '问答社区', desc: '问题咨询与交流', path: '/qa', color: '#E6A23C' },
  { icon: 'User', title: 'IT团队', desc: '运维人员与值班表', path: '/team', color: '#909399' }
]

const handleBannerChange = (index: number) => {
  currentBannerIndex.value = index
}
</script>

<template>
  <div class="home">
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="banner">
            <el-carousel height="360px" indicator-position="outside" @change="handleBannerChange">
              <el-carousel-item v-for="banner in banners" :key="banner.id">
                <div class="banner-item" @click="router.push(banner.link)">
                  <img :src="banner.image" :alt="banner.title" />
                  <div class="banner-overlay">
                    <span class="banner-type" :class="banner.type">
                      {{ banner.type === 'notice' ? '通知' : banner.type === 'system' ? '系统' : '活动' }}
                    </span>
                    <h3 class="banner-title">{{ banner.title }}</h3>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stats-panel">
            <h3 class="panel-title">数据统计</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ onlineSystems }}</div>
                <div class="stat-label">在线系统</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ hotArticles.length + 10 }}</div>
                <div class="stat-label">知识文档</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ latestNews.length + 20 }}</div>
                <div class="stat-label">资讯文章</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ hotQuestions.length + 50 }}</div>
                <div class="stat-label">问答总数</div>
              </div>
            </div>
            <div class="quick-entry">
              <h4>快捷入口</h4>
              <div class="quick-links">
                <div
                  v-for="link in quickLinks"
                  :key="link.path"
                  class="quick-link-item"
                  :style="{ borderLeftColor: link.color }"
                  @click="router.push(link.path)"
                >
                  <span class="quick-link-title">{{ link.title }}</span>
                  <span class="quick-link-desc">{{ link.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="section-row">
        <el-col :span="16">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">热门知识</h3>
              <el-button type="primary" text @click="router.push('/knowledge')">查看更多</el-button>
            </div>
            <div class="article-list">
              <div
                v-for="article in hotArticles"
                :key="article.id"
                class="article-item"
                @click="router.push(`/knowledge/${article.id}`)"
              >
                <div class="article-info">
                  <h4 class="article-title">{{ article.title }}</h4>
                  <div class="article-meta">
                    <el-tag size="small" v-for="tag in article.tags.slice(0, 2)" :key="tag">{{ tag }}</el-tag>
                    <span class="article-date">{{ formatDate(article.createdAt) }}</span>
                  </div>
                </div>
                <div class="article-stats">
                  <span><el-icon><View /></el-icon> {{ formatViews(article.views) }}</span>
                  <span><el-icon><Star /></el-icon> {{ article.likes }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">最新资讯</h3>
              <el-button type="primary" text @click="router.push('/news')">查看更多</el-button>
            </div>
            <div class="news-list">
              <div
                v-for="news in latestNews"
                :key="news.id"
                class="news-item"
                @click="router.push(`/news/${news.id}`)"
              >
                <span class="news-title">{{ news.title }}</span>
                <span class="news-date">{{ formatDate(news.createdAt) }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">热门问答</h3>
              <el-button type="primary" text @click="router.push('/qa')">查看更多</el-button>
            </div>
            <div class="qa-list">
              <div
                v-for="q in hotQuestions"
                :key="q.id"
                class="qa-item"
                @click="router.push(`/qa/${q.id}`)"
              >
                <div class="qa-content">
                  <h4 class="qa-title">{{ q.title }}</h4>
                  <div class="qa-meta">
                    <el-tag size="small" v-for="tag in q.tags" :key="tag">{{ tag }}</el-tag>
                    <span class="qa-author">{{ q.author }}</span>
                  </div>
                </div>
                <div class="qa-stats">
                  <span class="answer-count" :class="{ 'has-answer': q.hasAcceptedAnswer }">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ q.answerCount }}
                  </span>
                  <span><el-icon><View /></el-icon> {{ formatViews(q.views) }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.banner {
  border-radius: 8px;
  overflow: hidden;
}

.banner-item {
  position: relative;
  height: 360px;
  cursor: pointer;
}

.banner-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 24px 24px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.banner-type {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  margin-bottom: 8px;
}

.banner-type.notice {
  background: #F56C6C;
}

.banner-type.system {
  background: #409EFF;
}

.banner-type.activity {
  background: #67C23A;
}

.banner-title {
  color: #fff;
  font-size: 24px;
  margin: 0;
}

.stats-panel {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--primary-color);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.quick-entry h4 {
  font-size: 16px;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-link-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 6px;
  border-left: 4px solid;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-link-item:hover {
  transform: translateX(4px);
  background: var(--primary-light);
}

.quick-link-title {
  font-weight: 600;
  color: var(--text-primary);
}

.quick-link-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.section-row {
  margin-top: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.article-item:hover {
  background: var(--primary-light);
}

.article-title {
  font-size: 15px;
  margin: 0 0 8px;
  color: var(--text-primary);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.article-date {
  font-size: 12px;
  color: var(--text-muted);
}

.article-stats {
  display: flex;
  gap: 16px;
  color: var(--text-muted);
  font-size: 14px;
}

.article-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--bg-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.news-item:hover {
  background: var(--primary-light);
}

.news-title {
  font-size: 14px;
  color: var(--text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-date {
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 12px;
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qa-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.qa-item:hover {
  background: var(--primary-light);
}

.qa-title {
  font-size: 15px;
  margin: 0 0 8px;
  color: var(--text-primary);
}

.qa-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qa-author {
  font-size: 12px;
  color: var(--text-muted);
}

.qa-stats {
  display: flex;
  gap: 16px;
  color: var(--text-muted);
  font-size: 14px;
}

.qa-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.answer-count {
  color: var(--text-muted);
}

.answer-count.has-answer {
  color: var(--success-color);
}
</style>
