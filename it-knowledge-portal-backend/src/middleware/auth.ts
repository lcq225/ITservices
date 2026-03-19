import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { AuthRequest, JwtPayload, ApiResponse } from '../types'

export const authenticate = (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: '未提供认证令牌' })
    return
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ success: false, error: '令牌无效或已过期' })
  }
}

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: '未认证' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: '权限不足' })
      return
    }

    next()
  }
}

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload
      req.user = decoded
    } catch {
      // ignore invalid token for optional auth
    }
  }

  next()
}
