import React from "react"
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
  Home,
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

const MemberDashboard: React.FC = () => {
  const { profile, loading } = useProfile();
  
  // Get display name from profile
  const displayName = profile?.full_name || profile?.first_name || profile?.email?.split('@')[0] || 'Member';

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-6 md:mb-8">
          {loading ? (
            <>
              <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-48 md:w-64 mb-2"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-64 md:w-96"></div>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, {displayName}!</h1>
              <p className="text-sm md:text-base text-gray-600">Here's your membership dashboard with financial insights and recent activity.</p>
            </>
          )}
        </div>

        {/* Top Row - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Membership Status Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <Link to="/membership-status">
                <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2 hover:text-purple-600 transition-colors cursor-pointer">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  <span className="hidden sm:inline">Membership Status</span>
                  <span className="sm:hidden">Status</span>
                </CardTitle>
              </Link>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs">Active</Badge>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Category</span>
                <Badge className="bg-green-100 text-green-700 text-xs">Premium Member</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Renewal</span>
                <span className="font-semibold text-gray-900 text-sm">March 15, 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900 text-sm">March 15, 2020</span>
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
                <div className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Edit className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">Profile details updated</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">Payment of UGX 150,000 processed</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-400 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">Membership certificate downloaded</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-400 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">New document "Business License" uploaded</p>
                    <p className="text-xs text-gray-500">5 days ago</p>
                  </div>
                </div>
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
                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-medium text-gray-900 truncate">National ID</p>
                      <p className="text-xs text-gray-500">Uploaded: 2023-01-10</p>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer flex-shrink-0" />
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Home className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-medium text-gray-900 truncate">Proof of Address</p>
                      <p className="text-xs text-gray-500">Uploaded: 2024-03-01</p>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer flex-shrink-0" />
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-medium text-gray-900 truncate">Business License</p>
                      <p className="text-xs text-gray-500">Uploaded: 2023-05-20</p>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer flex-shrink-0" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History Table - Mobile Responsive */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-600">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600">Description</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm">2024-03-15</td>
                    <td className="py-4 px-4 text-sm">Annual Subscription</td>
                    <td className="py-4 px-4 text-sm font-semibold text-purple-600">UGX 150,000</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm">2023-03-15</td>
                    <td className="py-4 px-4 text-sm">Annual Subscription</td>
                    <td className="py-4 px-4 text-sm font-semibold text-purple-600">UGX 150,000</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm">2022-03-15</td>
                    <td className="py-4 px-4 text-sm">Annual Subscription</td>
                    <td className="py-4 px-4 text-sm font-semibold text-purple-600">UGX 150,000</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm">2021-03-15</td>
                    <td className="py-4 px-4 text-sm">Annual Subscription</td>
                    <td className="py-4 px-4 text-sm font-semibold text-purple-600">UGX 150,000</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm">2020-03-15</td>
                    <td className="py-4 px-4 text-sm">Annual Subscription</td>
                    <td className="py-4 px-4 text-sm font-semibold text-purple-600">UGX 150,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {[
                { date: '2024-03-15', description: 'Annual Subscription', amount: 'UGX 150,000' },
                { date: '2023-03-15', description: 'Annual Subscription', amount: 'UGX 150,000' },
                { date: '2022-03-15', description: 'Annual Subscription', amount: 'UGX 150,000' },
                { date: '2021-03-15', description: 'Annual Subscription', amount: 'UGX 150,000' },
                { date: '2020-03-15', description: 'Annual Subscription', amount: 'UGX 150,000' },
              ].map((payment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                      <p className="text-xs text-gray-500">{payment.date}</p>
                    </div>
                    <p className="text-sm font-semibold text-purple-600">{payment.amount}</p>
                  </div>
                </div>
              ))}
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