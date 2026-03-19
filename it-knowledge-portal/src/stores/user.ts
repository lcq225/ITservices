import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { login as loginApi, logout as logoutApi, getCurrentUser, type LoginResponse } from '@/api/services/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isIT = computed(() => user.value?.role === 'it' || user.value?.role === 'admin')

  const setAuth = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const login = async (username: string, password: string) => {
    loading.value = true
    try {
      const response = await loginApi({ username, password }) as unknown as LoginResponse
      setAuth(response.token, response.user)
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '登录失败'
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch {
      // ignore error
    } finally {
      clearAuth()
    }
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return
    try {
      const userData = await getCurrentUser() as unknown as User
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
    } catch {
      clearAuth()
    }
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isIT,
    setAuth,
    clearAuth,
    login,
    logout,
    fetchCurrentUser
  }
})
