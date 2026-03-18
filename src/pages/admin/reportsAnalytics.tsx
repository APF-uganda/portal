import { useState } from "react";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import CustomGenerator from "../../components/reports-Components/customGenerator";
import RecentReports from "../../components/reports-Components/recentReports";

// Chart components
import MembershipGrowthChart from "../../components/charts/MembershipGrowthChart";
import RevenueChart from "../../components/charts/RevenueChart";
import PaymentStatusChart from "../../components/charts/PaymentStatusChart";

// Analytics hooks
import { useAnalytics } from "../../hooks/useAnalytics";

const ReportsAnalytics = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // We pass '30d' as the default period to the hook
  const { analytics, loading: analyticsLoading } = useAnalytics('30d');

  const handleRefreshReports = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} h-screen overflow-hidden flex flex-col w-full min-w-0`}>
        <Header 
          title="Reports & Analytics" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 bg-[#F4F2FE] py-3 md:py-6 space-y-6 md:space-y-10 overflow-y-auto">
          <div className="w-full space-y-6 md:space-y-10 px-3 md:px-6">
            
            <div>
              <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-slate-800 tracking-tight">Reports & Analytics</h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">Generate, analyze, and download detailed reports with real-time data visualization</p>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <MembershipGrowthChart />
              <RevenueChart />
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8">
              <PaymentStatusChart />
            </div>

            {/* Analytics Overview Cards - Now Below Charts */}
            {!analyticsLoading && analytics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {/* Total Members */}
                <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Members</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">{analytics.membership.total_members}</p>
                    </div>
                    <div className="p-2 md:p-3 bg-blue-100 rounded-full flex-shrink-0 ml-2">
                      <svg className="w-4 md:w-6 h-4 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Revenue</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">
                        UGX {analytics.key_metrics?.total_revenue ? (analytics.key_metrics.total_revenue / 1000000).toFixed(1) + 'M' : '0.0M'}
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
                      <svg className="w-4 md:w-6 h-4 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Pending Payments */}
                <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Pending Payments</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">
                        {analytics.key_metrics?.pending_payments || 0}
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-yellow-100 rounded-full flex-shrink-0 ml-2">
                      <svg className="w-4 md:w-6 h-4 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Revenue Growth */}
                <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Revenue Growth</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">
                        {analytics.key_metrics?.revenue_growth_rate ? 
                          `${analytics.key_metrics.revenue_growth_rate > 0 ? '+' : ''}${analytics.key_metrics.revenue_growth_rate.toFixed(1)}%` : 
                          '0.0%'
                        }
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-purple-100 rounded-full flex-shrink-0 ml-2">
                      <svg className="w-4 md:w-6 h-4 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            
            

            {/* Generator Section */}
            <CustomGenerator onSuccess={handleRefreshReports} />

            {/* Recent Reports List Section */}
            <RecentReports refreshTrigger={refreshTrigger} />
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

export default ReportsAnalytics;
