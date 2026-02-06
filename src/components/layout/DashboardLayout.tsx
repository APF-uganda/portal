import React, { useState } from "react"
import {
  Bell,
  ChevronDown,
  Menu,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { profile, loading } = useProfile()

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'User'
  const initials = profile?.initials || 'U'

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/*MEMBER SIDEBAR */}
      <MemberSideNav 
        isCollapsed={isCollapsed} 
        onToggle={toggleSidebar}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />

      {/*MAIN CONTENT AREA */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${
        // Desktop: adjust margin based on sidebar state
        // Mobile: no margin adjustment, sidebar is overlay
        'md:' + (isCollapsed ? 'ml-16' : 'ml-64')
      }`}>
        {/* Header - Mobile responsive */}
        <header className="bg-white border-b px-4 md:px-6 h-14 md:h-16 flex items-center shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              {headerContent}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                {loading ? (
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : profile?.profile_picture_url ? (
                  <img
                    src={profile.profile_picture_url}
                    alt={displayName}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-[#60308C] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs md:text-sm font-medium">
                      {initials}
                    </span>
                  </div>
                )}
                {loading ? (
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse hidden sm:block"></div>
                ) : (
                  <span className="font-medium text-sm md:text-base hidden sm:block">{displayName}</span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Mobile responsive padding */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          {children}
        </main>

        {/* Footer - Mobile responsive */}
        <footer className="border-t border-gray-200 p-3 md:p-4 bg-white">
          <div className="text-center text-xs md:text-sm text-gray-500">
            © 2026 APF Uganda. All rights reserved. | 
            <span className="hidden sm:inline"> Privacy Policy | Terms of Service</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
