import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  
} from "lucide-react";


import Sidebar from "../../components/common/adminSideNav";
import StatsGrid from "../../components/adminOverview-components/statGrid";
import { Stat } from "../../types/dashboard";
import RecentApplications from "../../components/adminOverview-components/recentApplications";
import RecentPayments from "../../components/adminOverview-components/recentPayments";
import QuickActions from "../../components/adminOverview-components/quickActions";
import Header from "../../components/layout/Header";
// import { useState } from "react";

const stats: Stat[] = [
  { title: "Total Members", value: "2,547", change: "+12.5%", trend: "up", icon: Users },
  { title: "Pending Applications", value: "23", change: "+5", trend: "up", icon: FileText },
  { title: "Revenue (This Month)", value: "UGX 45.2M", change: "+8.3%", trend: "up", icon: CreditCard },
  { title: "Active Subscriptions", value: "2,341", change: "+3.2%", trend: "up", icon: TrendingUp },
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