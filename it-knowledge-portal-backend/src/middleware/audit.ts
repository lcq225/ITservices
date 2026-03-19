import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import logger from '../utils/logger'

export const auditLog = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime
    const logData = {
      method: req.method,
      path: req.path,
      userId: req.user?.userId,
      username: req.user?.username,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    }

    if (res.statusCode >= 400) {
      logger.warn('API Request', logData)
    } else {
      logger.info('API Request', logData)
    }
  })

  next()
}

export const sensitiveOperationLog = (
  req: AuthRequest,
  operation: string,
  details?: any
): void => {
  logger.info('Sensitive Operation', {
    method: req.method,
    path: req.path,
    userId: req.user?.userId,
    username: req.user?.username,
    operation,
    details,
    ip: req.ip,
    timestamp: new Date().toISOString()
  })
}
