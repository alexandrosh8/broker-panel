import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatCurrency, formatPercentage, formatDate } from '../utils/format'
import { exportCalculatorHistory } from '../utils/export'

export default function Activities() {
  const [activeTab, setActiveTab] = useState('single')
  const [singleHistory, setSingleHistory] = useState([])
  const [proHistory, setProHistory] = useState([])
  const [brokerHistory, setBrokerHistory] = useState([])

  // Mock data - replace with real API calls
  const mockSingleHistory = [
    {
      id: 1,
      date: '2024-01-15',
      odds: 2.10,
      betAmount: 100,
      commission: 2.5,
      potentialReturn: 210,
      netProfit: 107.5,
      roi: 7.5,
      bookie: 'Bet365',
      sport: 'Football',
      game: 'Arsenal vs Chelsea',
      market: 'Match Winner'
    },
    {
      id: 2,
      date: '2024-01-14',
      odds: 1.85,
      betAmount: 200,
      commission: 2.0,
      potentialReturn: 370,
      netProfit: 166.6,
      roi: 83.3,
      bookie: 'William Hill',
      sport: 'Basketball',
      game: 'Lakers vs Warriors',
      market: 'Total Points Over'
    }
  ]

  const mockProHistory = [
    {
      id: 1,
      date: '2024-01-15',
      accountA: { odds: 1.94, bet: 200 },
      accountB: { odds: 2.10, bet: 185 },
      commission: 2.5,
      cashbackRate: 25,
      margin: -3.2,
      profitIfAWins: 15.5,
      profitIfBWins: 18.2,
      optimalBetB: 185
    },
    {
      id: 2,
      date: '2024-01-14',
      accountA: { odds: 2.05, bet: 150 },
      accountB: { odds: 1.95, bet: 158 },
      commission: 2.0,
      cashbackRate: 20,
      margin: -2.8,
      profitIfAWins: 12.3,
      profitIfBWins: 14.1,
      optimalBetB: 158
    }
  ]

  const mockBrokerHistory = [
    {
      id: 1,
      date: '2024-01-15',
      action: 'Account Created',
      brokerName: 'Bet365',
      accountType: 'Premium',
      amount: 0,
      balance: 5000,
      leverage: 100
    },
    {
      id: 2,
      date: '2024-01-14',
      action: 'Deposit',
      brokerName: 'William Hill',
      accountType: 'Standard',
      amount: 1000,
      balance: 6000,
      leverage: 50
    }
  ]

  useEffect(() => {
    // Load history data from API
    setSingleHistory(mockSingleHistory)
    setProHistory(mockProHistory)
    setBrokerHistory(mockBrokerHistory)
  }, [])

  const handleExportHistory = (type) => {
    const historyData = type === 'single' ? singleHistory : 
                       type === 'pro' ? proHistory : brokerHistory
    exportCalculatorHistory(historyData, type)
  }

  const renderSingleHistory = () => (
    <div className="space-y-4">
      {singleHistory.map((item) => (
        <Card key={item.id}>
          <CardBody>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.game}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.sport} • {item.market} • {item.bookie}
                </p>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">Odds:</span>
                    <span className="font-medium ml-1">{item.odds}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Bet:</span>
                    <span className="font-medium ml-1">{formatCurrency(item.betAmount)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Profit:</span>
                    <span className="font-medium ml-1 text-secondary-600">{formatCurrency(item.netProfit)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">ROI:</span>
                    <span className="font-medium ml-1">{formatPercentage(item.roi)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )

  const renderProHistory = () => (
    <div className="space-y-4">
      {proHistory.map((item) => (
        <Card key={item.id}>
          <CardBody>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Dual Account Arbitrage
                </h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-primary-600 dark:text-primary-400">Account A</h4>
                    <p className="text-sm">Odds: {item.accountA.odds} • Bet: {formatCurrency(item.accountA.bet)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Account B</h4>
                    <p className="text-sm">Odds: {item.accountB.odds} • Bet: {formatCurrency(item.optimalBetB)}</p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">Margin:</span>
                    <span className="font-medium ml-1">{formatPercentage(item.margin)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">If A Wins:</span>
                    <span className="font-medium ml-1 text-secondary-600">{formatCurrency(item.profitIfAWins)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">If B Wins:</span>
                    <span className="font-medium ml-1 text-secondary-600">{formatCurrency(item.profitIfBWins)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Cashback:</span>
                    <span className="font-medium ml-1">{formatPercentage(item.cashbackRate)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )

  const renderBrokerHistory = () => (
    <div className="space-y-4">
      {brokerHistory.map((item) => (
        <Card key={item.id}>
          <CardBody>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.action}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.brokerName} • {item.accountType} Account
                </p>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">Amount:</span>
                    <span className="font-medium ml-1">{formatCurrency(item.amount)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Balance:</span>
                    <span className="font-medium ml-1">{formatCurrency(item.balance)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Leverage:</span>
                    <span className="font-medium ml-1">1:{item.leverage}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              All Activities
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Complete history of your betting calculations
            </p>
          </div>
        </div>
        <Button
          onClick={() => handleExportHistory(activeTab)}
          className="flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          <span>Export History</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
        {[
          { id: 'single', label: 'Single Calculator' },
          { id: 'pro', label: 'Pro Calculator' },
          { id: 'broker', label: 'Broker Accounts' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'single' && renderSingleHistory()}
        {activeTab === 'pro' && renderProHistory()}
        {activeTab === 'broker' && renderBrokerHistory()}
      </div>
    </div>
  )
}