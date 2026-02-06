import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  User,
  FileText,
  CreditCard,
  Activity,
  BarChart3,
  StickyNote,
  Eye,
  Upload,
  RotateCcw,
  Edit,
  Download,
  Briefcase,
  MoreVertical,
  MapPin,
  FileCheck,
  Megaphone,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useProfile } from "../../hooks/useProfile"
import axios from "axios"
import { API_BASE_URL } from "../../config/api"

type MemberDashboardProfile = {
  display_name: string
  membership_category: string
  membership_status: string
  member_since: string | null
  next_renewal_date: string | null
}

type MemberDashboardDocument = {
  id: number
  name: string
  document_type: string
  uploaded_at: string
  file_url: string | null
}

type MemberDashboardActivity = {
  id: number
  action: string
  field_changed: string
  timestamp: string
}

type MemberDashboardNotification = {
  id: number
  message: string
  type: string
  is_read: boolean
  created_at: string
  application_id: number | null
}

type MemberDashboardResponse = {
  profile: MemberDashboardProfile
  documents: MemberDashboardDocument[]
  recent_activity: MemberDashboardActivity[]
  notifications: MemberDashboardNotification[]
}

type PaymentHistoryItem = {
  id: number
  date: string | null
  description: string
  amount: number
  currency: string
  status: string
  reference: string
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("access_token")
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

const MemberDashboard: React.FC = () => {
  const { profile, loading } = useProfile();
  const [dashboardData, setDashboardData] = useState<MemberDashboardResponse | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState<string | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([])
  const [paymentLoading, setPaymentLoading] = useState(true)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  
  // Get display name from profile
  const displayName = profile?.full_name || profile?.first_name || profile?.email?.split('@')[0] || 'Member';
  const memberProfile = dashboardData?.profile

  const formattedMemberSince = useMemo(() => {
    if (!memberProfile?.member_since) {
      return "--"
    }
    return new Date(memberProfile.member_since).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [memberProfile?.member_since])

  const formattedNextRenewal = useMemo(() => {
    if (!memberProfile?.next_renewal_date) {
      return "--"
    }
    return new Date(memberProfile.next_renewal_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [memberProfile?.next_renewal_date])

  const recentActivity = dashboardData?.recent_activity ?? []
  const documents = dashboardData?.documents ?? []

  useEffect(() => {
    let isMounted = true
    const loadDashboard = async () => {
      try {
        setDashboardLoading(true)
        setDashboardError(null)
        const response = await axios.get<MemberDashboardResponse>(
          `${API_BASE_URL}/api/v1/member/dashboard/`,
          {
            headers: getAuthHeaders(),
            timeout: 30000,
          }
        )
        if (isMounted) {
          setDashboardData(response.data)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load dashboard"
        if (isMounted) {
          setDashboardError(message)
        }
      } finally {
        if (isMounted) {
          setDashboardLoading(false)
        }
      }
    }
    loadDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const loadPaymentHistory = async () => {
      try {
        setPaymentLoading(true)
        setPaymentError(null)
        await new Promise((resolve) => setTimeout(resolve, 600))
        const mockPayments: PaymentHistoryItem[] = [
          { id: 1, date: "2024-03-15", description: "Annual Subscription", amount: 150000, currency: "UGX", status: "success", reference: "" },
          { id: 2, date: "2023-03-15", description: "Annual Subscription", amount: 150000, currency: "UGX", status: "success", reference: "" },
          { id: 3, date: "2022-03-15", description: "Annual Subscription", amount: 150000, currency: "UGX", status: "success", reference: "" },
          { id: 4, date: "2021-03-15", description: "Annual Subscription", amount: 150000, currency: "UGX", status: "success", reference: "" },
          { id: 5, date: "2020-03-15", description: "Annual Subscription", amount: 150000, currency: "UGX", status: "success", reference: "" },
        ]
        if (isMounted) {
          setPaymentHistory(mockPayments)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load payments"
        if (isMounted) {
          setPaymentError(message)
        }
      } finally {
        if (isMounted) {
          setPaymentLoading(false)
        }
      }
    }
    loadPaymentHistory()
    return () => {
      isMounted = false
    }
  }, [])


  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-6 md:mb-8">
          {loading || dashboardLoading ? (
            <>
              <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-48 md:w-64 mb-2"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-64 md:w-96"></div>
            </>
          ) : (
            <>
              <h1 className="text-sm md:text-3xl font-bold text-gray-900 mb-2">Welcome back {displayName}</h1>
              {/* <p className="text-sm md:text-base text-gray-600">Here's your membership dashboard with financial insights and recent activity.</p> */}
            </>
          )}
          {dashboardError ? (
            <p className="text-xs md:text-sm text-red-600 mt-2">{dashboardError}</p>
          ) : null}
        </div>

        {/* Top Row - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Membership Status Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <span className="hidden sm:inline">Membership Status</span>
                <span className="sm:hidden">Status</span>
              </CardTitle>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs">
                {memberProfile?.membership_status || "--"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Category</span>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  {memberProfile?.membership_category || "--"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Renewal</span>
                <span className="font-semibold text-gray-900 text-sm">{formattedNextRenewal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900 text-sm">{formattedMemberSince}</span>
              </div>
              <div className="space-y-2 pt-3 md:pt-4">
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs md:text-sm">
                    <Eye className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
                <Link to="/documents">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs md:text-sm">
                    <Upload className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Upload Documents
                  </Button>
                </Link>
                <Link to="/payments">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs md:text-sm">
                    <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Renew Subscription
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <span className="hidden sm:inline">Your Recent Activity</span>
                <span className="sm:hidden">Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-2 md:space-y-3">
                {recentActivity.length === 0 ? (
                  <div className="text-xs md:text-sm text-gray-500">No recent activity.</div>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Edit className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                          {activity.action.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents & Certificates Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <span className="hidden sm:inline">Documents & Certificates</span>
                <span className="sm:hidden">Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-2 md:space-y-3">
                {documents.length === 0 ? (
                  <div className="text-xs md:text-sm text-gray-500">No documents uploaded yet.</div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileCheck className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(doc.uploaded_at).toLocaleDateString("en-US")}
                          </p>
                        </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer flex-shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History Table - Mobile Responsive */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              Application Payments
            </CardTitle>
            <p className="text-xs text-gray-500">Derived from successful application payments.</p>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              {paymentLoading ? (
                <div className="p-4 text-sm text-gray-500">Loading payments...</div>
              ) : paymentError ? (
                <div className="p-4 text-sm text-red-600">{paymentError}</div>
              ) : paymentHistory.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No payment history available.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-600">Date</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-600">Description</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm">
                          {payment.date
                            ? new Date(payment.date).toLocaleDateString("en-US")
                            : "--"}
                        </td>
                        <td className="py-4 px-4 text-sm">{payment.description}</td>
                        <td className="py-4 px-4 text-sm font-semibold text-purple-600">
                          {payment.currency} {payment.amount.toLocaleString("en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {paymentLoading ? (
                <div className="text-sm text-gray-500">Loading payments...</div>
              ) : paymentError ? (
                <div className="text-sm text-red-600">{paymentError}</div>
              ) : paymentHistory.length === 0 ? (
                <div className="text-sm text-gray-500">No payment history available.</div>
              ) : (
                paymentHistory.map((payment) => (
                  <div key={payment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                        <p className="text-xs text-gray-500">
                          {payment.date
                            ? new Date(payment.date).toLocaleDateString("en-US")
                            : "--"}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-purple-600">
                        {payment.currency} {payment.amount.toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Spending Overview Chart */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                Spending Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 md:h-56 flex items-end justify-center gap-3 md:gap-6 px-2 md:px-4 py-4 md:py-6">
                {/* Chart bars - responsive sizing */}
                {['2024', '2023', '2022', '2021', '2020'].map((year) => (
                  <div key={year} className="flex flex-col items-center flex-1 max-w-12 md:max-w-16">
                    <div className="text-xs font-semibold text-purple-600 mb-1 md:mb-2">UGX 150K</div>
                    <div className="w-full h-24 md:h-32 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:opacity-90"></div>
                    <div className="text-xs text-gray-500 mt-1 md:mt-2">{year}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <StickyNote className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                Recent Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200 justify-start">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-purple-600 flex-shrink-0" />
                <span className="text-xs md:text-sm text-gray-700">Your area:</span>
              </div>
              <div className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200 justify-start">
                <FileCheck className="w-4 h-4 md:w-5 md:h-5 text-purple-600 flex-shrink-0" />
                <span className="text-xs md:text-sm text-gray-700">Document verification:</span>
              </div>
              <div className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200 justify-start">
                <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-purple-600 flex-shrink-0" />
                <span className="text-xs md:text-sm text-gray-700">New means:</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MemberDashboard
