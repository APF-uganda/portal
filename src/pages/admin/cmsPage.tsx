import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/cmsApi"; 

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { 
  Newspaper, Calendar, 
  Eye, Activity, ArrowUpRight, Loader2, ChevronRight, ClipboardList
} from 'lucide-react';

const StatHighlight = ({ title, value, icon: Icon, color, loading }: any) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group h-full">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${color} transition-transform group-hover:scale-105 duration-300`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        {loading ? (
          <Loader2 className="animate-spin text-gray-200" size={20} />
        ) : (
          <h4 className="text-2xl text-gray-900 font-semibold">{value}</h4>
        )}
      </div>
    </div>
    <ArrowUpRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
  </div>
);

const CmsContentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const [stats, setStats] = useState({ newsCount: 0, eventCount: 0 });
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const newsRes = await api.get('/news-articles?pagination[pageSize]=4&sort=createdAt:desc');
        const eventsRes = await api.get('/events?pagination[pageSize]=1');

        setStats({
          newsCount: newsRes.data.meta.pagination.total,
          eventCount: eventsRes.data.meta.pagination.total
        });

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
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
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
            
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-normal text-gray-900 tracking-tight">Portal Management</h1>
              <p className="text-gray-500 mt-2">Manage your website content and track activity.</p>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button 
                onClick={() => navigate('/admin/NewsMgt')}
                className="flex items-center justify-between p-8 bg-white border border-gray-100 rounded-3xl hover:border-purple-300 hover:shadow-lg hover:shadow-purple-50 transition-all text-left group h-full"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-purple-50 text-[#7E49B3] rounded-2xl group-hover:bg-[#7E49B3] group-hover:text-white transition-all">
                    <Newspaper size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Create News</h3>
                    <p className="text-xs text-gray-400 mt-1">Publish articles</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#7E49B3] group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => navigate('/admin/eventMgt')}
                className="flex items-center justify-between p-8 bg-white border border-gray-100 rounded-3xl hover:border-amber-300 hover:shadow-lg hover:shadow-amber-50 transition-all text-left group h-full"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Create Event</h3>
                    <p className="text-xs text-gray-400 mt-1">Manage schedules</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => navigate('/admin/event-registrations')}
                className="flex items-center justify-between p-8 bg-white border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all text-left group h-full"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Registrations</h3>
                    <p className="text-xs text-gray-400 mt-1">Verify attendees</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            <hr className="border-gray-100" />

            {/* Stats Grid  */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
             
              <div className="hidden lg:block bg-gray-50/50 rounded-3xl border border-dashed border-gray-200"></div>
            </div>

            {/* Recent Updates */}
            <div className="max-w-2xl">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity size={14} className="text-[#7E49B3]" /> Recent Content Updates
                </h2>
                <div className="space-y-6">
                  {recentNews.length > 0 ? recentNews.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0 group">
                      <div className="flex items-center gap-4">
                        <Newspaper size={18} className="text-[#7E49B3]" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-900 truncate group-hover:text-[#7E49B3] transition-colors cursor-pointer">{activity.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{activity.type} • {activity.time}</p>
                        </div>
                      </div>
                      <Eye size={16} className="text-gray-300 cursor-pointer hover:text-[#7E49B3] transition-colors" />
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
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