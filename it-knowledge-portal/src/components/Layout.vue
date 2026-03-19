<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeIndex = computed(() => route.path)

const isActive = (path: string) => activeIndex.value === path

const navItems = [
  { path: '/', name: '首页' },
  { path: '/systems', name: '系统介绍' },
  { path: '/knowledge', name: '知识库' },
  { path: '/news', name: '资讯中心' },
  { path: '/qa', name: '问答社区' },
  { path: '/team', name: 'IT团队' }
]

const handleNavClick = (path: string) => {
  router.push(path)
}

const searchQuery = ref('')
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/knowledge', query: { q: searchQuery.value } })
  }
}

const handleLoginClick = () => {
  router.push('/login')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch {
    // cancelled
  }
}

const showAdminLink = computed(() => userStore.isAdmin)
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="container header-content">
        <div class="logo" @click="handleNavClick('/')">
          <el-icon :size="32" color="#fff"><Monitor /></el-icon>
          <span class="logo-text">企业IT知识门户</span>
        </div>
        <nav class="nav">
          <div
            v-for="item in navItems"
            :key="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
            @click="handleNavClick(item.path)"
          >
            {{ item.name }}
          </div>
        </nav>
        <div class="header-right">
          <el-input
            v-model="searchQuery"
            placeholder="搜索知识库..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <template v-if="userStore.isAuthenticated">
            <el-dropdown @command="(cmd: string) => cmd === 'logout' ? handleLogout() : router.push('/admin')">
              <div class="user-info">
                <el-avatar :size="36" :src="userStore.user?.avatar">
                  {{ userStore.user?.nickname?.[0] }}
                </el-avatar>
                <span class="username">{{ userStore.user?.nickname }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="admin" v-if="showAdminLink">
                    <el-icon><Setting /></el-icon> 管理后台
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <el-icon><SwitchButton /></el-icon> 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="handleLoginClick">登录</el-button>
          </template>
        </div>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-info">
          <p>信息技术部 © 2026</p>
          <p>IT服务热线：8000 | 邮箱：it@example.com</p>
        </div>
        <div class="footer-links">
          <span @click="router.push('/')">首页</span>
          <span @click="router.push('/team')">IT团队</span>
          <span v-if="showAdminLink" @click="router.push('/admin')">管理后台</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-right: 40px;
}

.logo-text {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 8px;
  flex: 1;
}

.nav-item {
  color: rgba(255, 255, 255, 0.85);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
}

.nav-item:hover,
.nav-item.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 240px;
}

.search-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: none;
  border: none;
}

.search-input :deep(.el-input__inner) {
  color: #fff;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.65);
}

.search-input :deep(.el-icon) {
  color: rgba(255, 255, 255, 0.85);
}

.main {
  flex: 1;
  padding: 24px 0;
}

.footer {
  background: var(--text-primary);
  color: #fff;
  padding: 24px 0;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info p {
  margin: 4px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links span {
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.3s;
}

.footer-links span:hover {
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.15);
}

.username {
  color: #fff;
  font-size: 14px;
}
</style>
