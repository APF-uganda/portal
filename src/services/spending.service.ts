/**
 * Spending service - calculates spending overview from payment history
 */

import { getPaymentHistory } from './payments.service'

export interface SpendingData {
  year: string
  amount: number
  formattedAmount: string
}

export interface SpendingOverview {
  totalSpent: number
  breakdown: SpendingData[]
}

/**
 * Get spending overview data from payment history
 * @returns Promise with spending overview
 */
export const getSpendingOverview = async (): Promise<SpendingOverview> => {
  console.log('🔍 Spending Overview - Starting calculation...')
  
  try {
    const transactions = await getPaymentHistory()
    console.log('📊 Spending Overview - Total transactions:', transactions.length)
    
    // Filter only completed payment transactions (not invoices)
    // Payments have methods like "MTN Mobile Money", "Airtel Money", "Bank Transfer"
    // Invoices have method "N/A"
    const completedPayments = transactions.filter(t => {
      const isCompleted = t.status.toLowerCase() === 'completed'
      const isPayment = t.method && t.method !== 'N/A'
      const include = isCompleted && isPayment
      
      if (!include && isCompleted) {
        console.log('⚠️ Skipping non-payment transaction:', t.type, t.method)
      }
      
      return include
    })
    
    console.log('✅ Spending Overview - Completed payments:', completedPayments.length)
    
    // If no completed payments, return empty overview
    if (completedPayments.length === 0) {
      console.log('⚠️ Spending Overview - No completed payments found')
      return {
        totalSpent: 0,
        breakdown: []
      }
    }
    
    // Calculate total spent
    const totalSpent = completedPayments.reduce((sum, transaction) => {
      // Extract numeric amount from string like "UGX 150,000"
      const amountStr = transaction.amount.replace(/[^0-9]/g, '')
      const amount = Number(amountStr)
      console.log(`💰 Processing transaction: ${transaction.reference}, amount: ${amountStr} -> ${amount}`)
      return sum + amount
    }, 0)
    
    console.log('💵 Spending Overview - Total spent:', totalSpent)
    
    // Group by year and calculate breakdown
    const yearlySpending: { [key: string]: number } = {}
    
    completedPayments.forEach(transaction => {
      const year = new Date(transaction.date).getFullYear().toString()
      const amountStr = transaction.amount.replace(/[^0-9]/g, '')
      const amount = Number(amountStr)
      
      if (yearlySpending[year]) {
        yearlySpending[year] += amount
      } else {
        yearlySpending[year] = amount
      }
    })
    
    console.log('📅 Spending Overview - Yearly breakdown:', yearlySpending)
    
    // Convert to array and format
    const breakdown: SpendingData[] = Object.entries(yearlySpending)
      .map(([year, amount]) => ({
        year,
        amount,
        formattedAmount: `UGX ${amount.toLocaleString()}`
      }))
      .sort((a, b) => b.year.localeCompare(a.year)) // Sort by year descending
    
    console.log('✅ Spending Overview - Final breakdown:', breakdown)
    
    return {
      totalSpent,
      breakdown
    }
  } catch (error) {
    console.error('❌ Failed to calculate spending overview:', error)
    // Return empty overview on error
    return {
      totalSpent: 0,
      breakdown: []
    }
  }
}

/**
 * Get spending by year
 * @param year - Year to get spending for
 * @returns Promise with spending data
 */
export const getSpendingByYear = async (year: string): Promise<SpendingData | null> => {
  try {
    const overview = await getSpendingOverview()
    return overview.breakdown.find(item => item.year === year) || null
  } catch (error) {
    console.error('Failed to get spending by year:', error)
    return null
  }
}

/**
 * Get spending trend (last N years)
 * @param years - Number of years to fetch
 * @returns Promise with spending trend data
 */
export const getSpendingTrend = async (years: number = 5): Promise<SpendingData[]> => {
  try {
    const overview = await getSpendingOverview()
    return overview.breakdown.slice(0, years)
  } catch (error) {
    console.error('Failed to get spending trend:', error)
    return []
  }
}
