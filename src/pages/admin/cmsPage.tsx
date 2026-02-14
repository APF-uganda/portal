import { useState } from "react";
import { useNavigate } from "react-router-dom";


import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";


import { 
  Plus, Newspaper, Calendar, Megaphone, 
  CalendarDays, Layout, Info, Phone, Settings,
  ChevronRight, ArrowUpRight
} from 'lucide-react';


import { ManagementColumn } from '../../components/cms-components/mgtColumn';
import { MetricCard } from '../../components/cms-components/metricCard';
import { RecentItem } from '../../components/cms-components/recentitems';
import { AnalyticsCard } from '../../components/cms-components/analyticsCard';


const PageCard = ({ title, icon, desc, onClick }: any) => (
  <button 
    onClick={onClick}
    className="group bg-white p-6 rounded-[32px] border border-slate-100 hover:border-purple-300 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 text-left"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-[#F4F2FE] text-[#5C32A3] rounded-2xl group-hover:bg-[#5C32A3] group-hover:text-white transition-colors">
        {icon}
      </div>
      <ArrowUpRight size={18} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
    </div>
    <h3 className="font-black text-slate-800 text-sm tracking-tight">{title}</h3>
    <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-tighter leading-tight">{desc}</p>
  </button>
);

const CmsContentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        <Header title="CMS Management" />

        <div className="flex-1 bg-[#F4F2FE] p-8">
          <div className="max-w-[1400px] mx-auto space-y-10">
            
           
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-[28px] font-black text-slate-800 tracking-tight text-[#5C32A3]">Portal Control Center</h1>
                <p className="text-slate-500 mt-1 font-medium">Manage your public website data and platform broadcasts.</p>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="bg-[#5C32A3] hover:bg-[#4a2885] text-white px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-black shadow-xl shadow-purple-200 transition-all"
                >
                  <Plus size={18} /> Create Content
                </button>

                
                {showCreateMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => navigate('/admin/NewsMgt')}
                      className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 rounded-xl transition-colors text-left"
                    >
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Newspaper size={16}/></div>
                      <div>
                        <p className="text-xs font-black text-slate-800">News Article</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Blog & Updates</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => navigate('/admin/eventMgt')}
                      className="w-full flex items-center gap-3 p-3 hover:bg-amber-50 rounded-xl transition-colors text-left"
                    >
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Calendar size={16}/></div>
                      <div>
                        <p className="text-xs font-black text-slate-800">New Event</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Workshops & Galas</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

           
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-6 rounded-full bg-purple-500"></div>
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Website Page Editor</h2>
                </div>
                <span className="text-[10px] font-black text-purple-600 bg-purple-100 px-3 py-1 rounded-full uppercase">Visual Editor</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <PageCard 
                  title="Home Page" 
                  icon={<Layout size={20}/>} 
                  desc="Hero Section, Features, & Call-to-Actions" 
                  onClick={() => navigate('/admin/edit-page/home')} 
                />
                <PageCard 
                  title="About Us" 
                  icon={<Info size={20}/>} 
                  desc="Mission Statement, Vision, & Team Members" 
                  onClick={() => navigate('/admin/edit-page/about')} 
                />
                <PageCard 
                  title="Contact Page" 
                  icon={<Phone size={20}/>} 
                  desc="Office Location, Map, & Social Media Links" 
                  onClick={() => navigate('/admin/edit-page/contact')} 
                />
                <PageCard 
                  title="Global Config" 
                  icon={<Settings size={20}/>} 
                  desc="Site Logo, SEO Metadata, & Footer Links" 
                  onClick={() => navigate('/admin/settings')} 
                />
              </div>
            </section>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* News Column */}
              <ManagementColumn title="Newsroom" icon={<Newspaper size={20}/>}>
                <MetricCard label="Live Articles" value="128" trend="12% this month" isPositive type="published" />
                <MetricCard label="Pending" value="14" trend="3% this month" isPositive={false} type="draft" />
                <div className="mt-4 space-y-1">
                  <RecentItem title="Q4 Financial Report" subtitle="Published Jan 18" statusColor="bg-emerald-500" />
                  <RecentItem title="Member Benefits" subtitle="Draft • 2 days ago" statusColor="bg-amber-500" />
                </div>
                <button onClick={() => navigate('/admin/news-registry')} className="w-full mt-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  Manage Registry <ChevronRight size={14}/>
                </button>
              </ManagementColumn>

              {/* Events Column */}
              <ManagementColumn title="Events" icon={<Calendar size={20}/>}>
                <MetricCard label="Active Events" value="42" trend="8% this month" isPositive type="published" />
                <MetricCard label="Drafts" value="8" trend="2 new" isPositive type="draft" />
                <div className="mt-4 space-y-1">
                  <RecentItem title="Annual Conference" subtitle="Feb 15 • 500 cap" statusColor="bg-emerald-500" />
                  <RecentItem title="Workshop" subtitle="Draft • March" statusColor="bg-amber-500" />
                </div>
                <button onClick={() => navigate('/admin/event-registry')} className="w-full mt-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  Manage Registry <ChevronRight size={14}/>
                </button>
              </ManagementColumn>

              {/* Announcements Column */}
              <ManagementColumn title="Broadcasts" icon={<Megaphone size={20}/>}>
                <MetricCard label="Live Alerts" value="86" trend="15%" isPositive type="published" />
                <MetricCard label="Scheduled" value="12" trend="2 new" isPositive={false} type="draft" />
                <div className="mt-4 space-y-1">
                  <RecentItem title="System Maintenance" subtitle="High Priority" statusColor="bg-emerald-500" />
                  <RecentItem title="Tier Launch" subtitle="Pending Review" statusColor="bg-blue-500" />
                </div>
                <button onClick={() => navigate('/admin/broadcast-registry')} className="w-full mt-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  Manage Registry <ChevronRight size={14}/>
                </button>
              </ManagementColumn>
            </div>

          
            <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Content Performance</h2>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight">Engagement metrics across all content types</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl text-xs font-black text-slate-500 hover:bg-slate-100 transition-all shadow-sm">
                  <CalendarDays size={18} className="text-purple-500" /> Last 30 Days
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                <AnalyticsCard label="Page Views" value="24,583" trend="18.5%" isPositive />
                <AnalyticsCard label="Engagements" value="3,452" trend="12.2%" isPositive />
                <AnalyticsCard label="Avg Duration" value="4.2m" trend="1.3%" isPositive={false} />
                <AnalyticsCard label="Content Growth" value="28%" trend="22%" isPositive />
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