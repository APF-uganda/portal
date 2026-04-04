import React, { useState, useEffect } from "react"
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
import PhoneInputField from "../../components/register-components/PhoneInput"
import { submitManualRenewalPayment } from "../../services/payments.service"
import mtnLogo from "../../assets/images/registerPage-images/mtn.png"
import airtelLogo from "../../assets/images/registerPage-images/airtel.png"
import dfcuLogo from "../../assets/images/registerPage-images/dfcu.jpg"
import { getEvents, Event } from "../../services/cmsApi"

const RENEWAL_AMOUNT = 150000

// Payment details constants
const MERCHANT_CODES = {
  mtn: '123456',
  airtel: '789012',
}

const BANK_DETAILS = {
  accountName: 'Accountancy Practitioners Forum',
  accountNumber: '01410017142250',
  bankName: 'DFCU Bank',
  branch: 'Main Branch'
}

type PaymentType = 'membership_renewal' | 'donation' | 'event' | 'other'

const PaymentsPage: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mtn')
  const [isProcessing, setIsProcessing] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [reference, setReference] = useState('')
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null)
  const [paymentType, setPaymentType] = useState<PaymentType>('membership_renewal')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const [paymentDescription, setPaymentDescription] = useState('')
  const [paidEvents, setPaidEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  
  const paymentAmount = paymentType === 'membership_renewal' 
    ? RENEWAL_AMOUNT 
    : paymentType === 'event' && selectedEvent
    ? paidEvents.find(e => e.documentId === selectedEvent)?.memberPrice || 0
    : parseInt(customAmount) || 0

  // Get recent transactions from payment history (shared data source)
  const recentTransactionsResult = useRecentTransactions(3)
  const recentTransactions = recentTransactionsResult?.transactions || []
  const transactionsLoading = recentTransactionsResult?.loading || false
  const refetchTransactions = recentTransactionsResult?.refetch || (() => {})

  // Get receipts from backend
  const receiptsResult = useReceipts()
  const receipts = receiptsResult?.receipts || []
  const receiptsLoading = receiptsResult?.loading || false

  // Fetch paid events when payment type is 'event'
  useEffect(() => {
    const fetchPaidEvents = async () => {
      if (paymentType === 'event') {
        setLoadingEvents(true)
        try {
          const allEvents = await getEvents()
          const paid = allEvents.filter(event => event.isPaid)
          setPaidEvents(paid)
        } catch (error) {
          console.error('Failed to fetch events:', error)
          showNotification('Failed to load events', 'error')
        } finally {
          setLoadingEvents(false)
        }
      }
    }
    fetchPaidEvents()
  }, [paymentType])

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
      logo: mtnLogo,
      disabled: false,
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      description: 'Pay via Airtel mobile wallet',
      icon: Wallet,
      logo: airtelLogo,
      disabled: false,
    },
    {
      id: 'bank',
      name: 'DFCU Bank',
      description: 'Direct bank transfer with receipt upload',
      icon: Building2,
      logo: dfcuLogo,
      disabled: false,
    },
  ]

  const paymentTypeOptions = [
    { value: 'membership_renewal', label: 'Membership Renewal', description: 'Annual membership fee (UGX 150,000)' },
    { value: 'donation', label: 'Donation', description: 'Support APF with a donation' },
    { value: 'event', label: 'Event Payment', description: 'Pay for events and activities' },
    { value: 'other', label: 'Other Services', description: 'Other payments and services' },
  ]

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
  }

  const handlePaymentTypeChange = (type: PaymentType) => {
    setPaymentType(type)
    if (type === 'membership_renewal') {
      setCustomAmount('')
      setSelectedEvent('')
      setPaymentDescription('')
    } else if (type === 'event') {
      setCustomAmount('')
      setPaymentDescription('')
    } else {
      setSelectedEvent('')
    }
  }

  const handleProofOfPaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      showNotification('File size must be less than 10MB', 'error')
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

    if (paymentType === 'event' && !selectedEvent) {
      showNotification('Please select an event', 'error')
      return
    }

    if (paymentType === 'other' && !paymentDescription.trim()) {
      showNotification('Please specify what you are paying for', 'error')
      return
    }

    if (paymentType !== 'membership_renewal' && paymentType !== 'event' && (!customAmount || parseInt(customAmount) <= 0)) {
      showNotification('Please enter a valid amount', 'error')
      return
    }

    const phoneValidationError = validatePhoneForMethod()
    if (phoneValidationError) {
      showNotification(phoneValidationError, 'error')
      return
    }

    const paymentDescriptions = {
      membership_renewal: 'Membership Renewal Fee',
      donation: 'Donation',
      event: selectedEvent ? `Event Payment - ${paidEvents.find(e => e.documentId === selectedEvent)?.title}` : 'Event Payment',
      other: paymentDescription.trim() || 'Other Services Payment',
    }

    setIsProcessing(true)
    try {
      const result = await submitManualRenewalPayment({
        amount: paymentAmount,
        paymentMethod: selectedPaymentMethod as 'mtn' | 'airtel' | 'bank',
        phoneNumber: selectedPaymentMethod === 'bank' ? undefined : phoneNumber.trim(),
        reference: reference.trim() || undefined,
        description: paymentDescriptions[paymentType],
        proofOfPayment,
        paymentType: paymentType,
      })
      showNotification(`Receipt submitted successfully. Ref: ${result.reference}`, 'success')
      setPhoneNumber('')
      setReference('')
      setProofOfPayment(null)
      setCustomAmount('')
      setSelectedEvent('')
      setPaymentDescription('')
      refetchTransactions()
    } catch (error: any) {
      showNotification(error?.message || 'Failed to submit payment', 'error')
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
      
      const pdf = await (ReceiptGenerator as any).generateSummaryPDF(receiptDataList)
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
              {/* Payment Type Selection */}
              <div className="pb-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are you paying for?
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => handlePaymentTypeChange(e.target.value as PaymentType)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#5F1C9F] focus:ring-2 focus:ring-purple-200 transition-all"
                >
                  {paymentTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

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
                          ? 'border-[#5F1C9F] bg-purple-50'
                          : method.disabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          : 'border-gray-300 hover:border-[#5F1C9F] hover:bg-purple-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden ${
                          isSelected ? 'ring-2 ring-[#5F1C9F]' : ''
                        }`}>
                          <img 
                            src={method.logo} 
                            alt={method.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{method.name}</p>
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-[#5F1C9F]" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="pt-4 border-t border-gray-200">
                {/* Payment Details Display - Merchant Code or Bank Details */}
                {selectedPaymentMethod === 'mtn' && (
                  <div className="mb-4 bg-purple-50 border-2 border-[#5F1C9F] rounded-lg p-4">
                    <h4 className="font-medium text-[#5F1C9F] mb-3">Payment Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-black">Merchant Code:</span>
                        <span className="font-extrabold text-2xl tracking-widest text-[#5F1C9F] bg-white border border-purple-300 rounded px-3 py-1">{MERCHANT_CODES.mtn}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-lg text-black">UGX {paymentAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'airtel' && (
                  <div className="mb-4 bg-purple-50 border-2 border-[#5F1C9F] rounded-lg p-4">
                    <h4 className="font-medium text-[#5F1C9F] mb-3">Payment Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-black">Merchant Code:</span>
                        <span className="font-extrabold text-2xl tracking-widest text-[#5F1C9F] bg-white border border-purple-300 rounded px-3 py-1">{MERCHANT_CODES.airtel}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-lg text-black">UGX {paymentAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'bank' && (
                  <div className="mb-4 bg-white border border-[#5F1C9F] rounded-lg p-4">
                    <h4 className="font-medium text-black mb-3">Bank Transfer Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-black">Account Name:</span>
                        <span className="font-medium text-black">{BANK_DETAILS.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Account Number:</span>
                        <span className="font-extrabold text-2xl tracking-widest text-[#5F1C9F] bg-white border border-purple-300 rounded px-3 py-1">{BANK_DETAILS.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Bank:</span>
                        <span className="font-medium text-black">{BANK_DETAILS.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Branch:</span>
                        <span className="font-medium text-black">{BANK_DETAILS.branch}</span>
                      </div>
                      <div className="flex justify-between border-t border-[#5F1C9F] pt-2 mt-3">
                        <span className="text-black">Amount:</span>
                        <span className="font-bold text-black">UGX {paymentAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {selectedPaymentMethod === 'mtn' && (
                  <div className="mb-4 text-sm text-black bg-white border border-l-4 border-[#9333EA] p-4 rounded-lg">
                    <p className="font-medium mb-2">Payment Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Dial *165# (MTN)</li>
                      <li>Select "Pay Bill"</li>
                      <li>Enter Merchant Code: <span className=" font-bold">{MERCHANT_CODES.mtn}</span></li>
                      <li>Enter Amount: <span className="font-bold">{paymentAmount}</span></li>
                      <li>Enter your name as Reference: <span className="">Your Full Name</span></li>
                      <li>Confirm payment</li>
                      <li>Upload proof of payment below</li>
                    </ol>
                  </div>
                )}

                {selectedPaymentMethod === 'airtel' && (
                  <div className="mb-4 text-sm text-black bg-white border border-l-4 border-[#9333EA] p-4 rounded-lg">
                    <p className="font-medium mb-2">Payment Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Dial *185# (Airtel)</li>
                      <li>Select "Pay Bill"</li>
                      <li>Enter Merchant Code: <span className=" font-bold">{MERCHANT_CODES.airtel}</span></li>
                      <li>Enter Amount: <span className="font-bold">{paymentAmount}</span></li>
                      <li>Enter your name as Reference: <span className="">Your Full Name</span></li>
                      <li>Confirm payment</li>
                      <li>Upload proof of payment below</li>
                    </ol>
                  </div>
                )}

                {selectedPaymentMethod === 'bank' && (
                  <div className="mb-4 text-sm text-black bg-white border border-l-4 border-[#5F1C9F] p-4 rounded-lg">
                    <p className="font-medium mb-2">Payment Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Transfer UGX {paymentAmount.toLocaleString()} to the account details above</li>
                      <li>Use "APF - {paymentTypeOptions.find(opt => opt.value === paymentType)?.label}" as the reference</li>
                      <li>Take a screenshot or photo of the transaction receipt</li>
                      <li>Upload the proof of payment below</li>
                    </ol>
                  </div>
                )}

                {/* Custom Amount Input for non-renewal payments */}
                {paymentType === 'event' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Event
                    </label>
                    {loadingEvents ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 text-[#5F1C9F] animate-spin" />
                        <span className="ml-2 text-sm text-gray-600">Loading events...</span>
                      </div>
                    ) : paidEvents.length === 0 ? (
                      <div className="text-sm text-gray-500 py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                        No paid events available at the moment
                      </div>
                    ) : (
                      <>
                        <select
                          value={selectedEvent}
                          onChange={(e) => setSelectedEvent(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#5F1C9F] focus:ring-2 focus:ring-purple-200 transition-all"
                        >
                          <option value="">-- Select an event --</option>
                          {paidEvents.map((event) => (
                            <option key={event.documentId} value={event.documentId}>
                              {event.title} - UGX {event.memberPrice.toLocaleString()} ({event.date})
                            </option>
                          ))}
                        </select>
                        {selectedEvent && (
                          <p className="text-xs text-gray-500 mt-1">
                            Event Fee: UGX {paidEvents.find(e => e.documentId === selectedEvent)?.memberPrice.toLocaleString()}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {paymentType === 'other' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are you paying for? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={paymentDescription}
                      onChange={(e) => setPaymentDescription(e.target.value)}
                      placeholder="e.g., Training materials, Consultation fee, etc."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#5F1C9F] focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                )}

                {(paymentType === 'donation' || paymentType === 'other') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Amount (UGX) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount in UGX"
                      min="1000"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#5F1C9F] focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                    {customAmount && parseInt(customAmount) > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Amount: UGX {parseInt(customAmount).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {selectedPaymentMethod !== 'bank' && (
                  <div className="mb-4">
                    <PhoneInputField
                      label="Phone Number"
                      required
                      operator={selectedPaymentMethod === 'mtn' ? 'mtn' : 'airtel'}
                      value={phoneNumber || undefined}
                      onChange={(val) => setPhoneNumber(val || '')}
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#5F1C9F]"
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
                  disabled={
                    isProcessing || 
                    !selectedPaymentMethod || 
                    !proofOfPayment || 
                    (paymentType === 'event' && !selectedEvent) ||
                    (paymentType === 'other' && !paymentDescription.trim()) ||
                    ((paymentType === 'donation' || paymentType === 'other') && (!customAmount || parseInt(customAmount) <= 0))
                  }
                  className="w-full bg-[#5F1C9F] hover:bg-[#4a1580] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Submit Payment Receipt
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
