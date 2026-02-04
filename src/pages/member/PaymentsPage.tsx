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
  Lock,
  CheckCircle,
  FileArchive,
  ExternalLink,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { getCurrentDateFormatted } from "../../utils/dateUtils"
import { ReceiptGenerator, ReceiptData, showNotification } from "../../services/receiptGenerator"
import { TransactionDataService } from "../../services/transactionData"

const PaymentsPage: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mtn')
  const [isProcessing, setIsProcessing] = useState(false)

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
      description: 'Direct bank transfer (Currently unavailable)',
      icon: Building2,
      disabled: true,
    },
  ]

  // Get recent transactions from the shared service
  const recentTransactions = TransactionDataService.getRecentTransactions(3)

  // Get receipts from the shared service
  const receipts = TransactionDataService.getAllReceipts()

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
  }

  const handleProceedPayment = () => {
    setIsProcessing(true)
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod)
    
    setTimeout(() => {
      alert(`Redirecting to secure payment gateway with ${selectedMethod?.name}...`)
      setIsProcessing(false)
    }, 1500)
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
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Select Payment Method</h3>
                <p className="text-gray-600 text-sm mb-4">Choose your preferred payment method for transactions</p>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    const isSelected = selectedPaymentMethod === method.id
                    const isDisabled = method.disabled
                    
                    return (
                      <div
                        key={method.id}
                        onClick={() => !isDisabled && handlePaymentMethodSelect(method.id)}
                        className={`border-2 rounded-lg p-4 transition-all flex items-center gap-4 ${
                          isDisabled 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                            : isSelected 
                              ? 'border-purple-600 bg-purple-50 cursor-pointer' 
                              : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30 cursor-pointer'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isDisabled ? 'bg-gray-200' : 'bg-purple-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${isDisabled ? 'text-gray-400' : 'text-purple-600'}`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                            {method.name}
                            {isDisabled && (
                              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                Unavailable
                              </span>
                            )}
                          </div>
                          <div className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                            {method.description}
                          </div>
                        </div>
                        {isSelected && !isDisabled && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong className="text-purple-700">Secure payment powered by APF Pay.</strong> All transactions are encrypted with bank-level security.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong className="text-purple-700">Important Notice:</strong> Please review your selected payment purpose and method before proceeding to ensure accurate transaction processing.
                </p>
              </div>

              <Button 
                onClick={handleProceedPayment}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Proceed to Secure Payment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Payment History Card */}
          <Card className="bg-white shadow-lg border border-gray-200 h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Recent Transactions</CardTitle>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="w-6 h-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => {
                  const MethodIcon = transaction.methodIcon
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{transaction.date}</div>
                          <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">
                            {transaction.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{transaction.amount}</div>
                          <div className="text-sm text-gray-600">{transaction.reference}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <MethodIcon className="w-3 h-3 text-purple-600" />
                        </div>
                        {transaction.method}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <Link to="/payment-history">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Complete Payment History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Receipts & Invoices Card - Full Width */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800">Receipts & Invoices</CardTitle>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">Here you can download your invoices and receipts in PDF format for your records.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{receipt.title}</h4>
                      <p className="text-xs text-gray-600">Issued: {receipt.date}</p>
                      <p className="text-xs text-gray-600">Amount: {receipt.amount}</p>
                      <p className="text-xs text-gray-500">Ref: {receipt.reference}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs hover:bg-purple-50 hover:border-purple-300"
                      onClick={() => handleViewReceipt(receipt)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
                      onClick={() => handleDownloadReceipt(receipt)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                onClick={handleDownloadAllReceipts}
              >
                <FileArchive className="w-4 h-4" />
                Download All Receipts Summary (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default PaymentsPage