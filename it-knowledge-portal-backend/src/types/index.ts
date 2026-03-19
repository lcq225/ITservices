import { Request } from 'express'
import { User, System, Article, Question, Answer, Attachment } from '@prisma/client'

export interface JwtPayload {
  userId: number
  username: string
  role: string
}

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface CreateArticleDto {
  title: string
  content: string
  type: 'KNOWLEDGE' | 'NEWS'
  systemId?: number
  tags: string[]
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> {
  status?: 'DRAFT' | 'PUBLISHED'
}

export interface CreateQuestionDto {
  title: string
  content: string
  tags: string[]
  systemId?: number
}

export interface CreateAnswerDto {
  content: string
}

export interface CreateSystemDto {
  name: string
  code: string
  category: string
  description?: string
  managerId?: number
  docLinks?: { name: string; url: string }[]
}

export interface LoginDto {
  username: string
  password: string
}

export type WithAuthor<T> = T & {
  author: Pick<User, 'id' | 'nickname' | 'avatar' | 'role'>
}

export type ArticleWithDetails = Article & {
  author: Pick<User, 'id' | 'nickname' | 'avatar' | 'role'>
  system?: Pick<System, 'id' | 'name' | 'code'> | null
  attachments: Attachment[]
}

export type QuestionWithDetails = Question & {
  author: Pick<User, 'id' | 'nickname' | 'avatar'>
  answers?: AnswerWithAuthor[]
}

export type AnswerWithAuthor = Answer & {
  author: Pick<User, 'id' | 'nickname' | 'avatar' | 'role'>
}
