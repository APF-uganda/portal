import React, { useState } from "react"
import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react"

import MemberSideNav from "../common/memberSideNav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EFF0F0' }}>
      {/*MEMBER SIDEBAR */}
      <MemberSideNav isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      {/*MAIN CONTENT AREA */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header - Match logo section height */}
        <header className="bg-gray-100 border-b px-6 h-20 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    JN
                  </span>
                </div>
                <span className="font-medium">Joan N.</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6" style={{ backgroundColor: '#EFF0F0' }}>
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-300 px-6 py-4" style={{ backgroundColor: '#EFF0F0' }}>
          <div className="text-center text-sm text-gray-600">
            © 2024 FinSaas Pro. All rights reserved. | Privacy Policy | Terms of Service
          </div>
        </footer>
      </div>
    </div>
  )
}
