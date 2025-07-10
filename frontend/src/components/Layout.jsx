import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  CalculatorIcon, 
  ChartBarIcon, 
  BuildingOfficeIcon, 
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  WifiIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { useAppStore } from '../stores/appStore'
import { cn } from '../utils/cn'

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Single Calculator', href: '/single', icon: CalculatorIcon },
  { name: 'Pro Calculator', href: '/pro', icon: CalculatorIcon },
  { name: 'Broker Accounts', href: '/broker', icon: BuildingOfficeIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartPieIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { isConnected, notifications } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Betting Pro
            </h1>
            <button
              className="lg:hidden p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info and controls */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <WifiIcon className={cn(
                  "h-4 w-4 mr-2",
                  isConnected ? "text-secondary-500" : "text-accent-500"
                )} />
                <span className="text-xs text-neutral-500">
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-neutral-500">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-400 hover:text-accent-500 transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              {/* Notification indicator */}
              {notifications.length > 0 && (
                <div className="relative">
                  <div className="h-2 w-2 bg-accent-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}