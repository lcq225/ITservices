export interface System {
  id: number
  name: string
  code: string
  category: string
  description: string
  manager: string
  managerPhone: string
  department: string
  docLinks: { name: string; url: string }[]
  status: 'online' | 'offline' | 'maintenance'
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: number
  title: string
  content: string
  type: 'knowledge' | 'news'
  systemId?: number
  author: string
  authorId: number
  tags: string[]
  attachments: Attachment[]
  views: number
  likes: number
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
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
  nickname: string
  avatar: string
  role: 'it' | 'admin' | 'user'
  phone: string
  email: string
  department: string
  title: string
  expertise: string[]
  status: 'online' | 'offline'
}

export interface Question {
  id: number
  title: string
  content: string
  authorId: number
  author: string
  authorAvatar: string
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
  author: string
  authorAvatar: string
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
