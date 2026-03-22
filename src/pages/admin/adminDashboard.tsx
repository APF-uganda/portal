import { Users, FileText, TrendingUp, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

import Sidebar from "../../components/common/adminSideNav";
import StatsGrid from "../../components/adminOverview-components/statGrid";
import { Stat } from "../../types/dashboard";
import RecentApplications from "../../components/adminOverview-components/recentApplications";
import RecentPayments from "../../components/adminOverview-components/recentPayments";
import QuickActions from "../../components/adminOverview-components/quickActions";
import Header from "../../components/layout/Header";
import WelcomeBanner from "../../components/adminOverview-components/banner";
import Footer from "../../components/layout/Footer";
import { fetchDashboardStats, DashboardStats } from "../../services/dashboard";
import { requireAdmin } from "../../utils/auth";
import { useProfile } from "../../hooks/useProfile";
import { getDisplayName } from "../../utils/displayName";

function AdminDashboard(){
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(30); // seconds
    
    // Get profile data for welcome banner
    const { profile } = useProfile();
    
    // Check authentication on component mount
    useEffect(() => {
      if (!requireAdmin()) {
        return; // Will redirect to login
      }
    }, []);
   
   const loadDashboardStats = async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const stats = await fetchDashboardStats();
        setDashboardStats(stats);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

   useEffect(() => {
      loadDashboardStats();
      
      // Auto-refresh based on interval setting
      if (autoRefreshEnabled) {
        const intervalId = setInterval(() => {
          loadDashboardStats(true);
        }, refreshInterval * 1000);

        return () => clearInterval(intervalId);
      }
   }, [autoRefreshEnabled, refreshInterval]);

  const displayName = getDisplayName(profile, "Admin");


  // Format last updated time
  const formatLastUpdated = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Create stats array from dashboard data
  const stats: Stat[] = dashboardStats ? [
    { 
      title: "Total Members", 
      value: dashboardStats.totalMembers.value.toString(), 
      trend: dashboardStats.totalMembers.trend,
      percentage: `${dashboardStats.totalMembers.trend === 'up' ? '+' : '-'}${dashboardStats.totalMembers.change}%`,
      period: "from last month", 
      icon: Users, 
      color: "purple" 
    },
    { 
      title: "Total Applications", 
      value: dashboardStats.totalApplications.value.toString(), 
      trend: dashboardStats.totalApplications.trend, 
      percentage: `${dashboardStats.totalApplications.trend === 'up' ? '+' : '-'}${dashboardStats.totalApplications.change}%`,
      period: "from last month",
      icon: FileText,
      color: "orange" 
    },
    { 
      title: "Total Revenue", 
      value: dashboardStats.revenue.value, 
      trend: dashboardStats.revenue.trend,
      percentage: `${dashboardStats.revenue.trend === 'up' ? '+' : '-'}${dashboardStats.revenue.change}%`, 
      period: "from last month", 
      icon: TrendingUp,  
      color: "green" 
    },
  ] : [];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      {/* Content wrapper with margin to avoid overlap */}
      <div className={`flex flex-col transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} h-screen overflow-hidden`}>
        {/* Top Bar - Fixed */}
        <Header 
          title="Dashboard Overview" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Welcome Banner with Refresh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
            <WelcomeBanner name={displayName} />
            <div className="flex items-center gap-2 md:gap-3">
              {/* Auto-refresh toggle */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefreshEnabled}
                    onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs md:text-sm text-gray-700 hidden md:inline">Auto-refresh</span>
                  <span className="text-xs text-gray-700 md:hidden">Auto</span>
                </label>
              </div>
              
              {/* Refresh interval selector */}
              {autoRefreshEnabled && (
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="text-xs md:text-sm px-2 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={15}>15s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={120}>2m</option>
                  <option value={300}>5m</option>
                </select>
              )}
              
              <span className="text-xs md:text-sm text-gray-500">
                {autoRefreshEnabled ? `Updated: ${formatLastUpdated()}` : 'Auto-refresh off'}
              </span>
              <button
                onClick={() => loadDashboardStats(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh dashboard data"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-xs md:text-sm font-medium hidden sm:inline">
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>
            </div>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4 md:mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="h-6 md:h-8 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <StatsGrid stats={stats} />
          )}

          <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Recent Applications */}
            <RecentApplications />

            {/* Recent Payments */}
            <RecentPayments />
          </div>

          {/* Quick Actions */}
          <div className="mt-4 md:mt-6 animate-slide-up rounded-xl border border-border bg-card p-4">
            <QuickActions />
          </div>
        </main>
        
        {/* Sticky Footer */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
