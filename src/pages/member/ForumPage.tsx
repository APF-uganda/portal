import React from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"

const ForumPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
          <p className="text-gray-600">Connect with other members and participate in discussions.</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-600">Community Forum page content coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ForumPage