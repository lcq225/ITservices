<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articles, systems } from '@/api/mock'
import type { Article } from '@/types'
import { truncateText } from '@/utils/xss'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const articlesList = ref<Article[]>([])
const activeTag = ref('')
const activeSystem = ref('')
const searchQuery = ref('')

const canCreate = computed(() => userStore.isIT)

const allTags = computed(() => {
  const tags = new Set<string>()
  articles.forEach((a: any) => a.tags.forEach((t: any) => tags.add(t)))
  return Array.from(tags)
})

const filteredArticles = computed(() => {
  return articlesList.value.filter(a => {
    if (a.type !== 'knowledge') return false
    if (activeTag.value && !a.tags.includes(activeTag.value)) return false
    if (activeSystem.value && a.systemId !== Number(activeSystem.value)) return false
    if (searchQuery.value && !a.title.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    return true
  })
})

const formatDate = (date: string) => date
const getExcerpt = (content: string) => truncateText(content, 150)

onMounted(() => {
  articlesList.value = articles
  if (route.query.q) {
    searchQuery.value = route.query.q as string
  }
})

const handleCreateClick = () => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }
  router.push('/knowledge/create')
}
</script>

<template>
  <div class="knowledge-view">
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="main-content">
            <div class="content-header">
              <h1 class="page-title">知识库</h1>
              <el-button v-if="canCreate" type="primary" @click="handleCreateClick">
                <el-icon><Plus /></el-icon> 创建知识
              </el-button>
            </div>
            
            <div class="filter-bar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索知识..."
                class="search-input"
                clearable
              >
                <template #prefix><el-icon><Search /></el-icon></template>
              </el-input>
            </div>
            
            <div class="articles-list">
              <div
                v-for="article in filteredArticles"
                :key="article.id"
                class="article-card"
                @click="router.push(`/knowledge/${article.id}`)"
              >
                <div class="article-main">
                  <h3 class="article-title">{{ article.title }}</h3>
                  <p class="article-excerpt">{{ getExcerpt(article.content) }}</p>
                  <div class="article-meta">
                    <el-tag v-for="tag in article.tags" :key="tag" size="small">{{ tag }}</el-tag>
                    <span class="meta-item"><el-icon><User /></el-icon> {{ article.author }}</span>
                    <span class="meta-item"><el-icon><Calendar /></el-icon> {{ formatDate(article.createdAt) }}</span>
                    <span class="meta-item"><el-icon><View /></el-icon> {{ article.views }}</span>
                  </div>
                </div>
                <div class="article-attachments" v-if="article.attachments.length">
                  <el-icon><Paperclip /></el-icon>
                  <span>{{ article.attachments.length }} 个附件</span>
                </div>
              </div>
              
              <el-empty v-if="filteredArticles.length === 0" description="暂无知识文档" />
            </div>
          </div>
        </el-col>
        
        <el-col :span="6">
          <div class="sidebar">
            <el-card class="sidebar-card">
              <template #header>
                <div class="card-header">
                  <span>系统分类</span>
                </div>
              </template>
              <div class="filter-list">
                <div
                  class="filter-item"
                  :class="{ active: activeSystem === '' }"
                  @click="activeSystem = ''"
                >
                  全部系统
                </div>
                <div
                  v-for="system in systems"
                  :key="system.id"
                  class="filter-item"
                  :class="{ active: activeSystem === String(system.id) }"
                  @click="activeSystem = String(system.id)"
                >
                  {{ system.name }}
                </div>
              </div>
            </el-card>
            
            <el-card class="sidebar-card">
              <template #header>
                <div class="card-header">
                  <span>热门标签</span>
                </div>
              </template>
              <div class="tag-list">
                <el-tag
                  v-for="tag in allTags"
                  :key="tag"
                  class="tag-item"
                  :class="{ active: activeTag === tag }"
                  @click="activeTag = activeTag === tag ? '' : tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.knowledge-view {
  padding-bottom: 40px;
}

.main-content {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.content-header .page-title {
  margin: 0;
  border: none;
  padding: 0;
}

.filter-bar {
  margin-bottom: 24px;
}

.search-input {
  max-width: 400px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  padding: 8px 16px;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.article-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--gradient-primary);
  border-radius: 2px;
  transition: height 0.3s ease;
}

.article-card:hover {
  background: var(--primary-light);
  transform: translateX(4px);
}

.article-card:hover::before {
  height: 40px;
}

.article-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-primary);
}

.article-excerpt {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.7;
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.article-attachments {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 13px;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 8px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.sidebar-card :deep(.el-card__header) {
  padding: 16px 20px;
  background: var(--bg-color);
  border-bottom: none;
}

.card-header {
  font-weight: 600;
  font-size: 15px;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-item {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
  font-size: 14px;
}

.filter-item:hover,
.filter-item.active {
  background: var(--primary-light);
  color: var(--primary-color);
  font-weight: 500;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: var(--radius-sm);
}

.tag-item:hover,
.tag-item.active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: var(--primary-color);
}
</style>
