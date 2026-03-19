<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeIndex = ref('/')

const navItems = [
  { path: '/', name: '首页' },
  { path: '/systems', name: '系统介绍' },
  { path: '/knowledge', name: '知识库' },
  { path: '/news', name: '资讯中心' },
  { path: '/qa', name: '问答社区' },
  { path: '/team', name: 'IT团队' }
]

const handleNavClick = (path: string) => {
  activeIndex.value = path
  router.push(path)
}

const searchQuery = ref('')
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/knowledge', query: { q: searchQuery.value } })
  }
}
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="container header-content">
        <div class="logo" @click="handleNavClick('/')">
          <el-icon :size="32" color="#fff"><Monitor /></el-icon>
          <span class="logo-text">企业ITIT知识门户</span>
        </div>
        <nav class="nav">
          <div
            v-for="item in navItems"
            :key="item.path"
            class="nav-item"
            :class="{ active: activeIndex === item.path }"
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
          <el-avatar :size="36" style="cursor: pointer">
            <el-icon :size="20"><User /></el-icon>
          </el-avatar>
        </div>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-info">
          <p>企业IT集团信息技术部 © 2026</p>
          <p>IT服务热线：8000 | 邮箱：it@haike.com</p>
        </div>
        <div class="footer-links">
          <span @click="router.push('/')">首页</span>
          <span @click="router.push('/team')">IT团队</span>
          <span @click="router.push('/admin')">管理后台</span>
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
</style>
