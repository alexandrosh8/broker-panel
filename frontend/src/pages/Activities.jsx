import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatCurrency, formatPercentage, formatDate } from '../utils/format'
import { exportCalculatorHistory } from '../utils/export'
import { useCalculatorStore } from '../stores/calculatorStore'

export default function Activities() {
  const [activeTab, setActiveTab] = useState('single')
  
  // Get data from the calculator store
  const { 
    singleHistory, 
    proHistory, 
    brokerHistory,
    getStats,
    deleteSingleBet,
    deleteProBet,
    deleteBrokerTransaction 
  } = useCalculatorStore()
  
  const stats = getStats()

  // Remove mock data as we're now using real data from the store

  const handleExport = (type) => {
    let dataToExport = []
    let filename = ''
    
    switch (type) {
      case 'single':
        dataToExport = singleHistory
        filename = 'single_calculator_history'
        break
      case 'pro':
        dataToExport = proHistory
        filename = 'pro_calculator_history'
        break
      case 'broker':
        dataToExport = brokerHistory
        filename = 'broker_transaction_history'
        break
      default:
        return
    }
    
    if (dataToExport.length === 0) {
      alert(`No ${type} calculator data to export`)
      return
    }
    
    exportCalculatorHistory(dataToExport, filename)
  }

  const handleDelete = (id, type) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      switch (type) {
        case 'single':
          deleteSingleBet(id)
          break
        case 'pro':
          deleteProBet(id)
          break
        case 'broker':
          deleteBrokerTransaction(id)
          break
      }
    }
  }

  const handleExportHistory = (type) => {
    const historyData = type === 'single' ? singleHistory : 
                       type === 'pro' ? proHistory : brokerHistory
    exportCalculatorHistory(historyData, type)
  }

  const renderSingleHistory = () => (
    <div className="space-y-4">
      {singleHistory.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <p className="text-neutral-500">No single calculator history yet.</p>
              <p className="text-sm text-neutral-400 mt-2">
                Start using the Single Calculator to see your betting history here.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        singleHistory.map((item) => (
          <Card key={item.id}>
            <CardBody>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.game || 'Single Bet'}
                    </h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id, 'single')}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                  {(item.bookie || item.sport || item.market) && (
                    <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                      {item.bookie && <span>Bookie: {item.bookie}</span>}
                      {item.sport && <span className="ml-4">Sport: {item.sport}</span>}
                      {item.market && <span className="ml-4">Market: {item.market}</span>}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatDate(item.date || item.timestamp)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      )}
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