import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export const useAppStore = create(
  subscribeWithSelector((set, get) => ({
    // Global loading state
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
    
    // Notifications
    notifications: [],
    addNotification: (notification) => {
      const id = Date.now() + Math.random()
      const newNotification = {
        id,
        type: 'info',
        duration: 4000,
        ...notification,
      }
      
      set((state) => ({
        notifications: [...state.notifications, newNotification],
      }))
      
      // Auto remove notification
      if (newNotification.duration > 0) {
        setTimeout(() => {
          get().removeNotification(id)
        }, newNotification.duration)
      }
      
      return id
    },
    
    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    },
    
    clearNotifications: () => set({ notifications: [] }),
    
    // Real-time connection status
    isConnected: true,
    setConnectionStatus: (status) => set({ isConnected: status }),
    
    // Data sync status
    lastSyncTime: null,
    isSyncing: false,
    setSyncStatus: (syncing) => set({ isSyncing: syncing }),
    setLastSyncTime: () => set({ lastSyncTime: new Date().toISOString() }),
  }))
)