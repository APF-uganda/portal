import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  CreditCard,
  History,
  FileText,
  Smartphone,
  Wallet,
  Building2,
  Calendar,
  Eye,
  Download,
  CheckCircle,
  FileArchive,
  ExternalLink,
  Loader2,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { getCurrentDateFormatted } from "../../utils/dateUtils"
import { ReceiptGenerator, ReceiptData, showNotification } from "../../services/receiptGenerator"
import { useRecentTransactions, useReceipts } from "../../hooks/usePaymentHistory"
import ProofOfPaymentUpload from "../../components/register-components/ProofOfPaymentUpload"
import { submitManualRenewalPayment } from "../../services/payments.service"

const RENEWAL_AMOUNT = 150000

const PaymentsPage: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mtn')
  const [isProcessing, setIsProcessing] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [reference, setReference] = useState('')
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null)
  const paymentAmount = RENEWAL_AMOUNT

  // Get recent transactions from payment history (shared data source)
  const recentTransactionsResult = useRecentTransactions(3)
  const recentTransactions = recentTransactionsResult?.transactions || []
  const transactionsLoading = recentTransactionsResult?.loading || false
  const refetchTransactions = recentTransactionsResult?.refetch || (() => {})

  // Get receipts from backend
  const receiptsResult = useReceipts()
  const receipts = receiptsResult?.receipts || []
  const receiptsLoading = receiptsResult?.loading || false

  // Show loading state while initial data is being fetched
  if (!recentTransactionsResult || !receiptsResult) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  const paymentMethods = [
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      description: 'Pay via MTN mobile wallet',
      icon: Smartphone,
      disabled: false,
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      description: 'Pay via Airtel mobile wallet',
      icon: Wallet,
      disabled: false,
    },
    {
      id: 'bank',
      name: 'DFCU Bank',
      description: 'Direct bank transfer with receipt upload',
      icon: Building2,
      disabled: false,
    },
  ]

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
  }

  const handleProofOfPaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size must be less than 5MB', 'error')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      showNotification('Please upload a JPG, PNG, or PDF file', 'error')
      return
    }

    setProofOfPayment(file)
  }

  const handleRemoveProofOfPayment = () => {
    setProofOfPayment(null)
    const fileInput = document.getElementById('proofOfPayment') as HTMLInputElement | null
    if (fileInput) fileInput.value = ''
  }

  const validatePhoneForMethod = (): string | null => {
    if (selectedPaymentMethod === 'bank') return null
    if (!/^256\d{9}$/.test(phoneNumber)) {
      return 'Phone number must be in format 256XXXXXXXXX'
    }
    const mtnPrefixes = ['25677', '25678', '25676', '25679']
    const airtelPrefixes = ['25670', '25675', '25674']
    if (selectedPaymentMethod === 'mtn' && airtelPrefixes.some((p) => phoneNumber.startsWith(p))) {
      return 'Please enter an MTN number for MTN payment method'
    }
    if (selectedPaymentMethod === 'airtel' && mtnPrefixes.some((p) => phoneNumber.startsWith(p))) {
      return 'Please enter an Airtel number for Airtel payment method'
    }
    return null
  }

  const handleProceedPayment = async () => {
    if (!proofOfPayment) {
      showNotification('Please upload proof of payment before submitting', 'error')
      return
    }

    const phoneValidationError = validatePhoneForMethod()
    if (phoneValidationError) {
      showNotification(phoneValidationError, 'error')
      return
    }

    setIsProcessing(true)
    try {
      const result = await submitManualRenewalPayment({
        amount: paymentAmount,
        paymentMethod: selectedPaymentMethod as 'mtn' | 'airtel' | 'bank',
        phoneNumber: selectedPaymentMethod === 'bank' ? undefined : phoneNumber.trim(),
        reference: reference.trim() || undefined,
        description: 'Membership Renewal Fee',
        proofOfPayment,
      })
      showNotification(`Receipt submitted successfully. Ref: ${result.reference}`, 'success')
      setPhoneNumber('')
      setReference('')
      setProofOfPayment(null)
      refetchTransactions()
    } catch (error: any) {
      showNotification(error?.message || 'Failed to submit renewal payment', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadReceipt = async (receipt: any) => {
    try {
      showNotification('Generating PDF receipt...', 'success')
      
      const receiptData: ReceiptData = {
        id: receipt.id,
        title: receipt.title,
        reference: receipt.reference,
        date: receipt.date,
        amount: receipt.amount,
        type: receipt.type as 'invoice' | 'receipt'
      }
      
      const pdf = await ReceiptGenerator.generateReceiptPDF(receiptData)
      const filename = `APF_${receipt.reference}_${receipt.title.replace(/\s+/g, '_')}.pdf`
      ReceiptGenerator.downloadPDF(pdf, filename)
      
      showNotification(`${receipt.title} downloaded successfully`, 'success')
    } catch (error) {
      console.error('Download error:', error)
      showNotification('Failed to generate PDF receipt', 'error')
    }
  }

  const handleViewReceipt = async (receipt: any) => {
    try {
      showNotification('Opening PDF receipt...', 'success')
      
      const receiptData: ReceiptData = {
        id: receipt.id,
        title: receipt.title,
        reference: receipt.reference,
        date: receipt.date,
        amount: receipt.amount,
        type: receipt.type as 'invoice' | 'receipt'
      }
      
      const pdf = await ReceiptGenerator.generateReceiptPDF(receiptData)
      const success = ReceiptGenerator.viewPDF(pdf)
      
      if (!success) {
        showNotification('Please allow popups to view receipts', 'error')
      }
    } catch (error) {
      console.error('View error:', error)
      showNotification('Failed to open PDF receipt', 'error')
    }
  }

  const handleDownloadAllReceipts = async () => {
    if (!receipts || receipts.length === 0) {
      showNotification('No receipts available to download', 'error')
      return
    }
    
    try {
      showNotification('Generating receipts summary PDF...', 'success')
      
      const receiptDataList: ReceiptData[] = receipts.map(receipt => ({
        id: receipt.id,
        title: receipt.title,
        reference: receipt.reference,
        date: receipt.date,
        amount: receipt.amount,
        type: receipt.type as 'invoice' | 'receipt'
      }))
      
      const pdf = await ReceiptGenerator.generateSummaryPDF(receiptDataList)
      ReceiptGenerator.downloadPDF(pdf, 'APF_All_Receipts_Summary.pdf')
      
      showNotification('All receipts summary downloaded successfully', 'success')
    } catch (error) {
      console.error('Download all error:', error)
      showNotification('Failed to download receipts summary', 'error')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments & Billing</h1>
            <p className="text-gray-600">Manage your payment methods, view transaction history, and access receipts</p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {getCurrentDateFormatted()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Method Card */}
          <Card className="bg-white shadow-lg border border-gray-200 h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Payment Method</CardTitle>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const isSelected = selectedPaymentMethod === method.id
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => !method.disabled && handlePaymentMethodSelect(method.id)}
                      disabled={method.disabled}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50'
                          : method.disabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-purple-600' : method.disabled ? 'bg-gray-300' : 'bg-gray-200'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{method.name}</p>
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Amount to Pay</span>
                  <span className="text-2xl font-bold text-purple-600">
                    UGX {paymentAmount.toLocaleString()}
                  </span>
                </div>
                {selectedPaymentMethod !== 'bank' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="256XXXXXXXXX"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-600"
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Reference (optional)
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Transaction ID / Receipt No."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-600"
                  />
                </div>
                <div className="mb-4">
                  <ProofOfPaymentUpload
                    proofOfPayment={proofOfPayment}
                    onFileChange={handleProofOfPaymentChange}
                    onRemoveFile={handleRemoveProofOfPayment}
                  />
                </div>
                <Button
                  onClick={handleProceedPayment}
                  disabled={isProcessing || !selectedPaymentMethod || !proofOfPayment}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Submit Renewal Receipt
                    </>
                  )}
                </Button>
                <p className="mt-3 text-xs text-gray-500">
                  Your payment will appear under pending transactions and move to revenue after admin verification.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment History Card */}
          <Card className="bg-white shadow-lg border border-gray-200 h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                Recent Transactions
              </CardTitle>
              <Link to="/payment-history">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No recent transactions</p>
                  <p className="text-gray-500 text-xs mt-1">Your payment history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{transaction.type}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                        <Badge className={`text-xs ${
                          transaction.status.toLowerCase() === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : transaction.status.toLowerCase() === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-600">{transaction.reference}</p>
                        <p className="font-semibold text-gray-900 text-sm">{transaction.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Receipts & Invoices Section */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Receipts & Invoices
            </CardTitle>
            {receipts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAllReceipts}
                className="flex items-center gap-2"
              >
                <FileArchive className="w-4 h-4" />
                Download All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {receiptsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              </div>
            ) : receipts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No receipts available</p>
                <p className="text-gray-500 text-xs mt-1">Receipts will appear here after successful payments</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <Badge className="text-xs bg-green-100 text-green-700">
                        {receipt.type}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{receipt.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">{receipt.date}</p>
                    <p className="text-xs text-gray-600 mb-3">Ref: {receipt.reference}</p>
                    <p className="font-bold text-purple-600 mb-3">{receipt.amount}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReceipt(receipt)}
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReceipt(receipt)}
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </DashboardLayout>
  )
}

export default PaymentsPage
