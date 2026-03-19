import request from '../request'
import type { Question, Answer } from '@/types'

export interface CreateQuestionDto {
  title: string
  content: string
  tags: string[]
}

export interface QuestionListParams {
  tag?: string
  keyword?: string
  hasAcceptedAnswer?: boolean
  page?: number
  pageSize?: number
}

export const getQuestions = (params: QuestionListParams) => {
  return request.get<{
    list: Question[]
    total: number
    page: number
    pageSize: number
  }>('/questions', { params })
}

export const getQuestionById = (id: number) => {
  return request.get<Question>(`/questions/${id}`)
}

export const createQuestion = (data: CreateQuestionDto) => {
  return request.post<Question>('/questions', data)
}

export const deleteQuestion = (id: number) => {
  return request.delete<void>(`/questions/${id}`)
}

export const getAnswers = (questionId: number) => {
  return request.get<Answer[]>(`/questions/${questionId}/answers`)
}

export const createAnswer = (questionId: number, content: string) => {
  return request.post<Answer>(`/questions/${questionId}/answers`, { content })
}

export const acceptAnswer = (questionId: number, answerId: number) => {
  return request.post<void>(`/questions/${questionId}/answers/${answerId}/accept`)
}

export const likeAnswer = (answerId: number) => {
  return request.post<void>(`/answers/${answerId}/like`)
}
