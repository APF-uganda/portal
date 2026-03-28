/**
 * Payment service - handles payment history and receipt API calls
 * Connected to backend API: GET /api/v1/payments/mobile/history/
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

interface MemberManualPayment {
  id: number
  reference: string
  description: string
  amount: number
  currency: string
  status: 'pending' | 'verified' | 'rejected'
  invoice_number?: string | null
  application_reference?: string | null
  proof_of_payment?: string | null
  created_at: string
  verified_at?: string | null
}

interface SubmitManualPaymentPayload {
  amount: number
  paymentMethod: 'mtn' | 'airtel' | 'bank'
  phoneNumber?: string
  reference?: string
  invoiceNumber?: string
  description?: string
  proofOfPayment: File
}

/**
 * Format ISO date string to readable format
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date string (e.g., "Mar 23, 2026 6:10 PM")
 */
const formatDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return isoDate
  }
}

/**
 * Map a backend payment record to the frontend Transaction type
 */
const mapPaymentToTransaction = (payment: any): Transaction => {
  const providerLabel = payment.provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'
  // Force UGX currency regardless of what backend returns
  const currency = 'UGX'
  return {
    date: formatDate(payment.created_at),
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

const mapManualPaymentToTransaction = (payment: MemberManualPayment): Transaction => {
  const statusText = payment.status.toLowerCase()
  return {
    date: formatDate(payment.created_at),
    type: payment.description || 'Membership Renewal Fee',
    reference: payment.reference || payment.invoice_number || payment.application_reference || `MP-${payment.id}`,
    amount: `UGX ${Number(payment.amount || 0).toLocaleString()}`,
    method: 'Manual Receipt Upload',
    methodIcon: null,
    status: statusText,
    description:
      statusText === 'verified'
        ? 'Receipt verified by admin'
        : statusText === 'rejected'
        ? 'Receipt rejected by admin'
        : 'Receipt submitted, awaiting admin verification',
  }
}

const sortTransactionsByDateDesc = (rows: Transaction[]) =>
  [...rows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const fetchMobileTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/payments/mobile/history/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed mobile payment history: ${response.status}`)
  }

  const data = await response.json()
  console.log('📦 Mobile Transactions API Response:', data)
  console.log('📊 Mobile Transactions Results:', data.results)
  return (data.results || []).map(mapPaymentToTransaction)
}

const fetchMemberManualTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/payments/manual/history/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed manual payment history: ${response.status}`)
  }

  const data = await response.json()
  console.log('📦 Manual Transactions API Response:', data)
  console.log('📊 Manual Transactions Results:', data.results)
  return (data.results || []).map(mapManualPaymentToTransaction)
}

/**
 * Get payment history/transactions
 * @returns Promise with array of transactions
 */
export const getPaymentHistory = async (): Promise<Transaction[]> => {
  try {
    console.log('🔍 getPaymentHistory - Starting fetch...')
    const [mobileResult, manualResult] = await Promise.allSettled([
      fetchMobileTransactions(),
      fetchMemberManualTransactions(),
    ])

    const mobileRows = mobileResult.status === 'fulfilled' ? mobileResult.value : []
    const manualRows = manualResult.status === 'fulfilled' ? manualResult.value : []

    console.log('📱 Mobile transactions count:', mobileRows.length)
    console.log('📝 Manual transactions count:', manualRows.length)

    if (mobileResult.status === 'rejected') {
      console.error('Error fetching mobile payment history:', mobileResult.reason)
    }
    if (manualResult.status === 'rejected') {
      console.error('Error fetching manual payment history:', manualResult.reason)
    }

    const allTransactions = sortTransactionsByDateDesc([...mobileRows, ...manualRows])
    console.log('✅ Total transactions returned:', allTransactions.length)
    console.log('📋 All transactions:', allTransactions)
    
    return allTransactions
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
    const all = await getPaymentHistory()
    return all.slice(0, limit)
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
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/mobile/history/?status=completed`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error(`Failed to fetch receipts: ${response.status}`)
      return []
    }

    const data = await response.json()
    const mobileReceipts = (data.results || []).map((payment: any): Receipt => ({
      id: payment.id,
      title: 'Membership Fee Payment',
      date: formatDate(payment.completed_at || payment.created_at),
      amount: `UGX ${Number(payment.amount).toLocaleString()}`,
      type: 'receipt',
      reference: payment.transaction_reference,
    }))

    const manualResponse = await fetch(`${API_BASE_URL}/api/v1/payments/manual/history/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    let manualReceipts: Receipt[] = []
    if (manualResponse.ok) {
      const manualData = await manualResponse.json()
      manualReceipts = (manualData.results || [])
        .filter((payment: MemberManualPayment) => payment.status === 'verified')
        .map((payment: MemberManualPayment): Receipt => ({
          id: String(payment.id),
          title: payment.description || 'Membership Renewal Payment',
          date: formatDate(payment.verified_at || payment.created_at),
          amount: `UGX ${Number(payment.amount).toLocaleString()}`,
          type: 'receipt',
          reference: payment.reference || payment.invoice_number || payment.application_reference || `MP-${payment.id}`,
        }))
    }

    return [...mobileReceipts, ...manualReceipts]
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return []
  }
}

export const submitManualRenewalPayment = async (
  payload: SubmitManualPaymentPayload & { paymentType?: string }
): Promise<{ id: number; status: string; reference: string }> => {
  const token = getAccessToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const form = new FormData()
  form.append('amount', String(payload.amount))
  form.append('description', payload.description || 'Membership Renewal Fee')
  form.append('reference', payload.reference || '')
  form.append('invoice_number', payload.invoiceNumber || '')
  form.append('payment_method', payload.paymentMethod)
  form.append('payment_type', payload.paymentType || 'membership_renewal')
  if (payload.phoneNumber) {
    form.append('phone_number', payload.phoneNumber)
  }
  form.append('proof_of_payment', payload.proofOfPayment)

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/manual/submit/`, {
    method: 'POST',
    headers,
    body: form,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit payment receipt')
  }

  return {
    id: Number(data.id),
    status: String(data.status || 'pending'),
    reference: String(data.reference || ''),
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
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/mobile/history/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error(`Failed to fetch payment ledger: ${response.status}`)
      return []
    }

    const data = await response.json()
    const payments: any[] = data.results || []
    const invoices: any[] = data.invoices || []
    const applications: any[] = data.applications || []

    const fmt = (iso: string) =>
      new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-')

    // Build a map of invoice_number → completed payment for quick lookup
    const paidInvoiceNums = new Set(
      payments.filter(p => p.status === 'completed' && p.invoice_number).map(p => p.invoice_number)
    )

    const rawEntries: Array<{ sortKey: string; entry: any }> = []

    // 1. One DEBIT row per invoice (the charge)
    invoices.forEach((inv: any) => {
      rawEntries.push({
        sortKey: inv.invoice_date,
        entry: {
          id: `inv-${inv.invoice_number}`,
          date: fmt(inv.invoice_date),
          invoiceNumber: inv.invoice_number,
          description: 'Membership Renewal Fee',
          debit: Number(inv.amount),
          credit: null,
          balance: 0,
          transactionRef: inv.invoice_number,
          hasReceipt: false,
          hasInvoice: true,
          amount: Number(inv.amount),
          status: inv.status,
        },
      })
    })

    // 1b. One DEBIT row per application (the application fee charge)
    applications.forEach((app: any) => {
      rawEntries.push({
        sortKey: app.submitted_at,
        entry: {
          id: `app-${app.application_id}`,
          date: fmt(app.submitted_at),
          invoiceNumber: app.application_id,
          description: 'Application Fee',
          debit: Number(app.amount),
          credit: null,
          balance: 0,
          transactionRef: app.application_id,
          hasReceipt: false,
          hasInvoice: false,
          amount: Number(app.amount),
          status: app.status,
        },
      })
    })

    // 2. One CREDIT row per completed payment
    payments.forEach((payment: any) => {
      if (payment.status !== 'completed') return
      const amount = Number(payment.amount)
      const methodLabel =
        payment.payment_method === 'bank' ? 'Bank Transfer'
        : payment.provider === 'mtn' ? 'MTN Mobile Money'
        : payment.provider === 'airtel' ? 'Airtel Money'
        : 'Mobile Money'
      rawEntries.push({
        sortKey: payment.completed_at || payment.created_at,
        entry: {
          id: `pay-${payment.transaction_reference}`,
          date: fmt(payment.completed_at || payment.created_at),
          invoiceNumber: payment.invoice_number || payment.transaction_reference,
          description: `Payment received – ${methodLabel}`,
          debit: null,
          credit: amount,
          balance: 0,
          transactionRef: payment.transaction_reference,
          hasReceipt: true,
          hasInvoice: false,
          amount,
          method: methodLabel,
          status: 'completed',
        },
      })
    })

    // Sort chronologically
    rawEntries.sort((a, b) => new Date(a.sortKey).getTime() - new Date(b.sortKey).getTime())

    // Calculate running balance
    let balance = 0
    return rawEntries.map(({ entry }) => {
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

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/mobile/history/?${params.toString()}`, {
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

// ─── Renewal / Merchant Code Payment Flow ────────────────────────────────────

export interface MemberInvoice {
  id: number
  invoice_number: string
  user_email: string
  user_name: string
  invoice_date: string
  due_date: string
  period_start: string
  period_end: string
  total_amount: number
  amount_paid: number
  balance_due: number
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
}

export interface RenewalProof {
  id: number
  invoice_number: string
  amount: number
  provider: string
  phone_number: string
  reference_note: string
  proof_file_url: string | null
  status: 'pending_verification' | 'approved' | 'rejected'
  review_notes: string
  reviewed_at: string | null
  created_at: string
  // admin only
  member_email?: string
  member_name?: string
  reviewed_by?: string | null
}

export const getMemberInvoices = async (): Promise<MemberInvoice[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/payments/renewal/invoices/`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export const uploadRenewalProof = async (formData: FormData): Promise<{ success: boolean; message: string }> => {
  const token = getAccessToken()
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE_URL}/api/v1/payments/renewal/upload-proof/`, {
    method: 'POST',
    headers,
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) return { success: false, message: data.error || 'Upload failed' }
  return { success: true, message: data.message || 'Submitted successfully' }
}

export const getMemberProofs = async (): Promise<RenewalProof[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/payments/renewal/my-proofs/`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export const getAdminRenewalProofs = async (statusFilter?: string): Promise<RenewalProof[]> => {
  try {
    const url = statusFilter
      ? `${API_BASE_URL}/api/v1/payments/renewal/admin/proofs/?status=${statusFilter}`
      : `${API_BASE_URL}/api/v1/payments/renewal/admin/proofs/`
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export const approveRenewalProof = async (proofId: number, notes = ''): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/payments/renewal/admin/proofs/${proofId}/approve/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ notes }),
  })
  const data = await res.json()
  return { success: res.ok, message: data.message || data.error || '' }
}

export const rejectRenewalProof = async (proofId: number, notes = ''): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/payments/renewal/admin/proofs/${proofId}/reject/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ notes }),
  })
  const data = await res.json()
  return { success: res.ok, message: data.message || data.error || '' }
}
