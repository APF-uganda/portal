import {
  Users,
  FileText,
  TrendingUp,
  
} from "lucide-react";


import Sidebar from "../../components/common/adminSideNav";
import StatsGrid from "../../components/adminOverview-components/statGrid";
import { Stat } from "../../types/dashboard";
import RecentApplications from "../../components/adminOverview-components/recentApplications";
import RecentPayments from "../../components/adminOverview-components/recentPayments";
import QuickActions from "../../components/adminOverview-components/quickActions";
import Header from "../../components/layout/Header";
import WelcomeBanner from "../../components/adminOverview-components/banner";

// import { useState } from "react";

const stats: Stat[] = [
  { title: "Total Members", value: "2,547", trend: "up",percentage: "+12.5%",period: "from last month", icon: Users, color: "purple", },
  { title: "Pending Applications", value: "23", trend: "up", percentage: "+5%",period: "from last month",icon: FileText,color: "orange", },
  { title: "Revenue (This Month)", value: "UGX 45.2M", trend: "up",percentage: "+2%", period: "from last month", icon: TrendingUp,  color: "green", },

];

function AdminDashboard(){
    // const [mobileOpen, setMobileOpen] = useState(false);
    return(
    <div className="flex min-h-screen">
       <Sidebar />

    {/* Right side */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <Header
          title="Dashboard"
          
        />

    <main className="flex-1 p-6">

        {/* Welcome Banner */}
       <WelcomeBanner name="Peter" />

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
    </div>
    </div>
    )

}
export default AdminDashboard
