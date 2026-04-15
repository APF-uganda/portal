import { FC, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut, Menu, Bell, ArrowUpRight } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import { getDisplayName } from "../../utils/displayName";
import { getCurrentUser } from "../../utils/auth";
import { useAdminNotifications } from "../../hooks/useAdminNotifications";

type HeaderProps = {
  title: string;
  onMobileMenuToggle?: () => void;
};

const Header: FC <HeaderProps> = ({
title,
onMobileMenuToggle
}) => {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const { unreadCount } = useAdminNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const displayName = getDisplayName(profile, "User");
  const authUser = getCurrentUser();
  const roleValue = profile?.user_role ?? authUser?.role;
  const normalizedRole = String(roleValue ?? "").trim().toLowerCase();
  const isAdminRole = normalizedRole === "1" || normalizedRole === "admin" || normalizedRole === "administrator";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/");
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    if (isAdminRole) {
      navigate("/admin/profile");
    } else {
      navigate("/profile");
    }
  };

  return (
    <header className="flex items-center justify-between bg-[#F4F2FE] px-4 md:px-8 py-3 h-16 md:h-20 w-full shadow-sm flex-shrink-0">
      {/* Left: Mobile Menu + Page Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors md:hidden"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        )}
        
        <h2 className="text-lg md:text-xl font-bold text-gray-700">
          {title}
        </h2>
      </div>

       

      {/* Right: Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Notification Icon - Only show for admin users */}
        {isAdminRole && (
          <button
            onClick={() => navigate("/admin/notifications")}
            className="relative p-2 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        )}
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-white hover:bg-opacity-50 rounded-lg p-2 transition-colors"
          >
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
              <div className="w-8 h-8 rounded-full overflow-hidden">
                {profile?.profile_picture_url ? (
                  <img 
                    src={`${profile.profile_picture_url}?v=${profile.updated_at || new Date().getTime()}`}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                    key={`${profile.profile_picture_url}-${profile.updated_at}`}
                  />
                ) : (
                  <div className="w-full h-full bg-[#5F2F8B] flex items-center justify-center text-white font-bold text-sm">
                    {profile?.initials || 'U'}
                  </div>
                )}
              </div>
            )}
            {/* Hide name and role on mobile, show on desktop */}
            <div className="text-sm text-left hidden md:block">
              {loading ? (
                <>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-700">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isAdminRole ? "Admin" : "Member"}
                  </p>
                </>
              )}
            </div>
            {/* Hide chevron on mobile, show on desktop */}
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu - Mobile Responsive */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* Mobile: Show user info in dropdown */}
              <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                <p className="font-medium text-gray-700 text-sm">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">
                  {isAdminRole ? "Admin" : "Member"}
                </p>
              </div>
              
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile Settings
              </button>

              <button
                onClick={() => { setDropdownOpen(false); window.open('/', '_blank'); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
                Back to Website
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};



export default Header;
