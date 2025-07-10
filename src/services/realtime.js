import { useAppStore } from '../stores/appStore'

class RealtimeService {
  constructor() {
    this.eventSource = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  connect() {
    if (this.eventSource) {
      this.disconnect()
    }

    try {
      this.eventSource = new EventSource('/api/events')
      
      this.eventSource.onopen = () => {
        console.log('Real-time connection established')
        useAppStore.getState().setConnectionStatus(true)
        this.reconnectAttempts = 0
      }

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('Error parsing real-time message:', error)
        }
      }

      this.eventSource.onerror = () => {
        console.log('Real-time connection error')
        useAppStore.getState().setConnectionStatus(false)
        this.handleReconnect()
      }

    } catch (error) {
      console.error('Error establishing real-time connection:', error)
      useAppStore.getState().setConnectionStatus(false)
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }

  handleMessage(data) {
    const { addNotification } = useAppStore.getState()

    switch (data.type) {
      case 'data_updated':
        addNotification({
          type: 'info',
          message: `${data.module} data updated by ${data.user}`,
          duration: 3000,
        })
        // Trigger data refresh in relevant stores
        this.triggerDataRefresh(data.module)
        break

      case 'user_action':
        addNotification({
          type: 'info',
          message: data.message,
          duration: 2000,
        })
        break

      case 'system_notification':
        addNotification({
          type: data.level || 'info',
          message: data.message,
          duration: 5000,
        })
        break

      default:
        console.log('Unknown real-time message type:', data.type)
    }
  }

  triggerDataRefresh(module) {
    // Emit custom events for data refresh
    window.dispatchEvent(new CustomEvent(`refresh-${module}`))
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)
      
      setTimeout(() => {
        this.connect()
      }, delay)
    } else {
      console.log('Max reconnection attempts reached')
      useAppStore.getState().addNotification({
        type: 'error',
        message: 'Real-time connection lost. Please refresh the page.',
        duration: 0, // Persistent notification
      })
    }
  }

  sendMessage(type, data) {
    // For sending messages to server via POST requests
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    }).catch(error => {
      console.error('Error sending real-time message:', error)
    })
  }
}

export const realtimeService = new RealtimeService()

// Auto-connect when module is imported
if (typeof window !== 'undefined') {
  realtimeService.connect()
}