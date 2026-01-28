import React from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"

const PaymentsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments & Renewals</h1>
          <p className="text-gray-600">Manage your payments, subscriptions, and renewals.</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-600">Payments & Renewals page content coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PaymentsPage