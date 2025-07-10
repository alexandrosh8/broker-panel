import { format, formatDistance, isValid } from 'date-fns'

export const formatCurrency = (value, options = {}) => {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options

  const num = parseFloat(value)
  if (isNaN(num)) return '$0.00'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num)
}

export const formatNumber = (value, decimals = 2) => {
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export const formatPercentage = (value, decimals = 2) => {
  const num = parseFloat(value)
  if (isNaN(num)) return '0%'
  return `${num.toFixed(decimals)}%`
}

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return 'N/A'
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  if (!isValid(parsedDate)) return 'Invalid Date'
  
  return format(parsedDate, formatString)
}

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A'
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  if (!isValid(parsedDate)) return 'Invalid Date'
  
  return formatDistance(parsedDate, new Date(), { addSuffix: true })
}