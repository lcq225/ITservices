<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { articles } from '@/api/mock'

const router = useRouter()
const activeCategory = ref('全部')
const categories = ['全部', '系统公告', '维护通知', '活动通知', '安全预警']

const newsList = computed(() => {
  if (activeCategory.value === '全部') return articles.filter(a => a.type === 'news')
  return articles.filter(a => a.type === 'news' && a.tags.includes(activeCategory.value))
})
</script>

<template>
  <div class="news-view">
    <div class="container">
      <h1 class="page-title">资讯中心</h1>
      
      <div class="category-tabs">
        <el-radio-group v-model="activeCategory">
          <el-radio-button v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="news-list">
        <el-card
          v-for="news in newsList"
          :key="news.id"
          class="news-card"
          shadow="hover"
          @click="router.push(`/news/${news.id}`)"
        >
          <div class="news-content">
            <h3 class="news-title">{{ news.title }}</h3>
            <p class="news-excerpt" v-html="news.content.substring(0, 200) + '...'"></p>
            <div class="news-meta">
              <el-tag v-for="tag in news.tags" :key="tag" size="small">{{ tag }}</el-tag>
              <span class="meta-item"><el-icon><User /></el-icon> {{ news.author }}</span>
              <span class="meta-item"><el-icon><Calendar /></el-icon> {{ news.createdAt }}</span>
              <span class="meta-item"><el-icon><View /></el-icon> {{ news.views }}</span>
            </div>
          </div>
        </el-card>
      </div>
      
      <el-empty v-if="newsList.length === 0" description="暂无资讯" />
    </div>
  </div>
</template>

<style scoped>
.news-view {
  padding-bottom: 40px;
}

.category-tabs {
  margin-bottom: 24px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-card {
  cursor: pointer;
  transition: all 0.3s;
}

.news-card:hover {
  transform: translateX(8px);
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text-primary);
}

.news-excerpt {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.news-meta {
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
</style>
