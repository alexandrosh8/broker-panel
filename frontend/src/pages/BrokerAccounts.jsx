import React, { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAppStore } from '../stores/appStore'

// Presets from original HTML
const PRESETS = {
  users: ['Soti', 'Leo', 'Alexis', 'Stephie', 'Panayiotis', 'Tania', 'Maou', 'Andreas'],
  emails: ['nsotiroulla@gmail.com', 'titas1812@gmail.com', 'halexandros25@gmail.com', 'isaak.leonidas@gmail.com'],
  leverage: ['30', '200', '400', '500', '1000'],
  accountTypes: ['MT5', 'MT4'],
  brokerNames: ['Bossa FX', 'Baazex', 'Juno'],
  wallets: ['Revo', 'Wise', 'Crypto', 'Boc'],
  floatAccounts: ['ByBit', 'Leo Revo', 'SOTI SKRILL', 'SOTI REVO', 'SOTI HSBC', 'Alexis Wise', 'Stephie Revo'],
  costUsers: ['Alexis', 'Leo'],
  paymentTypes: ['What I pay', 'What I received']
}

// Initial float account owners
const INITIAL_FLOAT_OWNERS = {
  'ByBit': 'Alexis',
  'Leo Revo': 'Leo', 
  'SOTI SKRILL': 'Alexis',
  'SOTI REVO': 'Alexis',
  'SOTI HSBC': 'Alexis',
  'Alexis Wise': 'Alexis',
  'Stephie Revo': 'Leo'
}

export default function BrokerAccounts() {
  const [activeTab, setActiveTab] = useState('accounts')
  const [accounts, setAccounts] = useState([])
  const [costs, setCosts] = useState([])
  const [proxies, setProxies] = useState([])
  const [floatAccounts, setFloatAccounts] = useState(Object.keys(INITIAL_FLOAT_OWNERS))
  const [floatBalances, setFloatBalances] = useState({})
  const [floatOwners, setFloatOwners] = useState(INITIAL_FLOAT_OWNERS)
  
  // Modal states
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showCostModal, setShowCostModal] = useState(false)
  const [showProxyModal, setShowProxyModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  
  // Filters
  const [accountFilter, setAccountFilter] = useState({ status: 'all', search: '' })
  const [costFilter, setCostFilter] = useState({ user: '', type: '', search: '' })
  
  const { addNotification } = useAppStore()

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('brokerAccountsData_v3')
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setAccounts(data.accounts || [])
        setCosts(data.costs || [])
        setProxies(data.proxies || [])
        setFloatAccounts(data.floatAccounts || Object.keys(INITIAL_FLOAT_OWNERS))
        setFloatBalances(data.floatBalances || {})
        setFloatOwners(data.floatOwners || INITIAL_FLOAT_OWNERS)
      } catch (error) {
        console.error('Error loading broker data:', error)
      }
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      accounts,
      costs,
      proxies,
      floatAccounts,
      floatBalances,
      floatOwners
    }
    localStorage.setItem('brokerAccountsData_v3', JSON.stringify(dataToSave))
  }, [accounts, costs, proxies, floatAccounts, floatBalances, floatOwners])

  // Helper functions
  const formatCurrency = (value) => {
    const num = parseFloat(value)
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      })
    } catch (e) {
      return dateString
    }
  }

  // For now, just return a placeholder that matches the current structure
  // but with indicators that comprehensive functionality is coming
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Broker Accounts Manager
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
        {[
          { id: 'accounts', label: 'Accounts' },
          { id: 'costs', label: 'Costs & Floats' },
          { id: 'proxies', label: 'Proxies' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Placeholder Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'accounts' && 'Broker Accounts Management'}
            {activeTab === 'costs' && 'Costs & Float Accounts'}
            {activeTab === 'proxies' && 'Proxy Management'}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🚧 Comprehensive Broker Management Coming Soon
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                The full-featured broker accounts management system is being implemented based on the original HTML version.
              </p>
              <div className="text-left max-w-md mx-auto">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">Features being implemented:</p>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Complete account management (MT4/MT5, leverage, credentials)</li>
                  <li>• Costs & float accounts tracking</li>
                  <li>• Proxy server management</li>
                  <li>• CSV import/export functionality</li>
                  <li>• Financial balance calculations</li>
                  <li>• Advanced filtering and search</li>
                </ul>
              </div>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-4">
                This will match the comprehensive functionality from the original broker-accounts.html
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}