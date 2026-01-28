import { Link, useLocation } from "react-router-dom"
import {
  LayoutGrid,
  ArrowLeft,
  Bookmark,
  CreditCard,
  MessageSquare,
  Diamond,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react"
import logoPurple from "../../assets/logo_purple.png"

/* MEMBER navigation items */
const memberNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Membership Status", href: "/membership-status", icon: ArrowLeft },
  { label: "Documents", href: "/documents", icon: Bookmark },
  { label: "Payment and Renewals", href: "/payments", icon: CreditCard },
  { label: "Community Forum", href: "/forum", icon: MessageSquare },
  { label: "Notifications", href: "/notifications", icon: Diamond },
]

interface MemberSideNavProps {
  isCollapsed: boolean
  onToggle: () => void
}

function MemberSideNav({ isCollapsed, onToggle }: MemberSideNavProps) {
  const location = useLocation()

  return (
    <aside className={`bg-white shadow-sm fixed left-0 top-0 h-screen flex flex-col z-10 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* ================= LOGO & TOGGLE - Match header height ================= */}
      <div className="h-20 border-b flex-shrink-0 flex items-center justify-between px-4">
        {!isCollapsed && (
          <Link to="/dashboard" className="block">
            <img
              src={logoPurple}
              alt="APF Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* ================= NAV LINKS ================= */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {memberNavItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-full transition-colors group relative ${
                isActive
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              } ${isCollapsed ? 'justify-center' : ''}`}
              style={isActive ? { backgroundColor: '#D689FF' } : {}}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ================= LOGOUT BUTTON ================= */}
      <div className="p-4 border-t flex-shrink-0">
        <Link
          to="/login"
          className={`flex items-center space-x-3 px-4 py-3 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors group relative ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Log Out' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Log Out</span>}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Log Out
            </div>
          )}
        </Link>
      </div>
    </aside>
  )
}

export default MemberSideNav