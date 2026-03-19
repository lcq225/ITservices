import request from '../request'
import type { User } from '@/types'

export interface LoginDto {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const login = (data: LoginDto) => {
  return request.post<LoginResponse>('/auth/login', data)
}

export const logout = () => {
  return request.post<void>('/auth/logout')
}

export const getCurrentUser = () => {
  return request.get<User>('/auth/current')
}

export const getTeamMembers = () => {
  return request.get<User[]>('/team')
}

export const updateProfile = (data: Partial<User>) => {
  return request.put<User>('/auth/profile', data)
}
