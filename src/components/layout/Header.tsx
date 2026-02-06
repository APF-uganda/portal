import { FC, useState, useEffect } from "react";
import { FiBell} from "react-icons/fi";
import {Search } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import { announcementsApi } from "../../services/announcementsApi";

type HeaderProps = {
  title: string;
};

const Header: FC <HeaderProps> = ({
title
}) => {
  const { profile, loading } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const stats = await announcementsApi.getStats();
        // Count draft + scheduled as pending notifications for admins
        setNotificationCount(stats.draft + stats.scheduled);
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    };

    // Only fetch if user is admin (role = '1')
    if (profile?.role === '1') {
      fetchNotificationCount();
      
      // Refresh count every 2 minutes
      const interval = setInterval(fetchNotificationCount, 2 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [profile?.role]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
      // You can add navigation or search logic here
      // For example: navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3 h-20 rounded-md">
      {/* Left: Page Title */}
      <h2 className="text-lg font-semibold text-gray-700 pl-4">
      {title}
      </h2>

       

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Search */} 
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search applications, members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm
                       outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </form>
        {/* Notifications */}
        <button className="relative">
          <FiBell className="text-xl text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full min-w-[18px] text-center">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>
        
        {/* Profile */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {profile?.profile_picture_url ? (
                <img 
                  src={profile.profile_picture_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-[#5F2F8B] flex items-center justify-center text-white font-bold text-sm">
                  {profile?.initials || 'U'}
                </div>
              )}
            </div>
          )}
          <div className="text-sm">
            {loading ? (
              <>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-700">
                  {profile?.full_name || profile?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {profile?.role === '1' ? 'Administrator' : 'Member'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};



export default Header;