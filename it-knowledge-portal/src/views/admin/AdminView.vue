<script setup lang="ts">
import { ref } from 'vue'
import { articles, questions, systems, users } from '@/api/mock'
import {
  Document,
  ChatDotRound,
  Monitor,
  User,
  Plus
} from '@element-plus/icons-vue'

const activeTab = ref('articles')
const stats = ref({
  articles: articles.length,
  questions: questions.length,
  systems: systems.length,
  users: users.filter(u => u.role === 'it').length
})

const statCards = [
  { key: 'articles', label: '知识文档', icon: Document, color: '#409EFF' },
  { key: 'questions', label: '问答总数', icon: ChatDotRound, color: '#67C23A' },
  { key: 'systems', label: 'IT系统', icon: Monitor, color: '#E6A23C' },
  { key: 'users', label: 'IT人员', icon: User, color: '#909399' }
]
</script>

<template>
  <div class="admin-view">
    <div class="container">
      <h1 class="page-title">管理后台</h1>
      
      <el-row :gutter="20" class="stats-row">
        <el-col :xs="12" :sm="12" :md="6" v-for="stat in statCards" :key="stat.key">
          <div class="stat-card">
            <div class="stat-icon" :style="{ background: `${stat.color}15` }">
              <el-icon :size="32" :style="{ color: stat.color }"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats[stat.key as keyof typeof stats] }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      
      <div class="main-card">
        <div class="card-header">
          <span>内容管理</span>
        </div>
        <el-tabs v-model="activeTab" class="admin-tabs">
          <el-tab-pane label="知识文档" name="articles">
            <div class="table-toolbar">
              <el-button type="primary">
                <el-icon><Plus /></el-icon> 新建文档
              </el-button>
            </div>
            <el-table :data="articles" stripe class="admin-table">
              <el-table-column prop="title" label="标题" min-width="200" />
              <el-table-column prop="author" label="作者" width="120" />
              <el-table-column prop="tags" label="标签" width="200">
                <template #default="{ row }">
                  <el-tag v-for="tag in row.tags.slice(0, 2)" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="views" label="浏览" width="80" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
                    {{ row.status === 'published' ? '已发布' : '草稿' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default>
                  <el-button type="primary" text size="small">编辑</el-button>
                  <el-button type="danger" text size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="问答管理" name="questions">
            <el-table :data="questions" stripe class="admin-table">
              <el-table-column prop="title" label="标题" min-width="200" />
              <el-table-column prop="author" label="提问者" width="150" />
              <el-table-column prop="answerCount" label="回答数" width="80" />
              <el-table-column prop="hasAcceptedAnswer" label="已采纳" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.hasAcceptedAnswer ? 'success' : 'info'" size="small">
                    {{ row.hasAcceptedAnswer ? '是' : '否' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default>
                  <el-button type="primary" text size="small">查看</el-button>
                  <el-button type="danger" text size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="系统管理" name="systems">
            <div class="table-toolbar">
              <el-button type="primary">
                <el-icon><Plus /></el-icon> 添加系统
              </el-button>
            </div>
            <el-table :data="systems" stripe class="admin-table">
              <el-table-column prop="name" label="系统名称" min-width="150" />
              <el-table-column prop="code" label="编号" width="120" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="manager" label="负责人" width="120" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'online' ? 'success' : row.status === 'maintenance' ? 'warning' : 'danger'" size="small">
                    {{ row.status === 'online' ? '运行中' : row.status === 'maintenance' ? '维护中' : '已下线' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default>
                  <el-button type="primary" text size="small">编辑</el-button>
                  <el-button type="danger" text size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="用户管理" name="users">
            <el-table :data="users.filter(u => u.role === 'it')" stripe class="admin-table">
              <el-table-column prop="nickname" label="姓名" min-width="120" />
              <el-table-column prop="title" label="职位" width="150" />
              <el-table-column prop="department" label="部门" width="150" />
              <el-table-column prop="email" label="邮箱" min-width="180" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'online' ? 'success' : 'info'" size="small">
                    {{ row.status === 'online' ? '在线' : '离线' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default>
                  <el-button type="primary" text size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-view {
  padding-bottom: 40px;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--bg-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 4px;
}

.main-card {
  background: var(--bg-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  background: var(--bg-color);
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.admin-tabs {
  padding: 0 20px;
}

.table-toolbar {
  padding: 16px 0;
}

.admin-table {
  border-radius: var(--radius-sm);
}

.admin-table :deep(.el-table__header th) {
  background: var(--bg-color);
  color: var(--text-primary);
  font-weight: 600;
}

.admin-table :deep(.el-table__row) {
  transition: background 0.2s ease;
}

.admin-table :deep(.el-table__row:hover) {
  background: var(--bg-color);
}
</style>
