import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { config } from '../config'
import { ApiResponse, LoginDto, JwtPayload, AuthRequest } from '../types'

const prisma = new PrismaClient()

export const login = async (
  req: Request<object, ApiResponse, LoginDto>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { username, password } = req.body

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      res.status(401).json({ success: false, error: '用户名或密码错误' })
      return
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      res.status(401).json({ success: false, error: '用户名或密码错误' })
      return
    }

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      role: user.role
    }

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    })

    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, error: '登录失败' })
  }
}

export const logout = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  res.json({ success: true, message: '已退出登录' })
}

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const userId = req.user!.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        nickname: true,
        avatar: true,
        role: true,
        phone: true,
        email: true,
        department: true,
        title: true,
        expertise: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      res.status(404).json({ success: false, error: '用户不存在' })
      return
    }

    res.json({ success: true, data: user })
  } catch (error) {
    console.error('GetCurrentUser error:', error)
    res.status(500).json({ success: false, error: '获取用户信息失败' })
  }
}

export const getTeamMembers = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const members = await prisma.user.findMany({
      where: {
        role: { in: ['IT', 'ADMIN'] }
      },
      select: {
        id: true,
        nickname: true,
        avatar: true,
        role: true,
        department: true,
        title: true,
        expertise: true,
        phone: true,
        email: true,
        status: true
      }
    })

    res.json({ success: true, data: members })
  } catch (error) {
    console.error('GetTeamMembers error:', error)
    res.status(500).json({ success: false, error: '获取团队成员失败' })
  }
}
