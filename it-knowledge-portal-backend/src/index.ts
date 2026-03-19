import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { config } from './config'
import { errorHandler } from './middleware/validation'
import {
  authRoutes,
  articleRoutes,
  questionRoutes,
  systemRoutes,
  attachmentRoutes
} from './routes'
import { authenticate } from './middleware/auth'

const app = express()
const httpServer = createServer(app)

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/systems', systemRoutes)
app.use('/api/attachments', attachmentRoutes)

app.use(errorHandler)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join', (room: string) => {
    socket.join(room)
    console.log(`Socket ${socket.id} joined room: ${room}`)
  })

  socket.on('leave', (room: string) => {
    socket.leave(room)
    console.log(`Socket ${socket.id} left room: ${room}`)
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
    console.log('Client disconnected:', socket.id)
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
  console.log(`
╔════════════════════════════════════════════════════════╗
║   IT Services Backend API                           ║
║   Server running on port ${PORT}                         ║
║   Health check: http://localhost:${PORT}/api/health     ║
╚════════════════════════════════════════════════════════╝
  `)
})

export { app, httpServer, io }
