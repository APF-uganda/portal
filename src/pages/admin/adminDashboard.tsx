
import { Users, FileText, TrendingUp } from "lucide-react";
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
import { fetchTotalApplications, fetchTotalMembers } from "../../services/dashboard";
import { requireAdmin, getCurrentUser } from "../../utils/auth";



function AdminDashboard(){
    const [collapsed, setCollapsed] = useState(false);
    const [totalApplications, setTotalApplications] = useState<number>(0);
    const [totalmembers, setTotalmembers] = useState<number>(0);
    
    // Check authentication on component mount
    useEffect(() => {
      if (!requireAdmin()) {
        return; // Will redirect to login
      }
    }, []);
   
   useEffect(() => {
      const loadDashboardStats = async () => {
        try {
          const total = await fetchTotalApplications();
          setTotalApplications(total);
        } catch (error) {
          console.error('Failed to load total applications:', error);
        }
      };

      loadDashboardStats();
   }, []);

   useEffect(() => {
      const loadDashboardStats = async () => {
        try {
          const total = await fetchTotalMembers();
          setTotalmembers(total);
        } catch (error) {
          console.error('Failed to load total members:', error);
        }
      };

      loadDashboardStats();
   }, []);

  // Get current user for welcome banner
  const currentUser = getCurrentUser();
  const userName = currentUser?.email?.split('@')[0] || 'Admin';


  const stats: Stat[] = [
  { title: "Total Members", value: totalmembers.toString(), trend: "up",percentage: "+12.5%",period: "from last month", icon: Users, color: "purple", },
  { title: "Total Applications", value: totalApplications.toString(), trend: "up", percentage: "+5%",period: "from last month",icon: FileText,color: "orange", },
  { title: "Revenue (This Month)", value: "UGX 45.2M", trend: "up",percentage: "+2%", period: "from last month", icon: TrendingUp,  color: "green", },

];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Content wrapper with margin to avoid overlap */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} min-h-screen`}>
        {/* Top Bar */}
        <Header title="Dashboard Overview" />

        <main className="flex-1 p-6">
          {/* Welcome Banner */}
          <WelcomeBanner name={userName} />

          {/* Stats */}
          <StatsGrid stats={stats} />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Applications */}
            <RecentApplications />

            {/* Recent Payments */}
            <RecentPayments />
          </div>

          {/* Quick Actions */}
          <div className="mt-6 animate-slide-up rounded-xl border border-border bg-card p-4">
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