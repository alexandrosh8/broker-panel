class RealtimeService {
  constructor() {
    this.ws = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.listeners = new Map()
    this.userId = null
  }

  connect(userId) {
    if (this.ws) {
      this.disconnect()
    }

    this.userId = userId
    const wsUrl = `${process.env.REACT_APP_BACKEND_URL.replace('https:', 'wss:').replace('http:', 'ws:')}/ws/${userId}`
    
    try {
      this.ws = new WebSocket(wsUrl)
      this.setupEventListeners()
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.scheduleReconnect()
    }
  }

  setupEventListeners() {
    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.isConnected = true
      this.reconnectAttempts = 0
      this.emit('connected')
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.isConnected = false
      this.emit('disconnected')
      this.scheduleReconnect()
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.emit('error', error)
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'connection':
        console.log('WebSocket connection confirmed:', data.message)
        break
      case 'data_update':
        this.emit('dataUpdate', data)
        break
      case 'pong':
        // Handle ping/pong for keep-alive
        break
      default:
        console.log('Unknown message type:', data.type)
    }
  }

  send(data) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(data))
    }
  }

  ping() {
    this.send({ type: 'ping' })
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        if (this.userId) {
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
          this.connect(this.userId)
        }
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.isConnected = false
      this.userId = null
    }
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in event listener:', error)
        }
      })
    }
  }

  // Start keep-alive ping
  startKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval)
    }
    
    this.keepAliveInterval = setInterval(() => {
      if (this.isConnected) {
        this.ping()
      }
    }, 30000) // Ping every 30 seconds
  }

  stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval)
      this.keepAliveInterval = null
    }
  }
}

export const realtimeService = new RealtimeService()

// Auto-start keep-alive when connected
realtimeService.on('connected', () => {
  realtimeService.startKeepAlive()
})

realtimeService.on('disconnected', () => {
  realtimeService.stopKeepAlive()
})