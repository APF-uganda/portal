import React, { useState } from "react"
import {
  Bell,
  ChevronDown,
} from "lucide-react"

import MemberSideNav from "../common/memberSideNav"
import { useProfile } from "../../hooks/useProfile"

interface DashboardLayoutProps {
  children: React.ReactNode
  headerContent?: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  headerContent,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const { profile, loading, initials, displayName, profilePictureUrl } = useProfile()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/*MEMBER SIDEBAR */}
      <MemberSideNav isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      {/*MAIN CONTENT AREA */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header - Smaller height */}
        <header className="bg-white border-b px-6 h-16 flex items-center shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {headerContent}
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#60308C]">
                  {loading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  ) : profilePictureUrl && !avatarError ? (
                    <img
                      src={profilePictureUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {initials || 'U'}
                    </span>
                  )}
                </div>
                <span className="font-medium">
                  {loading ? 'Loading...' : displayName}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 p-4 bg-white">
          <div className="text-center text-sm text-gray-500">
            © 2026 APF Uganda. All rights reserved. | Privacy Policy | Terms of Service
          </div>
        </footer>
      </div>
    </div>
  )
}
