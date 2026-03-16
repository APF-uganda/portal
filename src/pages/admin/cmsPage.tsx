import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { 
  Plus, Newspaper, Calendar, 
  Settings, Users, Eye, 
  Sparkles, Activity, ArrowUpRight
} from 'lucide-react';


const StatHighlight = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${color} transition-transform group-hover:scale-110 duration-300`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      </div>
    </div>
    <ArrowUpRight size={18} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
  </div>
);

const CmsContentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen selection:bg-purple-100 selection:text-[#7E49B3] bg-[#F8FAFC] font-sans">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-h-screen`}>
        <Header 
          title="CMS Control Center" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 p-6 md:p-10 lg:p-12">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/*ACTION HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="flex items-center gap-2 text-[#7E49B3] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  <Sparkles size={14} /> System Overview
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Portal Management</h1>
                <p className="text-gray-400 mt-2 text-sm font-medium">Manage your platform content and monitor recent activity.</p>
              </div>
              
              <div className="relative w-full md:w-auto">
                <button 
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="bg-[#7E49B3] hover:bg-[#3C096C] text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold shadow-xl shadow-purple-200 transition-all active:scale-95 w-full md:w-auto"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} /> 
                  <span>Create New Content</span>
                </button>

                {showCreateMenu && (
                  <div className="absolute right-0 mt-4 w-full md:w-72 bg-white rounded-[2rem] shadow-2xl shadow-purple-200/40 border border-purple-50 p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => navigate('/admin/NewsMgt')} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors text-left group">
                      <div className="p-3 bg-purple-50 text-[#7E49B3] rounded-xl group-hover:bg-[#7E49B3] group-hover:text-white transition-all">
                        <Newspaper size={20}/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">News Article</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Update Public Feed</p>
                      </div>
                    </button>
                    <button onClick={() => navigate('/admin/eventMgt')} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors text-left group mt-1">
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                        <Calendar size={20}/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Event Entry</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Add to Calendar</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/*  DYNAMIC STATS  */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatHighlight 
                title="Active Events" 
                value="12" 
                icon={Calendar} 
                color="bg-amber-50 text-amber-600" 
              />
              <StatHighlight 
                title="News Published" 
                value="48" 
                icon={Newspaper} 
                color="bg-purple-50 text-[#7E49B3]" 
              />
              <StatHighlight 
                title="Site Health" 
                value="99.9%" 
                icon={Activity} 
                color="bg-emerald-50 text-emerald-600" 
              />
            </div>

            {/* CORE MANAGEMENT  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Activity Feed */}
              <div className="bg-white rounded-[2.5rem] border border-gray-50 p-8 shadow-sm">
                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Activity size={14} className="text-[#7E49B3]" /> Recent Updates
                </h2>
                <div className="space-y-6">
                  {[
                    { type: 'Event', title: 'Annual Gala 2024', time: '2 hours ago', icon: Calendar, color: 'text-amber-500' },
                    { type: 'News', title: 'Q1 Policy Update Published', time: '5 hours ago', icon: Newspaper, color: 'text-[#7E49B3]' },
                    { type: 'System', title: 'Images optimized for SEO', time: 'Yesterday', icon: Settings, color: 'text-gray-400' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <activity.icon size={18} className={activity.color} />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-400 font-medium">{activity.type} • {activity.time}</p>
                        </div>
                      </div>
                      <Eye size={16} className="text-gray-300 cursor-pointer hover:text-[#7E49B3]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Settings  */}
              <div className="space-y-6">
                <button 
                  onClick={() => navigate('/admin/settings')}
                  className="w-full group bg-white p-8 rounded-[2.5rem] border border-gray-50 hover:border-purple-200 transition-all shadow-sm flex items-center gap-6"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#7E49B3] group-hover:text-white transition-all duration-500">
                    <Settings size={28} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg">Site Settings</h3>
                    <p className="text-sm text-gray-400 font-medium">SEO, Branding & Navigation</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('admincms/leadership')}
                  className="w-full group bg-white p-8 rounded-[2.5rem] border border-gray-50 hover:border-purple-200 transition-all shadow-sm flex items-center gap-6"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#7E49B3] group-hover:text-white transition-all duration-500">
                    <Users size={28} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg">Stakeholders</h3>
                    <p className="text-sm text-gray-400 font-medium">Board & Leadership Profiles</p>
                  </div>
                </button>
              </div>

            </div>

          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default CmsContentPage;