<script setup lang="ts">
import { ref } from 'vue'
import { articles, questions, systems, users } from '@/api/mock'

const activeTab = ref('articles')
const stats = ref({
  articles: articles.length,
  questions: questions.length,
  systems: systems.length,
  users: users.filter(u => u.role === 'it').length
})
</script>

<template>
  <div class="admin-view">
    <div class="container">
      <h1 class="page-title">管理后台</h1>
      
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon :size="40" color="#409EFF"><Document /></el-icon>
              <div class="stat-info">
                <span class="stat-value">{{ stats.articles }}</span>
                <span class="stat-label">知识文档</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon :size="40" color="#67C23A"><ChatDotRound /></el-icon>
              <div class="stat-info">
                <span class="stat-value">{{ stats.questions }}</span>
                <span class="stat-label">问答总数</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon :size="40" color="#E6A23C"><Monitor /></el-icon>
              <div class="stat-info">
                <span class="stat-value">{{ stats.systems }}</span>
                <span class="stat-label">IT系统</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon :size="40" color="#909399"><User /></el-icon>
              <div class="stat-info">
                <span class="stat-value">{{ stats.users }}</span>
                <span class="stat-label">IT人员</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-card class="main-card">
        <template #header>
          <div class="card-header">
            <span>内容管理</span>
          </div>
        </template>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="知识文档" name="articles">
            <el-table :data="articles" stripe>
              <el-table-column prop="title" label="标题" />
              <el-table-column prop="author" label="作者" width="120" />
              <el-table-column prop="tags" label="标签" width="200">
                <template #default="{ row }">
                  <el-tag v-for="tag in row.tags.slice(0, 2)" :key="tag" size="small">{{ tag }}</el-tag>
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
              <el-table-column label="操作" width="150">
                <template #default>
                  <el-button type="primary" text size="small">编辑</el-button>
                  <el-button type="danger" text size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="问答管理" name="questions">
            <el-table :data="questions" stripe>
              <el-table-column prop="title" label="标题" />
              <el-table-column prop="author" label="提问者" width="150" />
              <el-table-column prop="answerCount" label="回答数" width="80" />
              <el-table-column prop="hasAcceptedAnswer" label="已采纳" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.hasAcceptedAnswer ? 'success' : 'info'" size="small">
                    {{ row.hasAcceptedAnswer ? '是' : '否' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default>
                  <el-button type="primary" text size="small">查看</el-button>
                  <el-button type="danger" text size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="系统管理" name="systems">
            <el-button type="primary" style="margin-bottom: 16px">
              <el-icon><Plus /></el-icon> 添加系统
            </el-button>
            <el-table :data="systems" stripe>
              <el-table-column prop="name" label="系统名称" />
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
              <el-table-column label="操作" width="150">
                <template #default>
                  <el-button type="primary" text size="small">编辑</el-button>
                  <el-button type="danger" text size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="用户管理" name="users">
            <el-table :data="users.filter(u => u.role === 'it')" stripe>
              <el-table-column prop="nickname" label="姓名" />
              <el-table-column prop="title" label="职位" width="150" />
              <el-table-column prop="department" label="部门" width="150" />
              <el-table-column prop="email" label="邮箱" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'online' ? 'success' : 'info'" size="small">
                    {{ row.status === 'online' ? '在线' : '离线' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default>
                  <el-button type="primary" text size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.admin-view {
  padding-bottom: 40px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
}

.main-card {
  border-radius: 8px;
}

.main-card :deep(.el-card__header) {
  padding: 12px 20px;
  background: var(--bg-color);
}

.card-header {
  font-weight: 600;
}
</style>
