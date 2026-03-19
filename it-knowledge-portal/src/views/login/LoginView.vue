<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: ''
})
const loading = ref(false)

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    const result = await userStore.login(loginForm.value.username, loginForm.value.password)
    if (result.success) {
      ElMessage.success('登录成功')
      const redirect = route.query.redirect as string || '/'
      router.push(redirect)
    } else {
      ElMessage.error(result.message || '登录失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#loginLogoGrad)"/>
            <path d="M8 16L14 22L24 10" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="loginLogoGrad" x1="0" y1="0" x2="32" y2="32">
                <stop stop-color="#0070F3"/>
                <stop offset="1" stop-color="#00D4FF"/>
              </linearGradient>
            </defs>
          </svg>
          <span>企业IT门户</span>
        </div>
        <h1>欢迎回来</h1>
        <p>请登录以继续访问IT服务</p>
      </div>

      <el-form :model="loginForm" class="login-form">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>企业IT服务门户 v2.0</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  padding: 20px;
}

.login-card {
  width: 400px;
  max-width: 100%;
  padding: 48px;
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.login-logo svg {
  width: 48px;
  height: 48px;
}

.login-logo span {
  font-size: 24px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header h1 {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-primary);
}

.login-header p {
  color: var(--text-muted);
  font-size: 14px;
}

.login-form {
  margin-top: 32px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  box-shadow: none;
  border: 1.5px solid var(--border-color);
  transition: all 0.2s ease;
}

.login-form :deep(.el-input__wrapper:hover),
.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: var(--radius-sm);
  background: var(--gradient-primary);
  border: none;
  margin-top: 8px;
}

.login-button:hover {
  box-shadow: 0 8px 24px rgba(0, 112, 243, 0.35);
}

.login-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.login-footer p {
  color: var(--text-muted);
  font-size: 13px;
}
</style>
