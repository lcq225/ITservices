<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { systems } from '@/api/mock'

const router = useRouter()
const activeCategory = ref('全部')
const categories = ['全部', '核心系统', '基础设施', '安全系统', '应用系统']

const filteredSystems = computed(() => {
  if (activeCategory.value === '全部') {
    return systems
  }
  return systems.filter(s => s.category === activeCategory.value)
})

const getStatusType = (status: string) => {
  if (status === 'online') return 'success'
  if (status === 'maintenance') return 'warning'
  return 'danger'
}

const getStatusText = (status: string) => {
  if (status === 'online') return '运行中'
  if (status === 'maintenance') return '维护中'
  return '已下线'
}

const handleSystemClick = (id: number) => {
  router.push(`/systems/${id}`)
}
</script>

<template>
  <div class="systems-view">
    <div class="container">
      <h1 class="page-title">系统介绍</h1>
      <div class="category-tabs">
        <el-radio-group v-model="activeCategory">
          <el-radio-button v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-row :gutter="20">
        <el-col :span="8" v-for="system in filteredSystems" :key="system.id">
          <div class="system-card" @click="handleSystemClick(system.id)">
            <div class="system-header">
              <div class="system-info">
                <h3 class="system-name">{{ system.name }}</h3>
                <el-tag size="small">{{ system.category }}</el-tag>
              </div>
              <el-tag :type="getStatusType(system.status)" size="small">
                {{ getStatusText(system.status) }}
              </el-tag>
            </div>
            <p class="system-desc">{{ system.description }}</p>
            <div class="system-meta">
              <span><el-icon><User /></el-icon> {{ system.manager }}</span>
              <span><el-icon><Phone /></el-icon> {{ system.managerPhone }}</span>
            </div>
            <div class="system-docs">
              <span class="docs-label">相关文档：</span>
              <el-link
                v-for="doc in system.docLinks"
                :key="doc.name"
                :href="doc.url"
                @click.stop
              >
                {{ doc.name }}
              </el-link>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.systems-view {
  padding-bottom: 40px;
}

.category-tabs {
  margin-bottom: 24px;
}

.system-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
}

.system-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.system-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.system-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.system-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.system-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  color: var(--text-muted);
  font-size: 14px;
}

.system-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.system-docs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.docs-label {
  font-size: 14px;
  color: var(--text-muted);
}
</style>
