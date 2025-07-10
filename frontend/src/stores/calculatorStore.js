import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCalculatorStore = create(
  persist(
    (set, get) => ({
      // Single Calculator Data
      singleHistory: [],
      addSingleBet: (bet) => {
        const newBet = {
          id: Date.now() + Math.random().toString(16).slice(2),
          timestamp: new Date().toISOString(),
          type: 'single',
          ...bet
        }
        set((state) => ({
          singleHistory: [newBet, ...state.singleHistory]
        }))
        return newBet.id
      },
      
      updateSingleBet: (id, updates) => {
        set((state) => ({
          singleHistory: state.singleHistory.map(bet => 
            bet.id === id ? { ...bet, ...updates } : bet
          )
        }))
      },
      
      deleteSingleBet: (id) => {
        set((state) => ({
          singleHistory: state.singleHistory.filter(bet => bet.id !== id)
        }))
      },
      
      // Pro Calculator Data
      proHistory: [],
      addProBet: (bet) => {
        const newBet = {
          id: Date.now() + Math.random().toString(16).slice(2),
          timestamp: new Date().toISOString(),
          type: 'pro',
          ...bet
        }
        set((state) => ({
          proHistory: [newBet, ...state.proHistory]
        }))
        return newBet.id
      },
      
      updateProBet: (id, updates) => {
        set((state) => ({
          proHistory: state.proHistory.map(bet => 
            bet.id === id ? { ...bet, ...updates } : bet
          )
        }))
      },
      
      deleteProBet: (id) => {
        set((state) => ({
          proHistory: state.proHistory.filter(bet => bet.id !== id)
        }))
      },
      
      // Broker Calculator Data (for future use)
      brokerHistory: [],
      addBrokerTransaction: (transaction) => {
        const newTransaction = {
          id: Date.now() + Math.random().toString(16).slice(2),
          timestamp: new Date().toISOString(),
          type: 'broker',
          ...transaction
        }
        set((state) => ({
          brokerHistory: [newTransaction, ...state.brokerHistory]
        }))
        return newTransaction.id
      },
      
      updateBrokerTransaction: (id, updates) => {
        set((state) => ({
          brokerHistory: state.brokerHistory.map(transaction => 
            transaction.id === id ? { ...transaction, ...updates } : transaction
          )
        }))
      },
      
      deleteBrokerTransaction: (id) => {
        set((state) => ({
          brokerHistory: state.brokerHistory.filter(transaction => transaction.id !== id)
        }))
      },
      
      // Utility functions
      getAllHistory: () => {
        const state = get()
        return [
          ...state.singleHistory,
          ...state.proHistory,
          ...state.brokerHistory
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      },
      
      getHistoryByType: (type) => {
        const state = get()
        switch (type) {
          case 'single':
            return state.singleHistory
          case 'pro':
            return state.proHistory
          case 'broker':
            return state.brokerHistory
          default:
            return []
        }
      },
      
      clearAllHistory: () => {
        set({
          singleHistory: [],
          proHistory: [],
          brokerHistory: []
        })
      },
      
      // Statistics
      getStats: () => {
        const state = get()
        const allHistory = state.getAllHistory()
        
        return {
          totalBets: allHistory.length,
          singleBets: state.singleHistory.length,
          proBets: state.proHistory.length,
          brokerTransactions: state.brokerHistory.length,
          lastActivity: allHistory.length > 0 ? allHistory[0].timestamp : null
        }
      }
    }),
    {
      name: 'calculator-data', // unique name for localStorage
      partialize: (state) => ({
        singleHistory: state.singleHistory,
        proHistory: state.proHistory,
        brokerHistory: state.brokerHistory
      }) // only persist the history data
    }
  )
)