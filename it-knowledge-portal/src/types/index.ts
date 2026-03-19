export interface System {
  id: number
  name: string
  code: string
  category: string
  description?: string
  manager?: { id: number; nickname: string; phone?: string }
  managerId?: number
  docLinks: { name: string; url: string }[]
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: number
  title: string
  content: string
  type: 'KNOWLEDGE' | 'NEWS'
  systemId?: number
  author: AuthorInfo
  authorId: number
  tags: string[]
  attachments: Attachment[]
  views: number
  likes: number
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: string
  updatedAt: string
}

export interface AuthorInfo {
  id: number
  nickname: string
  avatar?: string
  role: string
}

export interface Attachment {
  id: number
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
}

export interface User {
  id: number
  username: string
  nickname?: string
  avatar?: string
  role: 'USER' | 'IT' | 'ADMIN'
  phone?: string
  email?: string
  department?: string
  title?: string
  expertise?: string[]
  status: 'ONLINE' | 'OFFLINE'
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: number
  title: string
  content: string
  authorId: number
  author: AuthorInfo
  tags: string[]
  answerCount: number
  views: number
  likes: number
  hasAcceptedAnswer: boolean
  createdAt: string
  updatedAt: string
}

export interface Answer {
  id: number
  questionId: number
  content: string
  authorId: number
  author: AuthorInfo
  isAccepted: boolean
  likes: number
  createdAt: string
}

export interface Banner {
  id: number
  title: string
  image: string
  link: string
  type: 'notice' | 'activity' | 'system'
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
