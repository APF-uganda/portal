import React from "react"
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

const MemberDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Joan N!</h1>
          <p className="text-gray-600">Here's your membership dashboard with financial insights and recent activity.</p>
        </div>

        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Membership Status Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Membership Status
              </CardTitle>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Active</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Category</span>
                <Badge className="bg-green-100 text-green-700">Premium Member</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Renewal</span>
                <span className="font-semibold text-gray-900">March 15, 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900">March 15, 2020</span>
              </div>
              <div className="space-y-2 pt-4">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Renew Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Your Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Profile details updated</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Payment of UGX 150,000 processed</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Membership certificate downloaded</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New document "Business License" uploaded</p>
                    <p className="text-xs text-gray-500">5 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents & Certificates Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Documents & Certificates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">National ID</p>
                      <p className="text-xs text-gray-500">Uploaded: 2023-01-10</p>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Proof of Address</p>
                      <p className="text-xs text-gray-500">Uploaded: 2024-03-01</p>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Business License</p>
                      <p className="text-xs text-gray-500">Uploaded: 2023-05-20</p>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History Table - Full Width */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
          </CardContent>
        </Card>

        {/* Bottom Row - 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spending Overview Chart */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Spending Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56 flex items-end justify-center gap-6 px-4 py-6">
                {/* 2024 Bar */}
                <div className="flex flex-col items-center flex-1 max-w-16">
                  <div className="text-xs font-semibold text-purple-600 mb-2">UGX 150K</div>
                  <div className="w-full h-32 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:opacity-90"></div>
                  <div className="text-xs text-gray-500 mt-2">2024</div>
                </div>
                
                {/* 2023 Bar */}
                <div className="flex flex-col items-center flex-1 max-w-16">
                  <div className="text-xs font-semibold text-purple-600 mb-2">UGX 150K</div>
                  <div className="w-full h-32 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:opacity-90"></div>
                  <div className="text-xs text-gray-500 mt-2">2023</div>
                </div>
                
                {/* 2022 Bar */}
                <div className="flex flex-col items-center flex-1 max-w-16">
                  <div className="text-xs font-semibold text-purple-600 mb-2">UGX 150K</div>
                  <div className="w-full h-32 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:opacity-90"></div>
                  <div className="text-xs text-gray-500 mt-2">2022</div>
                </div>
                
                {/* 2021 Bar */}
                <div className="flex flex-col items-center flex-1 max-w-16">
                  <div className="text-xs font-semibold text-purple-600 mb-2">UGX 150K</div>
                  <div className="w-full h-32 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:opacity-90"></div>
                  <div className="text-xs text-gray-500 mt-2">2021</div>
                </div>
                
                {/* 2020 Bar */}
                <div className="flex flex-col items-center flex-1 max-w-16">
                  <div className="text-xs font-semibold text-purple-600 mb-2">UGX 150K</div>
                  <div className="w-full h-32 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:opacity-90"></div>
                  <div className="text-xs text-gray-500 mt-2">2020</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-purple-600" />
                Recent Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 justify-start">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">Your area:</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 justify-start">
                <FileCheck className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">Document verification:</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 justify-start">
                <Megaphone className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">New means:</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MemberDashboard