import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

class SocketService {
  private socket: Socket | null = null
  private connected = ref(false)

  connect() {
    if (this.socket?.connected) return

    this.socket = io('/', {
      path: '/socket.io',
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.connected.value = true
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      this.connected.value = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
    this.connected.value = false
  }

  joinRoom(room: string) {
    this.socket?.emit('join', room)
  }

  leaveRoom(room: string) {
    this.socket?.emit('leave', room)
  }

  onNewQuestion(callback: (data: any) => void) {
    this.socket?.on('question-update', callback)
  }

  onNewAnswer(callback: (data: any) => void) {
    this.socket?.on('answer-update', callback)
  }

  onNewArticle(callback: (data: any) => void) {
    this.socket?.on('article-update', callback)
  }

  removeListener(event: string) {
    this.socket?.off(event)
  }

  isConnected() {
    return this.connected.value
  }
}

export const socketService = new SocketService()
