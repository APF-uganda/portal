import { useState, useEffect } from 'react'
import { getSpendingOverview, SpendingOverview } from '../services/spending.service'

/**
 * Custom hook for spending overview data
 * Fetches spending data from backend API
 */
export const useSpendingOverview = () => {
  const [data, setData] = useState<SpendingOverview>({
    totalSpent: 0,
    breakdown: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpending = async () => {
      try {
        console.log('🚀 useSpendingOverview - Starting fetch...')
        setLoading(true)
        setError(null)
        
        const spendingData = await getSpendingOverview()
        console.log('📊 useSpendingOverview - Received data:', spendingData)
        setData(spendingData)
      } catch (err) {
        console.error('❌ useSpendingOverview - Error:', err)
        setError('Failed to load spending data')
      } finally {
        setLoading(false)
        console.log('✅ useSpendingOverview - Fetch complete')
      }
    }

    fetchSpending()
  }, [])

  console.log('🔍 useSpendingOverview - Current state:', { data, loading, error })

  return {
    data,
    loading,
    error
  }
}
