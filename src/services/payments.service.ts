/**
 * Payment service - handles payment history and receipt API calls
 * Connected to backend API: GET /api/v1/payments/history/
 */

import { Transaction, Receipt } from '../types/payment'
import { getAccessToken } from '../utils/auth'
import { API_BASE_URL } from '../config/api'

/**
 * Helper to build authorized headers
 */
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

/**
 * Map a backend payment record to the frontend Transaction type
 */
const mapPaymentToTransaction = (payment: any): Transaction => {
  const providerLabel = payment.provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'
  // Force UGX currency regardless of what backend returns
  const currency = 'UGX'
  return {
    date: payment.created_at,
    type: 'Membership Fee',
    reference: payment.transaction_reference,
    amount: `${currency} ${Number(payment.amount).toLocaleString()}`,
    method: providerLabel,
    methodIcon: null,
    status: payment.status,
    description: payment.status === 'completed'
      ? `Payment completed via ${providerLabel}`
      : payment.error_message || `Payment ${payment.status}`,
  }
}

/**
 * Get payment history/transactions
 * @returns Promise with array of transactions
 */
export const getPaymentHistory = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/history/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error(`Failed to fetch payment history: ${response.status}`)
      return []
    }

    const data = await response.json()
    const transactions = (data.results || []).map(mapPaymentToTransaction)
    return transactions
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return []
  }
}

/**
 * Get recent transactions (last N transactions)
 * @param limit - Number of recent transactions to fetch
 * @returns Promise with array of recent transactions
 */
export const getRecentTransactions = async (limit: number = 3): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/history/?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error(`Failed to fetch recent transactions: ${response.status}`)
      return []
    }

    const data = await response.json()
    const transactions = (data.results || []).map(mapPaymentToTransaction)
    return transactions
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    return []
  }
}

/**
 * Get all receipts and invoices
 * @returns Promise with array of receipts
 */
export const getReceipts = async (): Promise<Receipt[]> => {
  try {
    // Derive receipts from completed payments
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/history/?status=completed`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error(`Failed to fetch receipts: ${response.status}`)
      return []
    }

    const data = await response.json()
    const receipts = (data.results || []).map((payment: any): Receipt => ({
      id: payment.id,
      title: 'Membership Fee Payment',
      date: payment.completed_at || payment.created_at,
      amount: `UGX ${Number(payment.amount).toLocaleString()}`,
      type: 'receipt',
      reference: payment.transaction_reference,
    }))
    
    return receipts
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return []
  }
}

/**
 * Get payment ledger for account statement view
 * Converts payment history into ledger format with debits, credits, and running balance
 * 
 * LEDGER ACCOUNTING LOGIC FOR MEMBERSHIP RENEWALS:
 * 
 * 1. When a membership renewal invoice is generated (e.g., on 1st April):
 *    - Create a DEBIT entry for the invoice amount
 *    - Use the membership renewal invoice number as the reference
 *    - Balance increases by the invoice amount (amount owed)
 *    - Example: DR: 150,000 | CR: 0 | Balance: 150,000
 * 
 * 2. When the member makes a payment:
 *    - Create a CREDIT entry against the same invoice number
 *    - Balance decreases by the payment amount
 *    - If fully paid: Balance becomes 0
 *    - If partially paid: Balance reduces but remains positive
 *    - Example: DR: 0 | CR: 150,000 | Balance: 0
 * 
 * 3. Ledger entries should show:
 *    - Date: When the transaction occurred
 *    - Invoice Number: The membership renewal invoice reference
 *    - Description: What the entry represents
 *    - DR (UGX): Amount billed to the member
 *    - CR (UGX): Amount the member has paid
 *    - Balance (UGX): Outstanding amount still owed (or 0 if cleared)
 * 
 * @returns Promise with array of ledger entries
 */
export const getPaymentLedger = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/history/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error(`Failed to fetch payment ledger: ${response.status}`)
      return []
    }

    const data = await response.json()
    const payments = data.results || []

    // Convert payments to ledger entries with proper double-entry accounting
    let runningBalance = 0
    const ledgerEntries: any[] = []

    payments.forEach((payment: any) => {
      const amount = Number(payment.amount)
      const date = new Date(payment.created_at)
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      }).replace(/ /g, '-')

      // Use membership renewal invoice number if available, otherwise generate from transaction reference
      const invoiceNumber = payment.invoice_number 
        || (payment.transaction_reference ? `INV-${payment.transaction_reference.substring(4, 16)}` : 'N/A')

      const providerLabel = payment.provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'

      // MEMBERSHIP RENEWAL LEDGER LOGIC:
      // For membership renewals, we need two entries per transaction:
      // 1. DEBIT entry when invoice is raised (amount owed)
      // 2. CREDIT entry when payment is made (amount paid)

      if (payment.status === 'completed') {
        // Step 1: Create DEBIT entry for the invoice (amount billed)
        ledgerEntries.push({
          date: formattedDate,
          invoiceNumber: invoiceNumber,
          description: payment.description || 'Membership Renewal Fee',
          debit: amount,
          credit: null,
          balance: 0, // Will be calculated below
          transactionRef: payment.transaction_reference,
          hasReceipt: false,
          hasInvoice: true,
        })
        runningBalance += amount

        // Step 2: Create CREDIT entry for the payment (amount paid)
        ledgerEntries.push({
          date: formattedDate,
          invoiceNumber: invoiceNumber,
          description: `Payment for ${payment.description || 'Membership Renewal'} - ${providerLabel}`,
          debit: null,
          credit: amount,
          balance: 0, // Will be calculated below
          transactionRef: payment.transaction_reference,
          hasReceipt: true,
          hasInvoice: false,
        })
        runningBalance -= amount
      } else if (payment.status === 'pending' || payment.status === 'processing') {
        // For pending payments, only create DEBIT entry (invoice raised but not paid)
        ledgerEntries.push({
          date: formattedDate,
          invoiceNumber: invoiceNumber,
          description: payment.description || `Membership Renewal Fee - Payment ${payment.status}`,
          debit: amount,
          credit: null,
          balance: 0, // Will be calculated below
          transactionRef: payment.transaction_reference,
          hasReceipt: false,
          hasInvoice: true,
        })
        runningBalance += amount
      }
      // Note: Failed payments are not included in the ledger
    })

    // Calculate running balance for each entry
    let balance = 0
    return ledgerEntries.map(entry => {
      if (entry.debit) balance += entry.debit
      if (entry.credit) balance -= entry.credit
      return { ...entry, balance }
    })
  } catch (error) {
    console.error('Error fetching payment ledger:', error)
    return []
  }
}

/**
 * Filter transactions based on criteria
 * @param _dateRange - Date range filter
 * @param _paymentType - Payment type filter
 * @param status - Status filter
 * @returns Promise with filtered transactions
 */
export const filterTransactions = async (
  _dateRange: string,
  _paymentType: string,
  status: string
): Promise<Transaction[]> => {
  const params = new URLSearchParams()
  if (status && status !== 'all') {
    params.append('status', status)
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/history/?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to filter transactions: ${response.status}`)
  }

  const data = await response.json()
  return (data.results || []).map(mapPaymentToTransaction)
}

/**
 * Process a payment
 * @param paymentData - Payment information
 * @returns Promise with payment result
 */
export const processPayment = async (paymentData: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/payments/initiate/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `Payment failed: ${response.status}`)
  }

  return response.json()
}
