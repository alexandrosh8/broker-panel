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
    type: 'What I received',
    user: 'Leo',
    amount: 180,
    description: 'Cashback from Bet365',
  },
]

export default function BrokerAccounts() {
  const [activeTab, setActiveTab] = useState('accounts')
  const [accounts] = useState(mockAccounts)
  const [costs] = useState(mockCosts)

  const tabs = [
    { id: 'accounts', label: 'Accounts' },
    { id: 'costs', label: 'Costs & Floats' },
    { id: 'proxies', label: 'Proxies' },
  ]

  const AccountCard = ({ account }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`h-3 w-3 rounded-full ${
            account.isActive ? 'bg-secondary-500' : 'bg-neutral-400'
          }`} />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {account.brokerName}
          </h3>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-neutral-600 dark:text-neutral-400">User</p>
          <p className="font-medium">{account.user}</p>
        </div>
        <div>
          <p className="text-neutral-600 dark:text-neutral-400">Type</p>
          <p className="font-medium">{account.accountType}</p>
        </div>
        <div>
          <p className="text-neutral-600 dark:text-neutral-400">Leverage</p>
          <p className="font-medium">1:{account.leverage}</p>
        </div>
        <div>
          <p className="text-neutral-600 dark:text-neutral-400">Balance</p>
          <p className="font-medium text-secondary-600 dark:text-secondary-400">
            ${account.balance.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  )

  const renderAccounts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Broker Accounts
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your trading accounts and configurations
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  )

  const renderCosts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Costs & Float Accounts
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Track your expenses and float account balances
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((cost) => (
                  <tr key={cost.id} className="border-b border-neutral-100 dark:border-neutral-800">
                    <td className="p-3">{cost.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        cost.type === 'What I pay' 
                          ? 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200'
                          : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
                      }`}>
                        {cost.type}
                      </span>
                    </td>
                    <td className="p-3">{cost.user}</td>
                    <td className="p-3 font-medium">
                      <span className={cost.type === 'What I pay' ? 'text-accent-600' : 'text-secondary-600'}>
                        {cost.type === 'What I pay' ? '-' : '+'}${cost.amount}
                      </span>
                    </td>
                    <td className="p-3">{cost.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )

  const renderProxies = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Proxy Servers
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your proxy configurations for secure trading
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Proxy
        </Button>
      </div>

      <Card>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No proxies configured
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Add your first proxy server to get started
            </p>
            <Button variant="ghost">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Proxy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Broker Management
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Comprehensive management of your broker accounts, costs, and proxy settings
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'accounts' && renderAccounts()}
        {activeTab === 'costs' && renderCosts()}
        {activeTab === 'proxies' && renderProxies()}
      </div>
    </div>
  )
}