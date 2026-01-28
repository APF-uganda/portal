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

const PaymentsPage: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mtn')
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      description: 'Pay via MTN mobile wallet',
      icon: Smartphone,
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      description: 'Pay via Airtel mobile wallet',
      icon: Wallet,
    },
    {
      id: 'bank',
      name: 'DFCU Bank',
      description: 'Direct bank transfer',
      icon: Building2,
    },
  ]

  const recentTransactions = [
    {
      date: '2023-11-20',
      type: 'Annual Subscription',
      reference: 'APF-SUB-23-001',
      amount: 'UGX 150,000',
      method: 'MTN Mobile Money',
      methodIcon: Smartphone,
    },
    {
      date: '2023-01-15',
      type: 'Application Fee',
      reference: 'APF-APP-23-005',
      amount: 'UGX 50,000',
      method: 'DFCU Bank',
      methodIcon: Building2,
    },
    {
      date: '2022-11-20',
      type: 'Annual Subscription',
      reference: 'APF-SUB-22-001',
      amount: 'UGX 150,000',
      method: 'Airtel Money',
      methodIcon: Wallet,
    },
  ]

  const receipts = [
    {
      title: 'Annual Membership Invoice 2023',
      date: 'November 20, 2023',
      amount: 'UGX 150,000',
    },
    {
      title: 'Annual Membership Invoice 2022',
      date: 'November 20, 2022',
      amount: 'UGX 150,000',
    },
    {
      title: 'Application Fee Receipt 2023',
      date: 'January 15, 2023',
      amount: 'UGX 50,000',
    },
    {
      title: 'Donation Receipt 2022',
      date: 'June 1, 2022',
      amount: 'UGX 100,000',
    },
    {
      title: 'Annual Membership Invoice 2021',
      date: 'November 20, 2021',
      amount: 'UGX 150,000',
    },
    {
      title: 'Workshop Fee Receipt 2021',
      date: 'August 15, 2021',
      amount: 'UGX 75,000',
    },
  ]

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

  const handleDownloadReceipt = (receiptTitle: string) => {
    // Simulate download
    alert(`Downloading ${receiptTitle}...`)
    
    // Show success notification
    const notification = document.createElement('div')
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2'
    notification.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>${receiptTitle} downloaded successfully`
    document.body.appendChild(notification)
    
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }

  const handleViewReceipt = (receiptTitle: string) => {
    alert(`Opening ${receiptTitle} in PDF viewer...`)
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
            January 28, 2026
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
                    
                    return (
                      <div
                        key={method.id}
                        onClick={() => handlePaymentMethodSelect(method.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex items-center gap-4 ${
                          isSelected 
                            ? 'border-purple-600 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
                        }`}
                      >
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                        {isSelected && (
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
              {receipts.map((receipt, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{receipt.title}</h4>
                      <p className="text-xs text-gray-600">Issued: {receipt.date}</p>
                      <p className="text-xs text-gray-600">Amount: {receipt.amount}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => handleViewReceipt(receipt.title)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
                      onClick={() => handleDownloadReceipt(receipt.title)}
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
                className="w-full flex items-center gap-2"
                onClick={() => alert('Downloading all receipts as ZIP file...')}
              >
                <FileArchive className="w-4 h-4" />
                Download All Receipts (ZIP)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default PaymentsPage