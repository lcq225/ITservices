import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { ApiResponse, AuthRequest, CreateSystemDto } from '../types'

const prisma = new PrismaClient()

export const getSystems = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { category } = req.query

    const where: any = {}
    if (category) where.category = category

    const systems = await prisma.system.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        manager: {
          select: { id: true, nickname: true, phone: true }
        }
      }
    })

    res.json({ success: true, data: systems })
  } catch (error) {
    console.error('GetSystems error:', error)
    res.status(500).json({ success: false, error: '获取系统列表失败' })
  }
}

export const getSystemById = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params

    const system = await prisma.system.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        manager: {
          select: { id: true, nickname: true, phone: true, email: true, department: true }
        }
      }
    })

    if (!system) {
      res.status(404).json({ success: false, error: '系统不存在' })
      return
    }

    res.json({ success: true, data: system })
  } catch (error) {
    console.error('GetSystemById error:', error)
    res.status(500).json({ success: false, error: '获取系统详情失败' })
  }
}

export const createSystem = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const data: CreateSystemDto = req.body

    const system = await prisma.system.create({
      data: {
        name: data.name,
        code: data.code,
        category: data.category,
        description: data.description,
        managerId: data.managerId,
        docLinks: data.docLinks || []
      }
    })

    res.json({ success: true, data: system })
  } catch (error) {
    console.error('CreateSystem error:', error)
    res.status(500).json({ success: false, error: '创建系统失败' })
  }
}

export const updateSystem = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params
    const data = req.body

    const system = await prisma.system.update({
      where: { id: parseInt(id, 10) },
      data
    })

    res.json({ success: true, data: system })
  } catch (error) {
    console.error('UpdateSystem error:', error)
    res.status(500).json({ success: false, error: '更新系统失败' })
  }
}

export const deleteSystem = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params

    await prisma.system.delete({
      where: { id: parseInt(id, 10) }
    })

    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('DeleteSystem error:', error)
    res.status(500).json({ success: false, error: '删除系统失败' })
  }
}
