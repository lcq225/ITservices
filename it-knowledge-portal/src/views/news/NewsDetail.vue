<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articles } from '@/api/mock'

const route = useRoute()
const router = useRouter()
const news = ref(articles[2])

onMounted(() => {
  const id = Number(route.params.id)
  const found = articles.find(a => a.id === id)
  if (found) news.value = found
})
</script>

<template>
  <div class="news-detail">
    <div class="container">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
      
      <div class="news-card">
        <div class="news-header">
          <h1 class="news-title">{{ news.title }}</h1>
          <div class="news-meta">
            <el-tag v-for="tag in news.tags" :key="tag">{{ tag }}</el-tag>
            <span>作者：{{ news.author }}</span>
            <span>发布时间：{{ news.createdAt }}</span>
            <span>浏览：{{ news.views }}</span>
          </div>
        </div>
        
        <el-divider />
        
        <div class="news-content" v-html="news.content"></div>
        
        <div class="news-actions">
          <el-button @click="news.likes++">
            <el-icon><Star /></el-icon> 点赞 ({{ news.likes }})
          </el-button>
          <el-button>
            <el-icon><Share /></el-icon> 分享
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-detail {
  padding-bottom: 40px;
}

.news-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.news-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px;
  color: var(--text-primary);
}

.news-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 14px;
}

.news-content {
  line-height: 1.8;
  color: var(--text-secondary);
  font-size: 15px;
}

.news-content :deep(h2) {
  font-size: 20px;
  color: var(--text-primary);
  margin: 24px 0 12px;
}

.news-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}
</style>
