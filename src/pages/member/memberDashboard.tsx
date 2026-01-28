import React from "react"
import {
  User,
  FileText,
  CreditCard,
  Activity,
  DollarSign,
  Calendar,
  Bell,
  Download,
  Eye,
  TrendingUp,
  Clock,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"

const MemberDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Joan!</h1>
          <p className="text-gray-600">Here's what's happening with your membership today.</p>
        </div>

        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Membership Status */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Membership Status</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                  Active Premium
                </Badge>
                <p className="text-xs text-gray-500">Valid until Dec 31, 2024</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-gray-900">12</div>
                <p className="text-xs text-gray-500">Actions this month</p>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">• Document uploaded</div>
                  <div className="text-xs text-gray-600">• Payment processed</div>
                  <div className="text-xs text-gray-600">• Profile updated</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents & Certificates */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Documents & Certificates</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-gray-900">8</div>
                <p className="text-xs text-gray-500">Total documents</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History Table */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">2024-01-15</td>
                    <td className="py-3 px-4 text-sm">Annual Membership Fee</td>
                    <td className="py-3 px-4 text-sm font-medium">$299.00</td>
                    <td className="py-3 px-4">
                      <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">2023-12-10</td>
                    <td className="py-3 px-4 text-sm">CPD Event Registration</td>
                    <td className="py-3 px-4 text-sm font-medium">$75.00</td>
                    <td className="py-3 px-4">
                      <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">2023-11-22</td>
                    <td className="py-3 px-4 text-sm">Workshop Fee</td>
                    <td className="py-3 px-4 text-sm font-medium">$150.00</td>
                    <td className="py-3 px-4">
                      <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row - 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spending Overview */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Spending Overview</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Year</span>
                  <span className="text-lg font-bold text-gray-900">$524.00</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Membership</span>
                    <span className="font-medium">$299</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Events</span>
                    <span className="font-medium">$225</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Breakdown
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Recent Notes</CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Clock className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="text-gray-600">Membership renewal reminder</p>
                      <p className="text-gray-400">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="text-gray-600">Upcoming CPD event</p>
                      <p className="text-gray-400">1 week ago</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  View All Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MemberDashboard
