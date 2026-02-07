import { useState } from "react";



import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";


import { Plus, List, Newspaper, Calendar, Megaphone, CalendarDays } from 'lucide-react';
import { ManagementColumn } from '../../components/cms-components/mgtColumn';
import { MetricCard } from '../../components/cms-components/metricCard';
import { RecentItem } from '../../components/cms-components/recentitems';
import { AnalyticsCard } from '../../components/cms-components/analyticsCard';

const CmsContentPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
    
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

     
      <main 
        className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}
      >
        
        <Header title="CMS Management" />

      
        <div className="flex-1 bg-[#F4F2FE] p-8">
          <div className="max-w-[1400px] mx-auto space-y-10">
            
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-[26px] font-bold text-slate-800 tracking-tight text-[#5C32A3]">CMS Management</h1>
                <p className="text-slate-500 mt-1">Manage news, events, announcements, and other content across the portal</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button className="bg-[#4B2C82] hover:bg-[#3a2266] text-white whitespace-nowrap px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-purple-200 transition-all shrink-0">
                  <Plus size={18} /> Create New Content
                </button>
                <button className="bg-white border border-gray-200 text-gray-700 whitespace-nowrap px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-gray-50 transition-all shadow-sm shrink-0">
                  <List size={18} /> Bulk Actions
                </button>
              </div>
            </div>

           
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* News Column */}
              <ManagementColumn title="News Management" icon={<Newspaper size={20}/>}>
                <MetricCard label="Published Articles" value="120" trend="12% this month" isPositive type="published" />
                <MetricCard label="Drafts" value="15" trend="3% this month" isPositive={false} type="draft" />
                <div className="mt-4">
                  <RecentItem title="Q4 Financial Report Released" subtitle="Jan 18, 2026" statusColor="bg-emerald-500" />
                  <RecentItem title="New Member Benefits Announcement" subtitle="Draft • Updated 2 days ago" statusColor="bg-amber-500" />
                </div>
              </ManagementColumn>

              {/* Events Column */}
              <ManagementColumn title="Events Management" icon={<Calendar size={20}/>}>
                <MetricCard label="Published Events" value="45" trend="8% this month" isPositive type="published" />
                <MetricCard label="Drafts" value="5" trend="2 new this week" isPositive type="draft" />
                <div className="mt-4">
                  <RecentItem title="Annual Members Conference 2026" subtitle="Feb 15, 2026 • 500 attendees" statusColor="bg-emerald-500" />
                  <RecentItem title="Financial Planning Workshop" subtitle="Draft • March 2026" statusColor="bg-amber-500" />
                </div>
              </ManagementColumn>

              {/* Announcements Column */}
              <ManagementColumn title="Announcements" icon={<Megaphone size={20}/>}>
                <MetricCard label="Published" value="80" trend="15% this month" isPositive type="published" />
                <MetricCard label="Drafts" value="10" trend="2 published this week" isPositive={false} type="draft" />
                <div className="mt-4">
                  <RecentItem title="System Maintenance Notification" subtitle="Jan 17, 2026 • High Priority" statusColor="bg-emerald-500" />
                  <RecentItem title="New Membership Tier Launch" subtitle="Pending review • Feb 1, 2026" statusColor="bg-blue-500" />
                </div>
              </ManagementColumn>
            </div>

            {/* 3. Analytics Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-800">Content Performance Analytics</h2>
                <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
                  <CalendarDays size={18} /> Last 30 Days
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <AnalyticsCard label="Total Content Views" value="24,583" trend="18.5%" isPositive />
                <AnalyticsCard label="User Engagement" value="3,452" trend="12.2%" isPositive />
                <AnalyticsCard label="Avg. Time on Page" value="4.2m" trend="1.3%" isPositive={false} />
                <AnalyticsCard label="Content Published" value="28" trend="22%" isPositive />
              </div>
            </section>

          </div>
        </div>

        
        <Footer />
      </main>
    </div>
  );
};

export default CmsContentPage;