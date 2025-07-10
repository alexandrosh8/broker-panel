import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Card, CardHeader, CardBody, CardTitle } from '../components/ui/Card'
import { CalendarIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, PercentIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatPercentage } from '../utils/format'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Mock data for demonstration
const mockAnalyticsData = {
  profitTrend: [
    { date: '2024-01-01', profit: 150 },
    { date: '2024-01-02', profit: 320 },
    { date: '2024-01-03', profit: 280 },
    { date: '2024-01-04', profit: 450 },
    { date: '2024-01-05', profit: 380 },
    { date: '2024-01-06', profit: 520 },
    { date: '2024-01-07', profit: 680 },
  ],
  calculatorUsage: {
    single: 45,
    pro: 35,
    broker: 20,
  },
  bookiePerformance: [
    { name: 'Bet365', profit: 1250, bets: 42 },
    { name: 'William Hill', profit: 890, bets: 28 },
    { name: 'Betfair', profit: 1420, bets: 38 },
    { name: 'Paddy Power', profit: 650, bets: 22 },
  ],
  monthlyStats: [
    { month: 'Jan', revenue: 2400, bets: 120, winRate: 67 },
    { month: 'Feb', revenue: 1398, bets: 98, winRate: 72 },
    { month: 'Mar', revenue: 9800, bets: 186, winRate: 65 },
    { month: 'Apr', revenue: 3908, bets: 156, winRate: 70 },
    { month: 'May', revenue: 4800, bets: 202, winRate: 68 },
    { month: 'Jun', revenue: 3800, bets: 178, winRate: 75 },
  ],
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [data, setData] = useState(mockAnalyticsData)

  // Chart configurations
  const profitTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Profit Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value
          }
        }
      }
    }
  }

  const profitTrendData = {
    labels: data.profitTrend.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Daily Profit',
        data: data.profitTrend.map(item => item.profit),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
      },
    ],
  }

  const calculatorUsageData = {
    labels: ['Single Calculator', 'Pro Calculator', 'Broker Management'],
    datasets: [
      {
        data: [data.calculatorUsage.single, data.calculatorUsage.pro, data.calculatorUsage.broker],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const bookiePerformanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Profit by Bookie',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value
          }
        }
      }
    }
  }

  const bookiePerformanceData = {
    labels: data.bookiePerformance.map(item => item.name),
    datasets: [
      {
        label: 'Profit',
        data: data.bookiePerformance.map(item => item.profit),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  const monthlyStatsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return value + '%'
          }
        }
      },
    },
  }

  const monthlyStatsData = {
    labels: data.monthlyStats.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: data.monthlyStats.map(item => item.revenue),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Win Rate (%)',
        data: data.monthlyStats.map(item => item.winRate),
        type: 'line',
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  }

  // Calculate summary stats
  const totalProfit = data.profitTrend.reduce((sum, item) => sum + item.profit, 0)
  const totalBets = data.bookiePerformance.reduce((sum, item) => sum + item.bets, 0)
  const avgProfit = totalBets > 0 ? totalProfit / totalBets : 0
  const bestBookie = data.bookiePerformance.reduce((best, current) => 
    current.profit > best.profit ? current : best, data.bookiePerformance[0]
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Advanced Analytics
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Comprehensive analysis of your betting patterns and performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Profit</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {formatCurrency(totalProfit)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
              <ArrowTrendingUpIcon className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Avg Profit/Bet</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {formatCurrency(avgProfit)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="p-3 bg-accent-100 dark:bg-accent-900 rounded-lg">
              <CalendarIcon className="h-8 w-8 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Bets</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {totalBets}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <PercentIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Best Bookie</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {bestBookie?.name}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profit Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Trend</CardTitle>
          </CardHeader>
          <CardBody>
            <Line data={profitTrendData} options={profitTrendOptions} />
          </CardBody>
        </Card>

        {/* Calculator Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Calculator Usage</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <Doughnut 
                data={calculatorUsageData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }} 
              />
            </div>
          </CardBody>
        </Card>

        {/* Bookie Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Bookie Performance</CardTitle>
          </CardHeader>
          <CardBody>
            <Bar data={bookiePerformanceData} options={bookiePerformanceOptions} />
          </CardBody>
        </Card>

        {/* Monthly Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardBody>
            <Bar data={monthlyStatsData} options={monthlyStatsOptions} />
          </CardBody>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Bookie Analysis</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left p-3">Bookie</th>
                  <th className="text-left p-3">Total Profit</th>
                  <th className="text-left p-3">Total Bets</th>
                  <th className="text-left p-3">Avg Profit/Bet</th>
                  <th className="text-left p-3">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.bookiePerformance.map((bookie, index) => (
                  <tr key={index} className="border-b border-neutral-100 dark:border-neutral-800">
                    <td className="p-3 font-medium">{bookie.name}</td>
                    <td className="p-3 text-secondary-600 dark:text-secondary-400 font-medium">
                      {formatCurrency(bookie.profit)}
                    </td>
                    <td className="p-3">{bookie.bets}</td>
                    <td className="p-3">{formatCurrency(bookie.profit / bookie.bets)}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200 rounded-full text-xs">
                        {Math.floor(Math.random() * 20 + 60)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}