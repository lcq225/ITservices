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
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-header .page-title {
  margin: 0;
  border: none;
  padding: 0;
}

.filter-bar {
  margin-bottom: 20px;
}

.search-input {
  max-width: 400px;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.article-card:hover {
  background: var(--primary-light);
  transform: translateX(4px);
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-primary);
}

.article-excerpt {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.6;
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
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  border-radius: 8px;
}

.sidebar-card :deep(.el-card__header) {
  padding: 12px 16px;
  background: var(--bg-color);
}

.card-header {
  font-weight: 600;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-secondary);
}

.filter-item:hover,
.filter-item.active {
  background: var(--primary-light);
  color: var(--primary-color);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover,
.tag-item.active {
  background: var(--primary-color);
  color: #fff;
}
</style>
