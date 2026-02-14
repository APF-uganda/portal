import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Layout Components
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

// Icons
import { 
  Plus, Newspaper, Calendar, Megaphone, 
  Layout, Info, Phone, Settings,
  Users, Lightbulb, Eye, Edit3
} from 'lucide-react';

import { ManagementColumn } from '../../components/cms-components/mgtColumn';
import { MetricCard } from '../../components/cms-components/metricCard';
import { RecentItem } from '../../components/cms-components/recentitems';

const PageCard = ({ title, icon, desc, onClick }: any) => (
  <button 
    onClick={onClick}
    className="group relative bg-white p-5 rounded-2xl border border-slate-100 hover:border-purple-400 transition-all shadow-sm hover:shadow-md text-left overflow-hidden"
  >
    <div className="flex items-start justify-between relative z-10">
      <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-[#5C32A3] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-purple-600 uppercase">
        <Edit3 size={12} /> Live Edit
      </div>
    </div>
    <div className="mt-4 relative z-10">
      <h3 className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-[#5C32A3] transition-colors">{title}</h3>
      <p className="text-[11px] text-slate-400 font-medium mt-1 leading-tight">{desc}</p>
    </div>
    {/* Subtle background decoration */}
    <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        {icon}
    </div>
  </button>
);

const CmsContentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen font-sans selection:bg-purple-100 selection:text-[#5C32A3]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50/50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen`}>
        <Header title="CMS Control Center" />

        <div className="flex-1 p-8">
          <div className="max-w-[1200px] mx-auto space-y-12">
            
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portal Management</h1>
                <p className="text-slate-500 mt-1 text-sm">Visual editor and content management for the APF platform.</p>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="bg-[#5C32A3] hover:bg-[#4a2885] text-white px-7 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shadow-lg shadow-purple-200/50 transition-all active:scale-95"
                >
                  <Plus size={20} strokeWidth={3} /> Create Content
                </button>

                {showCreateMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => navigate('/admin/NewsMgt')} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Newspaper size={18}/></div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 tracking-tight">News & Insights</p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Articles & Reports</p>
                      </div>
                    </button>
                    <button onClick={() => navigate('/admin/eventMgt')} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors"><Calendar size={18}/></div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 tracking-tight">Event Listing</p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Schedule & Booking</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Page Editor Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                   Website Structure
                </h2>
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#5C32A3] bg-purple-50 px-3 py-1 rounded-full">
                  <Eye size={14} /> View Live Site
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <PageCard 
                  title="Landing Page" 
                  icon={<Layout size={22}/>} 
                  desc="Main entrance, Hero banners, and Value propositions" 
                  onClick={() => navigate('/admin/edit-page/home')} 
                />
                <PageCard 
                  title="Membership" 
                  icon={<Users size={22}/>} 
                  desc="Tiers, benefits, and registration workflow" 
                  onClick={() => navigate('/admin/edit-page/membership')} 
                />
                 <PageCard 
                  title="Insights" 
                  icon={<Lightbulb size={22}/>} 
                  desc="Research, News archives, and Data reports" 
                  onClick={() => navigate('/admin/edit-page/insights')} 
                />
                <PageCard 
                  title="About Us" 
                  icon={<Info size={22}/>} 
                  desc="Our history, mission, and leadership team" 
                  onClick={() => navigate('/admin/edit-page/about')} 
                />
                <PageCard 
                  title="Contact Us" 
                  icon={<Phone size={22}/>} 
                  desc="Location details, Map settings, and Inquiries" 
                  onClick={() => navigate('/admin/edit-page/contact')} 
                />
                <PageCard 
                  title="Site Config" 
                  icon={<Settings size={22}/>} 
                  desc="Global Branding, SEO, and Navigation" 
                  onClick={() => navigate('/admin/settings')} 
                />
              </div>
            </section>

            {/* Core Management Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
              <ManagementColumn title="News & Press" icon={<Newspaper size={18}/>}>
                <MetricCard label="Active" value="128" trend="12%" isPositive type="published" />
                <div className="mt-4 space-y-2">
                  <RecentItem title="Market Analysis 2026" subtitle="Insights • 1h ago" statusColor="bg-blue-500" />
                  <RecentItem title="Policy Update" subtitle="News • 4h ago" statusColor="bg-emerald-500" />
                </div>
              </ManagementColumn>

              <ManagementColumn title="Events Hub" icon={<Calendar size={18}/>}>
                <MetricCard label="Upcoming" value="42" trend="8%" isPositive type="published" />
                <div className="mt-4 space-y-2">
                  <RecentItem title="Global Tech Summit" subtitle="Feb 20 • Online" statusColor="bg-purple-500" />
                  <RecentItem title="Member Mixer" subtitle="March 05 • NYC" statusColor="bg-amber-500" />
                </div>
              </ManagementColumn>

              <ManagementColumn title="Platform Alerts" icon={<Megaphone size={18}/>}>
                <MetricCard label="Active" value="03" trend="System" isPositive type="published" />
                <div className="mt-4 space-y-2">
                  <RecentItem title="Maintenance Notice" subtitle="High Priority" statusColor="bg-rose-500" />
                  <RecentItem title="New Feature: Dark Mode" subtitle="Global Alert" statusColor="bg-blue-500" />
                </div>
              </ManagementColumn>
            </div>

          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default CmsContentPage;