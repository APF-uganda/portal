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

  
  const { analytics, loading: analyticsLoading } = useAnalytics('30d');

  const handleRefreshReports = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-50">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} h-screen overflow-hidden flex flex-col w-full min-w-0`}>
        <Header 
          title="Reports & Analytics" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 bg-[#F4F2FE] py-4 md:py-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 px-4 md:px-8">
            
            {/* Page Title Header */}
            <div className="mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Reports & Analytics</h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base max-w-2xl">
                Generate, analyze, and download detailed reports with real-time data visualization.
              </p>
            </div>

            {/* Charts Section  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
              <div className="w-full min-w-0 flex flex-col">
                <MembershipGrowthChart className="flex-1" />
              </div>
              <div className="w-full min-w-0">
                <RevenueChart />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-10">
              <div className="w-full min-w-0 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <PaymentStatusChart />
              </div>
            </div>

            {/* Generator Section */}
            <div className="w-full pt-4 border-t border-gray-200/60">
              <CustomGenerator onSuccess={handleRefreshReports} />
            </div>

            {/* Recent Reports List Section */}
            <div className="w-full pb-10">
              <RecentReports refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

export default ReportsAnalytics;