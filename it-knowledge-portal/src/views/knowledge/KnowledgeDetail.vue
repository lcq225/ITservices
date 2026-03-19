<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articles, systems } from '@/api/mock'

const route = useRoute()
const router = useRouter()
const article = ref(articles[0])
const system = ref(systems[0])

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

onMounted(() => {
  const id = Number(route.params.id)
  const found = articles.find(a => a.id === id)
  if (found) {
    article.value = found
    if (found.systemId) {
      const sys = systems.find(s => s.id === found.systemId)
      if (sys) system.value = sys
    }
  }
})

const handleLike = () => {
  article.value.likes++
}
</script>

<template>
  <div class="knowledge-detail">
    <div class="container">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
      
      <div class="article-card">
        <div class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <el-tag v-for="tag in article.tags" :key="tag">{{ tag }}</el-tag>
            <span class="meta-sep">|</span>
            <span>作者：{{ article.author }}</span>
            <span class="meta-sep">|</span>
            <span>更新时间：{{ article.updatedAt }}</span>
          </div>
        </div>
        
        <el-divider />
        
        <div class="article-content" v-html="article.content"></div>
        
        <div class="article-actions">
          <el-button @click="handleLike">
            <el-icon><Star /></el-icon> 点赞 ({{ article.likes }})
          </el-button>
          <el-button @click="router.push(`/knowledge/edit/${article.id}`)">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
        </div>
        
        <div class="attachments" v-if="article.attachments.length">
          <h3>附件下载</h3>
          <div class="attachment-list">
            <div v-for="att in article.attachments" :key="att.id" class="attachment-item">
              <el-icon><Document /></el-icon>
              <span class="att-name">{{ att.fileName }}</span>
              <span class="att-size">{{ formatFileSize(att.fileSize) }}</span>
              <el-button type="primary" size="small">下载</el-button>
            </div>
          </div>
        </div>
        
        <div class="related-system">
          <h3>关联系统</h3>
          <div class="system-info" @click="router.push(`/systems/${system.id}`)">
            <el-icon><Monitor /></el-icon>
            <span>{{ system.name }}</span>
            <el-tag size="small">{{ system.category }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-detail {
  padding-bottom: 40px;
}

.article-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.article-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px;
  color: var(--text-primary);
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

.meta-sep {
  color: var(--border-color);
}

.article-content {
  line-height: 1.8;
  color: var(--text-secondary);
  font-size: 15px;
}

.article-content :deep(h2) {
  font-size: 20px;
  color: var(--text-primary);
  margin: 24px 0 12px;
}

.article-content :deep(p) {
  margin-bottom: 16px;
}

.article-content :deep(ol),
.article-content :deep(ul) {
  margin: 16px 0;
  padding-left: 24px;
}

.article-content :deep(li) {
  margin-bottom: 8px;
}

.article-actions {
  display: flex;
  gap: 12px;
  margin: 24px 0;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.attachments h3,
.related-system h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: var(--text-primary);
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 6px;
}

.att-name {
  flex: 1;
  color: var(--text-primary);
}

.att-size {
  color: var(--text-muted);
  font-size: 13px;
}

.system-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--primary-light);
  border-radius: 6px;
  cursor: pointer;
  color: var(--primary-color);
  transition: all 0.3s;
}

.system-info:hover {
  background: var(--primary-color);
  color: #fff;
}
</style>
