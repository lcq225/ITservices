import request from '../request'
import type { System } from '@/types'

export interface CreateSystemDto {
  name: string
  code: string
  category: string
  description: string
  managerId: number
  docLinks: { name: string; url: string }[]
}

export interface UpdateSystemDto extends Partial<CreateSystemDto> {
  status?: 'online' | 'offline' | 'maintenance'
}

export const getSystems = (category?: string) => {
  return request.get<System[]>('/systems', {
    params: { category }
  })
}

export const getSystemById = (id: number) => {
  return request.get<System>(`/systems/${id}`)
}

export const createSystem = (data: CreateSystemDto) => {
  return request.post<System>('/systems', data)
}

export const updateSystem = (id: number, data: UpdateSystemDto) => {
  return request.put<System>(`/systems/${id}`, data)
}

export const deleteSystem = (id: number) => {
  return request.delete<void>(`/systems/${id}`)
}
