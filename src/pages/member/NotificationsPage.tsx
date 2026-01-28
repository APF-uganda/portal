import React from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"

const NotificationsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">View your notifications and alerts.</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-600">Notifications page content coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default NotificationsPage