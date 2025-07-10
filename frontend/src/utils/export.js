import jsPDF from 'jspdf'
// Import the autoTable plugin correctly
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

export const exportToPDF = (data, title = 'Betting Calculator Results') => {
  try {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.text(title, 20, 20)
    
    // Add timestamp
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 30)
    
    // Add data based on calculator type
    if (data.type === 'single') {
      // Use the autoTable method directly on the doc object
      doc.autoTable({
        startY: 40,
        head: [['Field', 'Value']],
        body: [
          ['Odds', data.odds],
          ['Bet Amount', `$${data.betAmount}`],
          ['Commission (%)', `${data.commission}%`],
          ['Potential Return', `$${data.potentialReturn?.toFixed(2) || 0}`],
          ['Net Profit', `$${data.netProfit?.toFixed(2) || 0}`],
          ['ROI', `${data.roi?.toFixed(2) || 0}%`],
          ['Bookie', data.bookie || 'N/A'],
          ['Sport', data.sport || 'N/A'],
          ['Game', data.game || 'N/A'],
          ['Market', data.market || 'N/A'],
          ['Date', data.date || 'N/A'],
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] },
      })
    } else if (data.type === 'pro') {
      doc.autoTable({
        startY: 40,
        head: [['Field', 'Account A', 'Account B']],
        body: [
          ['Odds', data.accountA.odds, data.accountB.odds],
          ['Bet Amount', `$${data.accountA.bet}`, `$${data.optimalBetB?.toFixed(2) || 0}`],
          ['Commission (%)', `${data.commission}%`, 'N/A'],
          ['Cashback Rate (%)', 'N/A', `${data.cashbackRate}%`],
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] },
      })
      
      // Add results section
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Result', 'Value']],
        body: [
          ['Market Margin', `${data.margin?.toFixed(2) || 0}%`],
          ['Profit if A Wins', `$${data.profitIfAWins?.toFixed(2) || 0}`],
          ['Profit if B Wins', `$${data.profitIfBWins?.toFixed(2) || 0}`],
          ['Optimal Bet B', `$${data.optimalBetB?.toFixed(2) || 0}`],
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [16, 185, 129] },
      })
    }
    
    // Save the PDF
    const filename = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)
    
    return true
  } catch (error) {
    console.error('PDF Export Error:', error)
    throw new Error(`Failed to export PDF: ${error.message}`)
  }
}

export const exportToExcel = (data, title = 'Betting Calculator Results') => {
  const workbook = XLSX.utils.book_new()
  
  let worksheetData = []
  
  if (data.type === 'single') {
    worksheetData = [
      ['Field', 'Value'],
      ['Odds', data.odds],
      ['Bet Amount', data.betAmount],
      ['Commission (%)', data.commission],
      ['Potential Return', data.potentialReturn?.toFixed(2) || 0],
      ['Net Profit', data.netProfit?.toFixed(2) || 0],
      ['ROI (%)', data.roi?.toFixed(2) || 0],
      ['Bookie', data.bookie || 'N/A'],
      ['Sport', data.sport || 'N/A'],
      ['Game', data.game || 'N/A'],
      ['Market', data.market || 'N/A'],
      ['Date', data.date || 'N/A'],
      ['Generated', new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()],
    ]
  } else if (data.type === 'pro') {
    worksheetData = [
      ['Field', 'Account A', 'Account B'],
      ['Odds', data.accountA.odds, data.accountB.odds],
      ['Bet Amount', data.accountA.bet, data.optimalBetB?.toFixed(2) || 0],
      ['Commission (%)', data.commission, 'N/A'],
      ['Cashback Rate (%)', 'N/A', data.cashbackRate],
      [''],
      ['Results', ''],
      ['Market Margin (%)', data.margin?.toFixed(2) || 0],
      ['Profit if A Wins', data.profitIfAWins?.toFixed(2) || 0],
      ['Profit if B Wins', data.profitIfBWins?.toFixed(2) || 0],
      ['Optimal Bet B', data.optimalBetB?.toFixed(2) || 0],
      [''],
      ['Generated', new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()],
    ]
  } else if (data.type === 'broker') {
    worksheetData = [
      ['Broker Name', 'Account Type', 'Leverage', 'User', 'Email', 'Balance', 'Status'],
      ...data.accounts.map(acc => [
        acc.brokerName,
        acc.accountType,
        `1:${acc.leverage}`,
        acc.user,
        acc.email,
        acc.balance,
        acc.isActive ? 'Active' : 'Inactive'
      ]),
      [''],
      ['Generated', new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()],
    ]
  }
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Results')
  
  // Save the Excel file
  XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export const exportCalculatorHistory = (history, calculatorType) => {
  const workbook = XLSX.utils.book_new()
  
  let worksheetData = []
  
  if (calculatorType === 'single') {
    worksheetData = [
      ['Date', 'Odds', 'Bet Amount', 'Commission (%)', 'Potential Return', 'Net Profit', 'ROI (%)', 'Bookie', 'Sport', 'Game', 'Market'],
      ...history.map(item => [
        item.date,
        item.odds,
        item.betAmount,
        item.commission,
        item.potentialReturn?.toFixed(2) || 0,
        item.netProfit?.toFixed(2) || 0,
        item.roi?.toFixed(2) || 0,
        item.bookie || 'N/A',
        item.sport || 'N/A',
        item.game || 'N/A',
        item.market || 'N/A',
      ])
    ]
  } else if (calculatorType === 'pro') {
    worksheetData = [
      ['Date', 'Odds A', 'Bet A', 'Odds B', 'Optimal Bet B', 'Commission (%)', 'Cashback (%)', 'Margin (%)', 'Profit A Wins', 'Profit B Wins'],
      ...history.map(item => [
        item.date,
        item.accountA.odds,
        item.accountA.bet,
        item.accountB.odds,
        item.optimalBetB?.toFixed(2) || 0,
        item.commission,
        item.cashbackRate,
        item.margin?.toFixed(2) || 0,
        item.profitIfAWins?.toFixed(2) || 0,
        item.profitIfBWins?.toFixed(2) || 0,
      ])
    ]
  }
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  XLSX.utils.book_append_sheet(workbook, worksheet, 'History')
  
  // Save the Excel file
  XLSX.writeFile(workbook, `${calculatorType}_calculator_history_${new Date().toISOString().split('T')[0]}.xlsx`)
}