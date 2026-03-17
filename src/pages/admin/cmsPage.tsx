import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/cmsApi"; 

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { 
  Plus, Newspaper, Calendar, 
  Settings, Users, Eye, 
  Sparkles, Activity, ArrowUpRight, Loader2
} from 'lucide-react';


const StatHighlight = ({ title, value, icon: Icon, color, loading }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${color} transition-transform group-hover:scale-110 duration-300`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{title}</p>
        {loading ? (
          <Loader2 className="animate-spin text-gray-200" size={20} />
        ) : (
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        )}
      </div>
    </div>
    <ArrowUpRight size={18} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
  </div>
);

const CmsContentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  
 
  const [stats, setStats] = useState({ newsCount: 0, eventCount: 0 });
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        //Fetch News Count and Recent News
        const newsRes = await api.get('/news-articles?pagination[pageSize]=3&sort=createdAt:desc');
        
        //Fetch Events Count
        const eventsRes = await api.get('/events?pagination[pageSize]=1');

        setStats({
          newsCount: newsRes.data.meta.pagination.total,
          eventCount: eventsRes.data.meta.pagination.total
        });

        // Format recent activity from news
        const formattedNews = newsRes.data.data.map((item: any) => ({
          id: item.id,
          title: item.attributes?.title || item.title,
          time: new Date(item.attributes?.createdAt || item.createdAt).toLocaleDateString(),
          type: 'News'
        }));

        setRecentNews(formattedNews);
      } catch (err) {
        console.error("Dashboard sync error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen selection:bg-purple-100 selection:text-[#7E49B3] bg-[#F8FAFC] font-sans">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-h-screen`}>
        <Header title="CMS Control Center" onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        <div className="flex-1 p-6 md:p-10 lg:p-12">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* ACTION HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="flex items-center gap-2 text-[#7E49B3] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  <Sparkles size={14} /> System Overview
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Portal Management</h1>
              </div>
              
              <div className="relative w-full md:w-auto">
                <button 
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="bg-[#7E49B3] hover:bg-[#3C096C] text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-200 transition-all active:scale-95 w-full md:w-auto"
                >
                  <Plus className="w-5 h-5" strokeWidth={3} /> Create Content
                </button>

                {showCreateMenu && (
                  <div className="absolute right-0 mt-4 w-full md:w-72 bg-white rounded-[2rem] shadow-2xl shadow-purple-200/40 border border-purple-50 p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => navigate('/admin/NewsMgt')} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors text-left group">
                      <div className="p-3 bg-purple-50 text-[#7E49B3] rounded-xl group-hover:bg-[#7E49B3] group-hover:text-white transition-all">
                        <Newspaper size={20}/>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900">News Article</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Update Public Feed</p>
                      </div>
                    </button>
                    
                  </div>
                )}
              </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatHighlight 
                title="Active Events" 
                value={stats.eventCount} 
                icon={Calendar} 
                color="bg-amber-50 text-amber-600" 
                loading={loading}
              />
              <StatHighlight 
                title="News Published" 
                value={stats.newsCount} 
                icon={Newspaper} 
                color="bg-purple-50 text-[#7E49B3]" 
                loading={loading}
              />
              
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LIVE Activity Feed */}
              <div className="bg-white rounded-[2.5rem] border border-gray-50 p-8 shadow-sm">
                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Activity size={14} className="text-[#7E49B3]" /> Recent Content Updates
                </h2>
                <div className="space-y-6">
                  {recentNews.length > 0 ? recentNews.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0 group">
                      <div className="flex items-center gap-4">
                        <Newspaper size={18} className="text-[#7E49B3]" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate group-hover:text-[#7E49B3] transition-colors cursor-pointer">{activity.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{activity.type} • {activity.time}</p>
                        </div>
                      </div>
                      <Eye size={16} className="text-gray-200 cursor-pointer hover:text-[#7E49B3] transition-colors" />
                    </div>
                  )) : (
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest text-center py-4">No recent activity</p>
                  )}
                </div>
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