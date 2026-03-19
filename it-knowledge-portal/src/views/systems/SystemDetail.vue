<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { systems, articles } from '@/api/mock'

const route = useRoute()
const router = useRouter()
const system = ref(systems[0])
const relatedDocs = ref<typeof articles>([])

onMounted(() => {
  const id = Number(route.params.id)
  const found = systems.find(s => s.id === id)
  if (found) {
    system.value = found
    relatedDocs.value = articles.filter(a => a.systemId === id || a.tags.includes(found.code))
  }
})

const getStatusType = (status: string) => {
  if (status === 'online') return 'success'
  if (status === 'maintenance') return 'warning'
  return 'danger'
}
</script>

<template>
  <div class="system-detail">
    <div class="container">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
      
      <div class="detail-card">
        <div class="detail-header">
          <div>
            <h1 class="system-name">{{ system.name }}</h1>
            <div class="system-tags">
              <el-tag>{{ system.code }}</el-tag>
              <el-tag type="info">{{ system.category }}</el-tag>
              <el-tag :type="getStatusType(system.status)">
                {{ system.status === 'online' ? '运行中' : system.status === 'maintenance' ? '维护中' : '已下线' }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <el-divider />
        
        <div class="detail-content">
          <div class="info-section">
            <h3>系统简介</h3>
            <p>{{ system.description }}</p>
          </div>
          
          <el-row :gutter="40">
            <el-col :span="12">
              <div class="info-section">
                <h3>基本信息</h3>
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="负责人">{{ system.manager }}</el-descriptions-item>
                  <el-descriptions-item label="联系电话">{{ system.managerPhone }}</el-descriptions-item>
                  <el-descriptions-item label="所属部门">{{ system.department }}</el-descriptions-item>
                  <el-descriptions-item label="系统编号">{{ system.code }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-section">
                <h3>相关文档</h3>
                <div class="doc-links">
                  <div v-for="doc in system.docLinks" :key="doc.name" class="doc-item">
                    <el-icon><Document /></el-icon>
                    <span>{{ doc.name }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          
          <div class="info-section">
            <h3>相关知识</h3>
            <div class="related-articles">
              <div
                v-for="article in relatedDocs"
                :key="article.id"
                class="article-item"
                @click="router.push(`/knowledge/${article.id}`)"
              >
                <el-icon><Document /></el-icon>
                <span class="article-title">{{ article.title }}</span>
                <el-tag size="small">{{ article.type === 'knowledge' ? '知识' : '资讯' }}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.system-detail {
  padding-bottom: 40px;
}

.detail-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.system-name {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text-primary);
}

.system-tags {
  display: flex;
  gap: 8px;
}

.detail-content {
  margin-top: 20px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.info-section p {
  color: var(--text-secondary);
  line-height: 1.8;
}

.doc-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 6px;
  color: var(--primary-color);
}

.related-articles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-item {
  display: flex;
  align-items: center;
  gap: 12px;
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
  flex: 1;
  color: var(--text-primary);
}
</style>
