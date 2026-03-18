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
