<script setup lang="ts">
import { users, dutySchedule } from '@/api/mock'

const getStatusType = (status: string) => status === 'online' ? 'success' : 'info'
</script>

<template>
  <div class="team-view">
    <div class="container">
      <h1 class="page-title">IT团队</h1>
      
      <div class="team-grid">
        <el-card v-for="user in users" :key="user.id" class="team-card" shadow="hover">
          <div class="member-header">
            <el-avatar :size="80" :src="user.avatar" />
            <div class="member-info">
              <h3 class="member-name">{{ user.nickname }}</h3>
              <p class="member-title">{{ user.title }}</p>
              <el-tag :type="getStatusType(user.status)" size="small">
                {{ user.status === 'online' ? '在线' : '离线' }}
              </el-tag>
            </div>
          </div>
          <el-divider />
          <div class="member-details">
            <p><el-icon><OfficeSupply /></el-icon> {{ user.department }}</p>
            <p><el-icon><Phone /></el-icon> {{ user.phone }}</p>
            <p><el-icon><Message /></el-icon> {{ user.email }}</p>
          </div>
          <div class="member-expertise">
            <span class="expertise-label">专长领域：</span>
            <el-tag v-for="exp in user.expertise" :key="exp" size="small" type="info">{{ exp }}</el-tag>
          </div>
        </el-card>
      </div>
      
      <div class="duty-schedule">
        <h2 class="section-title">值班表</h2>
        <el-card>
          <el-table :data="dutySchedule" stripe>
            <el-table-column prop="day" label="星期" width="200" />
            <el-table-column prop="person" label="值班人员">
              <template #default="{ row }">
                <span v-if="row.person === '全员值班'">{{ row.person }}</span>
                <span v-else>{{ row.person }} <el-tag size="small" type="info">分机 {{ row.phone }}</el-tag></span>
              </template>
            </el-table-column>
          </el-table>
          <div class="duty-note">
            <el-icon><Warning /></el-icon>
            <span>非值班时间如有紧急问题，请联系IT服务热线：8000</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-view {
  padding-bottom: 40px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.team-card {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  overflow: hidden;
}

.team-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.member-header {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.member-avatar {
  border: 3px solid var(--border-color);
  transition: border-color 0.2s ease;
}

.team-card:hover .member-avatar {
  border-color: var(--primary-color);
}

.member-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--text-primary);
}

.member-title {
  color: var(--text-secondary);
  margin: 0 0 8px;
  font-size: 14px;
}

.member-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.member-details p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.member-expertise {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.expertise-label {
  font-size: 13px;
  color: var(--text-muted);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.duty-note {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(0, 112, 243, 0.08) 0%, rgba(0, 212, 255, 0.08) 100%);
  border-radius: var(--radius-md);
  color: var(--primary-color);
  font-size: 14px;
}
</style>
