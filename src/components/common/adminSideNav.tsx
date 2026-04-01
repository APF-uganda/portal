import { FC, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiBell,
  FiInbox,
  FiUser,
  FiChevronLeft,
  FiMenu,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { MdDashboard, MdInsights, MdNotifications } from "react-icons/md";
import { FaFileAlt, FaMoneyBill, FaComments } from "react-icons/fa";
import { useAdminNotifications } from "../../hooks/useAdminNotifications";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ collapsed, onToggle, isMobileOpen = false, onMobileToggle }) => {
  const location = useLocation();
  const { unreadCount } = useAdminNotifications();
  const [communicationsOpen, setCommunicationsOpen] = useState(false);

  // Check if we're on any communications page to auto-open dropdown
  const isOnCommunicationsPage = location.pathname === '/admin/announcements' || 
                                 location.pathname === '/admin/notifications';

  // Auto-open communications dropdown if on communications page
  useState(() => {
    if (isOnCommunicationsPage) {
      setCommunicationsOpen(true);
    }
  });

  const handleMobileLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (onMobileToggle) {
      onMobileToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-[#F4F2FE] text-[#6A7270] flex flex-col shadow-lg transition-all duration-300 fixed left-0 top-0 h-screen z-50 ${
          collapsed ? "w-20" : "w-64"
        } ${
          // Mobile responsive classes
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo / Hamburger */}
        <div className="flex items-center justify-between h-20 px-4 border-b">
          {!collapsed ? (
            <>
              <img
                src="/favicon.png"
                alt="APF Logo"
                className="h-10 w-auto object-contain"
              />
              {/* Desktop toggle button */}
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              {/* Mobile close button */}
              <button
                onClick={onMobileToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </>
          ) : (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
            >
              <FiMenu className="w-6 h-6 text-purple-700" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2">
          <nav className="space-y-2 mt-4">
            <NavItem icon={<MdDashboard />} label="Dashboard" to="/admin/dashboard" collapsed={collapsed} onMobileClick={handleMobileLinkClick} />
            <NavItem icon={<FiInbox />} label="Manage CMS" to="/admin/cmsPage" collapsed={collapsed} onMobileClick={handleMobileLinkClick} />
            <NavItem icon={<FiUser />} label="Membership Applications" to="/admin/approval" collapsed={collapsed} onMobileClick={handleMobileLinkClick} />
            <NavItem icon={<FaFileAlt />} label="Manage Users" to="/admin/manageusers" collapsed={collapsed} onMobileClick={handleMobileLinkClick} />
            <NavItem icon={<FiUser />} label="Register Members" to="/admin/bulk-register" collapsed={collapsed} onMobileClick={handleMobileLinkClick} />
            <NavItem icon={<FaMoneyBill />} label="Payments & Renewals" to="/admin/payments" collapsed={collapsed} onMobileClick={handleMobileLinkClick} />
            <NavItem icon={<MdInsights />} label="Reports & Analytics" to="/admin/reports" collapsed={collapsed} onMobileClick={handleMobileLinkClick} />
            <NavItem icon={<FaComments />} label="Community Forum" to="/admin/communityForum" collapsed={collapsed} onMobileClick={handleMobileLinkClick} />
            
            {/* Separator */}
            <div className={`my-3 border-t border-gray-200 ${collapsed ? 'hidden' : ''}`}></div>
            
            {/* Communications Dropdown */}
            <div className="mt-2">
              <button
                onClick={() => !collapsed && setCommunicationsOpen(!communicationsOpen)}
                className={`group relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all w-full text-left ${
                  isOnCommunicationsPage 
                    ? "bg-[#4B1D91] text-white font-bold shadow-md" 
                    : "hover:bg-purple-100 hover:text-purple-700 text-[#6A7270]"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <span className="text-[18px]">
                  <FiBell />
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1">Communications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">
                        {unreadCount}
                      </span>
                    )}
                    <span className="text-[14px]">
                      {communicationsOpen ? <FiChevronDown /> : <FiChevronRight />}
                    </span>
                  </>
                )}
                {collapsed && (
                  <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Communications {unreadCount > 0 && `(${unreadCount})`}
                  </span>
                )}
              </button>

              {/* Dropdown Items */}
              {!collapsed && communicationsOpen && (
                <div className="ml-4 mt-1 space-y-1 transition-all duration-200 ease-in-out">
                  <NavItem 
                    icon={<FiBell />} 
                    label="Announcements" 
                    to="/admin/announcements" 
                    collapsed={false}
                    isSubItem={true}
                    onMobileClick={handleMobileLinkClick}
                  />
                  <NavItem 
                    icon={<MdNotifications />} 
                    label="Admin Notifications" 
                    to="/admin/notifications" 
                    collapsed={false}
                    isSubItem={true}
                    badgeCount={unreadCount > 0 ? unreadCount : undefined}
                    onMobileClick={handleMobileLinkClick}
                  />
                </div>
              )}
            </div>
            
            <NavItem icon={<FiUser />} label="Inquiries" to="/admin/inquiries" collapsed={collapsed} onMobileClick={handleMobileLinkClick} />
          </nav>
        </div>
      </aside>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  badgeCount?: number;
  collapsed?: boolean;
  isSubItem?: boolean;
  onMobileClick?: () => void;
}

const NavItem: FC<NavItemProps> = ({ icon, label, to, badgeCount, collapsed, isSubItem = false, onMobileClick }) => (
  <NavLink
    to={to}
    onClick={onMobileClick}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
        isActive
          ? "bg-[#4B1D91] text-white font-bold shadow-md"
          : "text-[#6A7270] hover:bg-purple-100 hover:text-purple-700"
      } ${collapsed ? "justify-center" : ""} ${isSubItem ? "pl-6 text-xs py-1.5" : ""}`
    }
    title={collapsed ? label : ""}
  >
    <span className={`${isSubItem ? "text-[14px]" : "text-[18px]"}`}>{icon}</span>
    {!collapsed && <span className="flex-1">{label}</span>}
    {badgeCount !== undefined && !collapsed && (
      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {badgeCount}
      </span>
    )}
    {collapsed && (
      <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
        {badgeCount !== undefined && ` (${badgeCount})`}
      </span>
    )}
  </NavLink>
);

export default Sidebar;