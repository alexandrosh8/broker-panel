import React, { useState } from 'react'
import { DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { formatCurrency, formatPercentage } from '../utils/format'
import { exportToPDF, exportToExcel } from '../utils/export'

export default function SingleCalculator() {
  const [formData, setFormData] = useState({
    odds: '1.94',
    betAmount: '200',
    commission: '0',
    date: new Date().toISOString().split('T')[0],
    bookie: '',
    game: '',
    market: '',
    sport: '',
  })

  const [calculations, setCalculations] = useState({
    potentialReturn: 0,
    netProfit: 0,
    commission: 0,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Recalculate on relevant changes
    if (['odds', 'betAmount', 'commission'].includes(name)) {
      calculateResults({ ...formData, [name]: value })
    }
  }

  const calculateResults = (data) => {
    const odds = parseFloat(data.odds) || 0
    const amount = parseFloat(data.betAmount) || 0
    const commissionRate = parseFloat(data.commission) || 0

    const grossProfit = amount * (odds - 1)
    const commissionAmount = grossProfit * (commissionRate / 100)
    const netProfit = grossProfit - commissionAmount
    const potentialReturn = amount + grossProfit

    setCalculations({
      potentialReturn,
      netProfit,
      commission: commissionAmount,
    })
  }

  const handleExportPDF = () => {
    const exportData = {
      type: 'single',
      odds: formData.odds,
      betAmount: formData.betAmount,
      commission: formData.commission,
      potentialReturn: calculations.potentialReturn,
      netProfit: calculations.netProfit,
      roi: parseFloat(formData.betAmount) > 0 ? (calculations.netProfit / parseFloat(formData.betAmount)) * 100 : 0,
      bookie: formData.bookie,
      sport: formData.sport,
      game: formData.game,
      market: formData.market,
      date: formData.date,
    }
    exportToPDF(exportData, 'Single Calculator Results')
  }

  const handleExportExcel = () => {
    const exportData = {
      type: 'single',
      odds: formData.odds,
      betAmount: formData.betAmount,
      commission: formData.commission,
      potentialReturn: calculations.potentialReturn,
      netProfit: calculations.netProfit,
      roi: parseFloat(formData.betAmount) > 0 ? (calculations.netProfit / parseFloat(formData.betAmount)) * 100 : 0,
      bookie: formData.bookie,
      sport: formData.sport,
      game: formData.game,
      market: formData.market,
      date: formData.date,
    }
    exportToExcel(exportData, 'Single Calculator Results')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Save bet to database
    console.log('Saving bet:', formData)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Single Account Calculator
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Calculate betting returns for single account strategies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Betting Inputs</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Odds"
                  name="odds"
                  type="number"
                  step="0.01"
                  min="1.01"
                  value={formData.odds}
                  onChange={handleInputChange}
                  placeholder="1.94"
                />
                
                <Input
                  label="Bet Amount"
                  name="betAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.betAmount}
                  onChange={handleInputChange}
                  placeholder="200"
                />
                
                <Input
                  label="Commission (%)"
                  name="commission"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.commission}
                  onChange={handleInputChange}
                  placeholder="0"
                />
                
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Bookie"
                  name="bookie"
                  value={formData.bookie}
                  onChange={handleInputChange}
                >
                  <option value="">Select Bookie</option>
                  <option value="bet365">Bet365</option>
                  <option value="william-hill">William Hill</option>
                  <option value="paddy-power">Paddy Power</option>
                  <option value="betfair">Betfair</option>
                </Select>

                <Select
                  label="Sport"
                  name="sport"
                  value={formData.sport}
                  onChange={handleInputChange}
                >
                  <option value="">Select Sport</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="cricket">Cricket</option>
                </Select>
              </div>

              <Input
                label="Game"
                name="game"
                value={formData.game}
                onChange={handleInputChange}
                placeholder="e.g., Arsenal vs Chelsea"
              />

              <Input
                label="Market"
                name="market"
                value={formData.market}
                onChange={handleInputChange}
                placeholder="e.g., Match Winner"
              />

              <Button type="submit" className="w-full">
                Log Bet
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bet Results</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Bet Amount
                  </span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(parseFloat(formData.betAmount) || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-primary-50 dark:bg-primary-900 rounded-lg">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    Potential Return
                  </span>
                  <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
                    {formatCurrency(calculations.potentialReturn)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
                  <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    Net Profit
                  </span>
                  <span className="text-lg font-bold text-secondary-700 dark:text-secondary-300">
                    {formatCurrency(calculations.netProfit)}
                  </span>
                </div>

                {calculations.commission > 0 && (
                  <div className="flex justify-between items-center p-4 bg-accent-50 dark:bg-accent-900 rounded-lg">
                    <span className="text-sm font-medium text-accent-600 dark:text-accent-400">
                      Commission
                    </span>
                    <span className="text-lg font-bold text-accent-700 dark:text-accent-300">
                      -{formatCurrency(calculations.commission)}
                    </span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* ROI Display */}
          <Card>
            <CardHeader>
              <CardTitle>Return on Investment</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                  {formatPercentage(
                    parseFloat(formData.betAmount) > 0 
                      ? (calculations.netProfit / parseFloat(formData.betAmount)) * 100 
                      : 0
                  )}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Expected ROI on this bet
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}