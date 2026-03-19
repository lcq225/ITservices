import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: '登录', guest: true }
  },
  {
    path: '/systems',
    component: () => import('@/views/systems/SystemsView.vue'),
    meta: { title: '系统介绍' }
  },
  {
    path: '/systems/:id',
    component: () => import('@/views/systems/SystemDetail.vue'),
    meta: { title: '系统详情' }
  },
  {
    path: '/knowledge',
    component: () => import('@/views/knowledge/KnowledgeView.vue'),
    meta: { title: '知识库' }
  },
  {
    path: '/knowledge/:id',
    component: () => import('@/views/knowledge/KnowledgeDetail.vue'),
    meta: { title: '知识详情' }
  },
  {
    path: '/knowledge/create',
    component: () => import('@/views/knowledge/KnowledgeEditor.vue'),
    meta: { title: '创建知识', requiresAuth: true, requiresIT: true }
  },
  {
    path: '/knowledge/edit/:id',
    component: () => import('@/views/knowledge/KnowledgeEditor.vue'),
    meta: { title: '编辑知识', requiresAuth: true, requiresIT: true }
  },
  {
    path: '/news',
    component: () => import('@/views/news/NewsView.vue'),
    meta: { title: '资讯中心' }
  },
  {
    path: '/news/:id',
    component: () => import('@/views/news/NewsDetail.vue'),
    meta: { title: '资讯详情' }
  },
  {
    path: '/qa',
    component: () => import('@/views/qa/QaView.vue'),
    meta: { title: '问答社区' }
  },
  {
    path: '/qa/:id',
    component: () => import('@/views/qa/QaDetail.vue'),
    meta: { title: '问答详情' }
  },
  {
    path: '/qa/ask',
    component: () => import('@/views/qa/QaAsk.vue'),
    meta: { title: '发布问题', requiresAuth: true }
  },
  {
    path: '/team',
    component: () => import('@/views/team/TeamView.vue'),
    meta: { title: 'IT团队' }
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminView.vue'),
    meta: { title: '管理后台', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  document.title = `${to.meta.title || 'IT知识门户'} - 企业IT`

  if (to.meta.guest && userStore.isAuthenticated) {
    next('/')
    return
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    ElMessage.error('您没有权限访问管理后台')
    next('/')
    return
  }

  if (to.meta.requiresIT && !userStore.isIT) {
    ElMessage.error('只有IT人员可以创建或编辑知识')
    next('/knowledge')
    return
  }

  next()
})

export default router
