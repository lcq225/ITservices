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
        <div class="logo" @click="router.push('/')">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logoGrad)"/>
              <path d="M8 16L14 22L24 10" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop stop-color="#0070F3"/>
                  <stop offset="1" stop-color="#00D4FF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">企业IT门户</span>
        </div>

        <nav class="nav">
          <div
            v-for="item in navItems"
            :key="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
            @click="router.push(item.path)"
          >
            {{ item.name }}
          </div>
        </nav>

        <div class="header-right">
          <div class="search-box">
            <el-input
              v-model="searchQuery"
              placeholder="搜索知识、问题..."
              class="search-input"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </template>
            </el-input>
          </div>

          <template v-if="userStore.isAuthenticated">
            <el-dropdown @command="(cmd: string) => cmd === 'logout' ? handleLogout() : router.push('/admin')">
              <div class="user-info">
                <el-avatar :size="36" :src="userStore.user?.avatar" class="user-avatar">
                  {{ userStore.user?.nickname?.[0] }}
                </el-avatar>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item disabled>
                    <span class="user-name">{{ userStore.user?.nickname }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="admin" v-if="showAdminLink" divided>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    管理后台
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <button class="login-btn" @click="handleLoginClick">登录</button>
          </template>
        </div>
      </div>
    </header>

    <main class="main">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <div class="footer-logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="url(#footerLogoGrad)"/>
              <path d="M8 16L14 22L24 10" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop stop-color="#0070F3"/>
                  <stop offset="1" stop-color="#00D4FF"/>
                </linearGradient>
              </defs>
            </svg>
            <span>企业IT门户</span>
          </div>
          <p class="footer-desc">一站式IT知识服务平台</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <span class="link-title">快速链接</span>
            <span @click="router.push('/')">首页</span>
            <span @click="router.push('/knowledge')">知识库</span>
            <span @click="router.push('/qa')">问答社区</span>
          </div>
          <div class="link-group">
            <span class="link-title">支持</span>
            <span @click="router.push('/team')">IT团队</span>
            <span>服务热线：8000</span>
          </div>
        </div>
        <div class="footer-copyright">
          <p>© 2026 信息技术部. All rights reserved.</p>
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
  background: #fff;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-content {
  display: flex;
  align-items: center;
  height: 64px;
  gap: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  display: flex;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: 4px;
  flex: 1;
}

.nav-item {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 15px;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  color: var(--primary-color);
  background: var(--primary-light);
}

.nav-item.active {
  color: var(--primary-color);
  font-weight: 500;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  width: 240px;
}

.search-box :deep(.el-input__wrapper) {
  border-radius: 20px;
  padding: 8px 16px;
  box-shadow: none;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.search-box :deep(.el-input__wrapper:hover),
.search-box :deep(.el-input__wrapper:focus) {
  border-color: var(--primary-color);
}

.login-btn {
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
}

.user-info {
  cursor: pointer;
}

.user-avatar {
  border: 2px solid var(--border-color);
  transition: border-color 0.2s ease;
}

.user-info:hover .user-avatar {
  border-color: var(--primary-color);
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
}

.main {
  flex: 1;
  padding: 32px 0;
}

.footer {
  background: linear-gradient(180deg, #F5F8FA 0%, #E8EEF4 100%);
  padding: 48px 0 24px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.footer-brand {
  max-width: 280px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.footer-logo span {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.footer-desc {
  color: var(--text-muted);
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 60px;
  justify-content: flex-end;
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.link-group span {
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.link-group span:hover {
  color: var(--primary-color);
}

.footer-copyright {
  grid-column: 1 / -1;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  margin-top: 24px;
}

.footer-copyright p {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
