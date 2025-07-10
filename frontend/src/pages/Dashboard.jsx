import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  CalculatorIcon, 
  ChartBarIcon, 
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatCurrency, formatPercentage, formatDate } from '../utils/format'
import { cn } from '../utils/cn'

// Mock data - replace with real API calls
const mockStats = {
  totalBalance: 15420.50,
  totalProfit: 2420.50,
  totalStakes: 45000,
  winRate: 67.5,
  activeAccounts: 12,
  pendingBets: 8,
  completedBets: 156,
  lastUpdate: new Date(),
}

const mockRecentActivity = [
  {
    id: 1,
    type: 'bet_placed',
    description: 'Single bet placed on Arsenal vs Chelsea',
    amount: 200,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'pending'
  },
  {
    id: 2,
    type: 'bet_won',
    description: 'Pro bet won - Manchester United vs Liverpool',
    amount: 350,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'completed'
  },
  {
    id: 3,
    type: 'account_added',
    description: 'New broker account added - Bet365',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    status: 'completed'
  },
]

const calculatorCards = [
  {
    title: 'Single Calculator',
    description: 'Calculate single account betting strategies',
    href: '/single',
    icon: CalculatorIcon,
    color: 'bg-primary-500',
    stats: '156 bets logged'
  },
  {
    title: 'Pro Calculator',
    description: 'Advanced dual-account betting calculator',
    href: '/pro',
    icon: ChartBarIcon,
    color: 'bg-secondary-500',
    stats: '89 strategies used'
  },
  {
    title: 'Broker Accounts',
    description: 'Manage your broker accounts and finances',
    href: '/broker',
    icon: BuildingOfficeIcon,
    color: 'bg-accent-500',
    stats: '12 accounts active'
  },
]

export default function Dashboard() {
  const [stats, setStats] = useState(mockStats)
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load dashboard data
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      // const [statsData, activityData] = await Promise.all([
      //   api.get('/dashboard/stats'),
      //   api.get('/dashboard/activity')
      // ])
      // setStats(statsData.data)
      // setRecentActivity(activityData.data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {value}
          </p>
          {change && (
            <div className={cn(
              "flex items-center text-sm",
              trend === 'up' ? 'text-secondary-600' : 'text-accent-600'
            )}>
              {trend === 'up' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className="p-3 bg-neutral-100 dark:bg-neutral-700 rounded-full">
          <Icon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Dashboard
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Welcome back! Here's an overview of your betting activities.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats.totalBalance)}
          change="+12.5%"
          trend="up"
          icon={CurrencyDollarIcon}
        />
        <StatCard
          title="Total Profit"
          value={formatCurrency(stats.totalProfit)}
          change="+8.2%"
          trend="up"
          icon={ArrowTrendingUpIcon}
        />
        <StatCard
          title="Win Rate"
          value={formatPercentage(stats.winRate)}
          change="+2.1%"
          trend="up"
          icon={ChartBarIcon}
        />
        <StatCard
          title="Active Accounts"
          value={stats.activeAccounts}
          icon={BuildingOfficeIcon}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calculatorCards.map((card) => (
            <Link key={card.title} to={card.href}>
              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-full",
                    card.color,
                    "group-hover:scale-110 transition-transform"
                  )}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {card.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                  {card.description}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  {card.stats}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      activity.status === 'pending' ? 'bg-yellow-500' : 'bg-secondary-500'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {activity.description}
                    </p>
                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {formatDate(activity.timestamp, 'MMM dd, HH:mm')}
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="flex-shrink-0">
                      <span className={cn(
                        "text-sm font-medium",
                        activity.type === 'bet_won' ? 'text-secondary-600' : 'text-neutral-900 dark:text-neutral-100'
                      )}>
                        {activity.type === 'bet_won' ? '+' : ''}{formatCurrency(activity.amount)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => window.location.href = '/activities'}
              >
                View All Activity
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Quick Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Pending Bets</span>
                <span className="font-medium">{stats.pendingBets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Completed Bets</span>
                <span className="font-medium">{stats.completedBets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Total Stakes</span>
                <span className="font-medium">{formatCurrency(stats.totalStakes)}</span>
              </div>
              <hr className="border-neutral-200 dark:border-neutral-700" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Last Updated</span>
                <span className="text-sm text-neutral-500">{formatDate(stats.lastUpdate, 'MMM dd, HH:mm')}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}