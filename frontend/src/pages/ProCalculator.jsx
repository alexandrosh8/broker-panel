import React, { useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { formatCurrency, formatPercentage } from '../utils/format'

export default function ProCalculator() {
  const [accountData, setAccountData] = useState({
    A: { odds: '1.94', bet: '200' },
    B: { odds: '2.10', bet: '185' }
  })
  
  const [commission, setCommission] = useState('0')
  const [cashbackRate, setCashbackRate] = useState('25')

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
    const cashback = parseFloat(cashbackRate) || 0

    // Calculate margin
    const margin = oddsA > 0 && oddsB > 0 ? ((1/oddsA + 1/oddsB - 1) * 100) : 0

    // Calculate optimal bets (simplified)
    const betA = parseFloat(accountData.A.bet) || 0
    const optimalBetB = betA * (oddsA / (oddsB - cashback/100))

    return {
      margin,
      optimalBetB,
      profitIfAWins: betA * (oddsA - 1) * (1 - commissionRate/100) - optimalBetB,
      profitIfBWins: optimalBetB * (oddsB - 1) - betA,
    }
  }

  const results = calculateOptimal()

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

            <Button className="w-full mt-6">
              Log Strategy
            </Button>
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