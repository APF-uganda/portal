import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Calendar,
  Download,
  ChevronLeft,
  Printer,
  Loader2,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { getCurrentDateFormatted } from "../../utils/dateUtils"
import { showNotification, ReceiptGenerator, ReceiptData } from "../../services/receiptGenerator"
import { getPaymentLedger } from "../../services/payments.service"

// Ledger entry type for financial statement
interface LedgerEntry {
  id: string
  date: string
  invoiceNumber: string
  description: string
  debit: number | null  // DR (UGX)
  credit: number | null // CR (UGX)
  balance: number
  transactionRef: string
  hasReceipt: boolean
  hasInvoice: boolean
  amount: number
  method?: string
  status: string
}

const PaymentHistoryPage: React.FC = () => {
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch payment history from backend
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const entries = await getPaymentLedger()
        setLedgerEntries(entries)
      } catch (err) {
        console.error('Error fetching payment history:', err)
        setError('Failed to load payment history')
        setLedgerEntries([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentHistory()
  }, [])

  const handleDownloadReceipt = async (entry: LedgerEntry) => {
    try {
      showNotification(`Generating receipt for ${entry.invoiceNumber}...`, 'success')
      
      const receiptData: ReceiptData = {
        id: entry.id,
        title: entry.description,
        reference: entry.invoiceNumber,
        date: new Date(entry.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        amount: entry.amount.toString(),
        type: 'receipt',
        description: entry.description,
        method: entry.method,
        status: entry.status
      }
      
      const pdf = await ReceiptGenerator.generateReceiptPDF(receiptData)
      const filename = `APF_Receipt_${entry.invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`
      ReceiptGenerator.downloadPDF(pdf, filename)
      
      showNotification(`Receipt downloaded successfully!`, 'success')
    } catch (error) {
      console.error('Error generating receipt:', error)
      showNotification('Failed to generate receipt. Please try again.', 'error')
    }
  }

  const handleDownloadInvoice = async (entry: LedgerEntry) => {
    try {
      showNotification(`Generating invoice ${entry.invoiceNumber}...`, 'success')
      
      const invoiceData: ReceiptData = {
        id: entry.id,
        title: entry.description,
        reference: entry.invoiceNumber,
        date: new Date(entry.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        amount: entry.amount.toString(),
        type: 'invoice',
        description: entry.description,
        status: entry.status
      }
      
      const pdf = await ReceiptGenerator.generateReceiptPDF(invoiceData)
      const filename = `APF_Invoice_${entry.invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`
      ReceiptGenerator.downloadPDF(pdf, filename)
      
      showNotification(`Invoice downloaded successfully!`, 'success')
    } catch (error) {
      console.error('Error generating invoice:', error)
      showNotification('Failed to generate invoice. Please try again.', 'error')
    }
  }

  const handleExportStatement = () => {
    if (ledgerEntries.length === 0) {
      showNotification('No transactions to export', 'error')
      return
    }

    try {
      let csvContent = 'Date,Invoice Number,Description,DR (UGX),CR (UGX),Balance (UGX)\n'
      
      ledgerEntries.forEach(entry => {
        const row = [
          entry.date,
          entry.invoiceNumber,
          `"${entry.description}"`,
          entry.debit || '',
          entry.credit || '',
          entry.balance
        ].join(',')
        csvContent += row + '\n'
      })
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `APF_Payment_Statement_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showNotification('Payment statement exported successfully', 'success')
    } catch (error) {
      console.error('Export error:', error)
      showNotification('Failed to export payment statement', 'error')
    }
  }

  const formatAmount = (amount: number | null): string => {
    if (amount === null) return '-'
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  const formatBalance = (balance: number): string => {
    if (balance < 0) {
      return `(${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })})`
    }
    return balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  return (
    <DashboardLayout
      headerContent={
        <Link 
          to="/payments" 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Payments
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
            <p className="text-gray-600">Complete account statement and transaction ledger</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportStatement}
              disabled={isLoading || ledgerEntries.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Statement
            </Button>
            <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {getCurrentDateFormatted()}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <Card className="bg-white shadow-sm border border-gray-300">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading payment history...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="bg-white shadow-sm border border-gray-300">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChevronLeft className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading History</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Ledger Table */}
            <Card className="bg-white shadow-sm border border-gray-300">
              <CardHeader className="border-b border-gray-300 bg-gray-50">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Account Statement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm border-r border-gray-300">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm border-r border-gray-300">
                          Invoice Number
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm border-r border-gray-300">
                          Description
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-800 text-sm border-r border-gray-300">
                          DR (UGX)
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-800 text-sm border-r border-gray-300">
                          CR (UGX)
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-800 text-sm border-r border-gray-300">
                          Balance (UGX)
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-800 text-sm">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledgerEntries.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-gray-500">
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        ledgerEntries.map((entry, index) => (
                          <tr 
                            key={index} 
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-gray-900 border-r border-gray-200 whitespace-nowrap">
                              {entry.date}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 border-r border-gray-200 font-mono">
                              {entry.invoiceNumber}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700 border-r border-gray-200">
                              {entry.description}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 border-r border-gray-200 text-right font-medium">
                              {formatAmount(entry.debit)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 border-r border-gray-200 text-right font-medium">
                              {formatAmount(entry.credit)}
                            </td>
                            <td className={`py-3 px-4 text-sm border-r border-gray-200 text-right font-semibold ${
                              entry.balance < 0 ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {formatBalance(entry.balance)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {entry.hasReceipt && (
                                  <button
                                    onClick={() => handleDownloadReceipt(entry)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                                  >
                                    <Download className="w-3 h-3" />
                                    Download Receipt
                                  </button>
                                )}
                                {entry.hasInvoice && (
                                  <button
                                    onClick={() => handleDownloadInvoice(entry)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                                  >
                                    <Download className="w-3 h-3" />
                                    Download Invoice
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Summary Footer */}
            {ledgerEntries.length > 0 && (
              <Card className="bg-gray-50 border border-gray-300">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Total Transactions: <span className="font-semibold text-gray-900">{ledgerEntries.length}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Current Balance: 
                      <span className={`ml-2 font-bold text-lg ${
                        ledgerEntries[ledgerEntries.length - 1].balance < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        UGX {formatBalance(ledgerEntries[ledgerEntries.length - 1].balance)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PaymentHistoryPage
