import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { config } from './config'
import { errorHandler } from './middleware/validation'
import {
  authLimiter,
  apiLimiter
} from './middleware/rateLimit'
import { securityHeaders, requestSanitizer } from './middleware/security'
import { auditLog } from './middleware/audit'
import {
  authRoutes,
  articleRoutes,
  questionRoutes,
  systemRoutes,
  attachmentRoutes
} from './routes'
import logger from './utils/logger'

const app = express()
const httpServer = createServer(app)

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
})

app.use(securityHeaders)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(requestSanitizer)
app.use(auditLog)
app.use(apiLimiter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/systems', systemRoutes)
app.use('/api/attachments', attachmentRoutes)

app.use(errorHandler)

io.on('connection', (socket) => {
  logger.info('Socket connected', { socketId: socket.id })

  socket.on('join', (room: string) => {
    socket.join(room)
    logger.info('Socket joined room', { socketId: socket.id, room })
  })

  socket.on('leave', (room: string) => {
    socket.leave(room)
    logger.info('Socket left room', { socketId: socket.id, room })
  })

  socket.on('new-question', (data) => {
    io.to('questions').emit('question-update', data)
  })

  socket.on('new-answer', (data) => {
    io.to(`question-${data.questionId}`).emit('answer-update', data)
  })

  socket.on('new-article', (data) => {
    io.to('articles').emit('article-update', data)
  })

  socket.on('disconnect', () => {
    logger.info('Socket disconnected', { socketId: socket.id })
  })
})

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
        username: string
        role: string
      }
    }
  }
}

const PORT = config.port

httpServer.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`)
  console.log(`
╔════════════════════════════════════════════════════════╗
║   IT Services Backend API                       ║
║   Server running on port ${PORT}                     ║
║   Health check: http://localhost:${PORT}/api/health     ║
╚════════════════════════════════════════════════════╝
  `)
})

export { app, httpServer, io }
