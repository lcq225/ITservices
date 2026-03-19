<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { questions } from '@/api/mock'

const router = useRouter()
const searchQuery = ref('')
const activeTag = ref('')

const allTags = computed(() => {
  const tags = new Set<string>()
  questions.forEach(q => q.tags.forEach(t => tags.add(t)))
  return Array.from(tags)
})

const filteredQuestions = computed(() => {
  return questions.filter(q => {
    if (searchQuery.value && !q.title.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    if (activeTag.value && !q.tags.includes(activeTag.value)) return false
    return true
  })
})

const formatDate = (date: string) => date
</script>

<template>
  <div class="qa-view">
    <div class="container">
      <div class="content-header">
        <h1 class="page-title">问答社区</h1>
        <el-button type="primary" @click="router.push('/qa/ask')">
          <el-icon><Plus /></el-icon> 发布问题
        </el-button>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="main-content">
            <div class="filter-bar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索问题..."
                class="search-input"
                clearable
              >
                <template #prefix><el-icon><Search /></el-icon></template>
              </el-input>
            </div>
            
            <div class="questions-list">
              <div
                v-for="q in filteredQuestions"
                :key="q.id"
                class="question-card"
                @click="router.push(`/qa/${q.id}`)"
              >
                <div class="question-stats">
                  <div class="stat-item">
                    <span class="stat-value" :class="{ answered: q.hasAcceptedAnswer }">{{ q.answerCount }}</span>
                    <span class="stat-label">回答</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ q.views }}</span>
                    <span class="stat-label">浏览</span>
                  </div>
                </div>
                <div class="question-content">
                  <h3 class="question-title">
                    {{ q.title }}
                    <el-tag v-if="q.hasAcceptedAnswer" type="success" size="small">已解决</el-tag>
                  </h3>
                  <p class="question-excerpt">{{ q.content.substring(0, 100) }}...</p>
                  <div class="question-meta">
                    <el-avatar :size="24" :src="q.authorAvatar" />
                    <span class="author">{{ q.author }}</span>
                    <el-tag v-for="tag in q.tags" :key="tag" size="small">{{ tag }}</el-tag>
                    <span class="date">{{ formatDate(q.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <el-empty v-if="filteredQuestions.length === 0" description="暂无问题" />
          </div>
        </el-col>
        
        <el-col :span="6">
          <div class="sidebar">
            <el-card class="sidebar-card">
              <template #header>
                <div class="card-header">热门标签</div>
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
.qa-view {
  padding-bottom: 40px;
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

.main-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.filter-bar {
  margin-bottom: 20px;
}

.search-input {
  max-width: 300px;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.question-card:hover {
  background: var(--primary-light);
  transform: translateX(4px);
}

.question-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 70px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-secondary);
}

.stat-value.answered {
  color: var(--success-color);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-excerpt {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.5;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.author {
  color: var(--text-secondary);
}

.date {
  color: var(--text-muted);
  margin-left: auto;
}

.sidebar-card :deep(.el-card__header) {
  padding: 12px 16px;
  background: var(--bg-color);
}

.card-header {
  font-weight: 600;
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
