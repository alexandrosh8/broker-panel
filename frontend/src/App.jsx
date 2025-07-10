import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SingleCalculator from './pages/SingleCalculator'
import ProCalculator from './pages/ProCalculator'
import BrokerAccounts from './pages/BrokerAccounts'
import Settings from './pages/Settings'
import { cn } from './utils/cn'

function App() {
  const { isAuthenticated } = useAuthStore()
  const { theme } = useThemeStore()

  return (
    <div className={cn("min-h-screen transition-colors duration-300", theme)}>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/single" element={<SingleCalculator />} />
            <Route path="/pro" element={<ProCalculator />} />
            <Route path="/broker" element={<BrokerAccounts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  )
}

export default App