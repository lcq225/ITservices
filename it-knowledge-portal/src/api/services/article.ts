import request from '../request'
import type { Article, Attachment } from '@/types'

export interface CreateArticleDto {
  title: string
  content: string
  type: 'knowledge' | 'news'
  systemId?: number
  tags: string[]
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> {
  status?: 'draft' | 'published'
}

export interface ArticleListParams {
  type?: 'knowledge' | 'news'
  systemId?: number
  tag?: string
  keyword?: string
  page?: number
  pageSize?: number
}

export const getArticles = (params: ArticleListParams) => {
  return request.get<{
    list: Article[]
    total: number
    page: number
    pageSize: number
  }>('/articles', { params })
}

export const getArticleById = (id: number) => {
  return request.get<Article>(`/articles/${id}`)
}

export const createArticle = (data: CreateArticleDto) => {
  return request.post<Article>('/articles', data)
}

export const updateArticle = (id: number, data: UpdateArticleDto) => {
  return request.put<Article>(`/articles/${id}`, data)
}

export const deleteArticle = (id: number) => {
  return request.delete<void>(`/articles/${id}`)
}

export const uploadAttachment = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<Attachment>('/attachments/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteAttachment = (id: number) => {
  return request.delete<void>(`/attachments/${id}`)
}

export const likeArticle = (id: number) => {
  return request.post<void>(`/articles/${id}/like`)
}
