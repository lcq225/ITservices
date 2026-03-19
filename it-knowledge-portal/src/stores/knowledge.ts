import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Article } from '@/types'
import { getArticles as getArticlesApi, likeArticle as likeArticleApi } from '@/api/services/article'

interface ArticleListResponse {
  list: Article[]
  total: number
  page: number
  pageSize: number
}

export const useKnowledgeStore = defineStore('knowledge', () => {
  const articles = ref<Article[]>([])
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)

  const fetchArticles = async (params?: {
    type?: 'knowledge' | 'news'
    systemId?: number
    tag?: string
    keyword?: string
  }) => {
    loading.value = true
    try {
      const response = await getArticlesApi({
        ...params,
        page: page.value,
        pageSize: pageSize.value
      }) as unknown as ArticleListResponse
      articles.value = response.list
      total.value = response.total
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      loading.value = false
    }
  }

  const likeArticle = async (id: number) => {
    try {
      await likeArticleApi(id)
      const article = articles.value.find(a => a.id === id)
      if (article) {
        article.likes++
      }
    } catch (error) {
      console.error('Failed to like article:', error)
    }
  }

  const setPage = (newPage: number) => {
    page.value = newPage
  }

  return {
    articles,
    loading,
    total,
    page,
    pageSize,
    fetchArticles,
    likeArticle,
    setPage
  }
})
