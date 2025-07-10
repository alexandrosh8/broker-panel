import React, { useState, useEffect } from 'react'
import { DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { formatCurrency, formatPercentage } from '../utils/format'
import { exportToPDF, exportToExcel } from '../utils/export'

// Cashback tiers from original HTML
const CASHBACK_TIERS = [
  { threshold: 7000, rate: 40, label: "40% (7K+ Loss)" },
  { threshold: 6000, rate: 35, label: "35% (6-7K Loss)" },
  { threshold: 5000, rate: 30, label: "30% (5-6K Loss)" },
  { threshold: 0, rate: 25, label: "25% (0-5K Loss)" }
]

export default function ProCalculator() {
  const [accountData, setAccountData] = useState({
    A: { odds: '1.94', bet: '200' },
    B: { odds: '2.10', bet: '185' }
  })
  
  const [commission, setCommission] = useState('0')
  const [totalBLosses, setTotalBLosses] = useState(0) // Track cumulative B losses
  const [bettingHistory, setBettingHistory] = useState([]) // Store betting history

  // Calculate current cashback tier based on total B losses
  const getCurrentCashbackTier = () => {
    return CASHBACK_TIERS.find(tier => totalBLosses >= tier.threshold) || CASHBACK_TIERS[CASHBACK_TIERS.length - 1]
  }

  const currentTier = getCurrentCashbackTier()

  const handleAccountChange = (account, field, value) => {
    setAccountData(prev => ({
      ...prev,
      [account]: { ...prev[account], [field]: value }
    }))
  }

  const calculateOptimal = () => {
    const oddsA = parseFloat(accountData.A.odds) || 0
    const oddsB = parseFloat(accountData.B.odds) || 0
    const commissionRate = parseFloat(commission) || 0
    const betA = parseFloat(accountData.A.bet) || 0
    const cashbackRate = currentTier.rate / 100 // Convert to decimal

    // Calculate margin
    const margin = oddsA > 0 && oddsB > 0 ? ((1/oddsA + 1/oddsB - 1) * 100) : 0

    // Calculate optimal bet B using the original formula: betA * oddsA / (oddsB - cashbackRate)
    const denominator = oddsB - cashbackRate
    const optimalBetB = denominator > 0 ? (betA * oddsA) / denominator : 0

    // Calculate profits with proper cashback consideration
    // If A wins: A gets winnings minus commission, B loses stake but gets cashback
    const grossWinningsA = betA * (oddsA - 1)
    const commissionAmount = grossWinningsA * (commissionRate / 100)
    const netWinningsA = grossWinningsA - commissionAmount
    const cashbackAmountIfAWins = optimalBetB * cashbackRate
    const profitIfAWins = netWinningsA - optimalBetB + cashbackAmountIfAWins

    // If B wins: B gets winnings, A loses stake
    const profitIfBWins = (optimalBetB * (oddsB - 1)) - betA

    return {
      margin,
      optimalBetB,
      profitIfAWins,
      profitIfBWins,
      cashbackRate: currentTier.rate,
      cashbackTier: currentTier
    }
  }

  const results = calculateOptimal()

  const handleExportPDF = () => {
    const exportData = {
      type: 'pro',
      accountA: accountData.A,
      accountB: accountData.B,
      commission,
      cashbackRate,
      optimalBetB: results.optimalBetB,
      margin: results.margin,
      profitIfAWins: results.profitIfAWins,
      profitIfBWins: results.profitIfBWins,
    }
    exportToPDF(exportData, 'Pro Calculator Results')
  }

  const handleExportExcel = () => {
    const exportData = {
      type: 'pro',
      accountA: accountData.A,
      accountB: accountData.B,
      commission,
      cashbackRate,
      optimalBetB: results.optimalBetB,
      margin: results.margin,
      profitIfAWins: results.profitIfAWins,
      profitIfBWins: results.profitIfBWins,
    }
    exportToExcel(exportData, 'Pro Calculator Results')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Professional Calculator
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Advanced dual-account betting calculator with arbitrage opportunities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account A */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary-600 dark:text-primary-400">
              Account A
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Odds A"
              type="number"
              step="0.01"
              min="1.01"
              value={accountData.A.odds}
              onChange={(e) => handleAccountChange('A', 'odds', e.target.value)}
            />
            <Input
              label="Bet Amount A"
              type="number"
              step="0.01"
              min="0"
              value={accountData.A.bet}
              onChange={(e) => handleAccountChange('A', 'bet', e.target.value)}
            />
            <Input
              label="Commission (%)"
              type="number"
              step="0.1"
              min="0"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
            />
          </CardBody>
        </Card>

        {/* Account B */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary-600 dark:text-secondary-400">
              Account B
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Odds B"
              type="number"
              step="0.01"
              min="1.01"
              value={accountData.B.odds}
              onChange={(e) => handleAccountChange('B', 'odds', e.target.value)}
            />
            <div className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-2">
                Optimal Bet B
              </p>
              <p className="text-xl font-bold text-secondary-700 dark:text-secondary-300">
                {formatCurrency(results.optimalBetB)}
              </p>
            </div>
            <Input
              label="Cashback Rate (%)"
              type="number"
              step="0.1"
              min="0"
              value={cashbackRate}
              onChange={(e) => setCashbackRate(e.target.value)}
            />
          </CardBody>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                Market Margin
              </p>
              <p className={`text-xl font-bold ${
                results.margin > 5 
                  ? 'text-accent-700 dark:text-accent-300' 
                  : 'text-secondary-700 dark:text-secondary-300'
              }`}>
                {formatPercentage(results.margin)}
              </p>
            </div>

            <div className="p-4 bg-primary-50 dark:bg-primary-900 rounded-lg">
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                Profit if A Wins
              </p>
              <p className="text-xl font-bold text-primary-700 dark:text-primary-300">
                {formatCurrency(results.profitIfAWins)}
              </p>
            </div>

            <div className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-2">
                Profit if B Wins
              </p>
              <p className="text-xl font-bold text-secondary-700 dark:text-secondary-300">
                {formatCurrency(results.profitIfBWins)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                Log Strategy
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={handleExportExcel}>
                <TableCellsIcon className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Strategy Formula */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Formula</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg font-mono text-sm">
            <p className="text-neutral-700 dark:text-neutral-300">
              Optimal Bet B = Bet A × (Odds A ÷ (Odds B - Cashback Rate))
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              Current: {accountData.A.bet} × ({accountData.A.odds} ÷ ({accountData.B.odds} - {parseFloat(cashbackRate)/100})) = {formatCurrency(results.optimalBetB)}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}