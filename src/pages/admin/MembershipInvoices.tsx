import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, Mail, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

interface Invoice {
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
  email_sent: boolean
  email_sent_at: string | null
}

const MembershipInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    overdue: 0,
    totalAmount: 0,
    totalPaid: 0,
    totalOutstanding: 0
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const response = await fetch('/api/v1/admin/membership-invoices/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setInvoices(data.results || [])
        calculateStats(data.results || [])
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (invoiceList: Invoice[]) => {
    const stats = {
      total: invoiceList.length,
      pending: invoiceList.filter(i => i.status === 'pending').length,
      paid: invoiceList.filter(i => i.status === 'paid').length,
      overdue: invoiceList.filter(i => i.status === 'overdue').length,
      totalAmount: invoiceList.reduce((sum, i) => sum + i.total_amount, 0),
      totalPaid: invoiceList.reduce((sum, i) => sum + i.amount_paid, 0),
      totalOutstanding: invoiceList.reduce((sum, i) => sum + i.balance_due, 0)
    }
    setStats(stats)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      partial: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      overdue: { color: 'bg-red-100 text-red-800', icon: XCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    }
    
    const variant = variants[status] || variants.pending
    const Icon = variant.icon
    
    return (
      <Badge className={`${variant.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const resendInvoice = async (invoiceId: number) => {
    try {
      const response = await fetch(`/api/v1/admin/membership-invoices/${invoiceId}/resend/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      if (response.ok) {
        alert('Invoice email resent successfully')
        fetchInvoices()
      }
    } catch (error) {
      console.error('Failed to resend invoice:', error)
      alert('Failed to resend invoice')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership Invoices</h1>
          <p className="text-gray-600 mt-1">Manage and track membership renewal invoices</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Total Invoices</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Paid</div>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Overdue</div>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600">Total Billed</div>
              <div className="text-xl font-bold text-gray-900">UGX {stats.totalAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Collected</div>
              <div className="text-xl font-bold text-green-600">UGX {stats.totalPaid.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Outstanding</div>
              <div className="text-xl font-bold text-red-600">UGX {stats.totalOutstanding.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by invoice number, email, or name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading invoices...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Invoice #</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Member</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Period</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Paid</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Balance</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Email</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className=" text-sm">{invoice.invoice_number}</div>
                        <div className="text-xs text-gray-500">{invoice.invoice_date}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{invoice.user_name}</div>
                        <div className="text-sm text-gray-500">{invoice.user_email}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(invoice.period_start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                        {new Date(invoice.period_end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        UGX {invoice.total_amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={invoice.amount_paid > 0 ? 'text-green-600 font-semibold' : ''}>
                          UGX {invoice.amount_paid.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={invoice.balance_due > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                          UGX {invoice.balance_due.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {invoice.email_sent ? (
                          <span className="text-green-600 text-sm">✓ Sent</span>
                        ) : (
                          <span className="text-red-600 text-sm">✗ Not Sent</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resendInvoice(invoice.id)}
                            aria-label="Resend Email"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            aria-label="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MembershipInvoices
