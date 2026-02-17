import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Layout Components
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

// Icons
import { 
  Plus, Newspaper, Calendar, Megaphone, 
  Layout, Info, Phone, Settings,
  Users, Lightbulb, Eye, Edit3, AlertCircle,
  Award, HelpCircle, Handshake, Clock, RefreshCw,
  ExternalLink, CheckCircle
} from 'lucide-react';

import { ManagementColumn } from '../../components/cms-components/mgtColumn';
import { MetricCard } from '../../components/cms-components/metricCard';
import { RecentItem } from '../../components/cms-components/recentitems';
import { QuickReferenceCard } from '../../components/cms-components/QuickReferenceCard';

// CMS API and Hooks
import { 
  getEvents, 
  getNewsArticles, 
  getLeadership,
  getBenefits,
  getFAQs,
  getPartners,
  getTimelineEvents,
  Event, 
  NewsArticle,
  Leadership,
  Benefit,
  FAQ,
  Partner,
  TimelineEvent
} from '../../services/cmsApi';
import { CMS_BASE_URL } from '../../config/api';

interface PageCardProps {
  title: string;
  icon: React.ReactNode;
  desc: string;
  onClick: () => void;
}

const PageCard = ({ title, icon, desc, onClick }: PageCardProps) => (
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
    
    <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        {icon}
    </div>
  </button>
);

const CmsContentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for all CMS data
  const [events, setEvents] = useState<Event[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  
  const navigate = useNavigate();

  // Fetch CMS data from Strapi
  const fetchCMSData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        eventsData, 
        newsData, 
        leadershipData,
        benefitsData,
        faqsData,
        partnersData,
        timelineData
      ] = await Promise.all([
        getEvents(),
        getNewsArticles(),
        getLeadership(),
        getBenefits(),
        getFAQs(),
        getPartners(),
        getTimelineEvents()
      ]);
      
      setEvents(eventsData);
      setNewsArticles(newsData);
      setLeadership(leadershipData);
      setBenefits(benefitsData);
      setFaqs(faqsData);
      setPartners(partnersData);
      setTimelineEvents(timelineData);
    } catch (err) {
      console.error('Error fetching CMS data:', err);
      setError('Failed to connect to Strapi CMS. Make sure Strapi is running on http://localhost:1337');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCMSData();
  };

  // Calculate metrics
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const activeNews = newsArticles.filter(n => n.publishedAt).length;
  const activeLeaders = leadership.filter(l => l.isActive).length;
  const activeBenefits = benefits.filter(b => b.isActive).length;
  const activeFaqs = faqs.filter(f => f.isActive).length;
  const activePartners = partners.filter(p => p.isActive).length;
  
  const recentNews = newsArticles.slice(0, 3);
  const recentEvents = events.slice(0, 3);
  
  // Open Strapi admin
  const openStrapiAdmin = () => {
    window.open(`${CMS_BASE_URL}/admin`, '_blank');
  };

  return (
    <div className="flex min-h-screen font-sans selection:bg-purple-100 selection:text-[#5C32A3]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50/50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen`}>
        <Header title="CMS Control Center" />

        <div className="flex-1 p-8">
          <div className="max-w-[1200px] mx-auto space-y-12">
            
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 text-sm">CMS Connection Error</h3>
                  <p className="text-red-700 text-xs mt-1">{error}</p>
                  <p className="text-red-600 text-xs mt-2">
                    Run: <code className="bg-red-100 px-2 py-0.5 rounded">cd CMS && yarn develop</code>
                  </p>
                </div>
                <button 
                  onClick={handleRefresh}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Success Connection Alert */}
            {!error && !loading && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-900 text-sm">CMS Connected Successfully</h3>
                  <p className="text-emerald-700 text-xs mt-1">
                    Strapi CMS is running at {CMS_BASE_URL}
                  </p>
                </div>
                <button 
                  onClick={openStrapiAdmin}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  Open Admin <ExternalLink size={12} />
                </button>
              </div>
            )}
          
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portal Management</h1>
                <p className="text-slate-500 mt-1 text-sm">Content management for the APF public website</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /> 
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                
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
                      <button onClick={openStrapiAdmin} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors"><ExternalLink size={18}/></div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 tracking-tight">Strapi Admin</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">Full CMS Access</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
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
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-20 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                  </div>
                ) : (
                  <>
                    <MetricCard 
                      label="Active Articles" 
                      value={activeNews.toString()} 
                      trend={`${newsArticles.length} total`} 
                      isPositive 
                      type="published" 
                    />
                    <div className="mt-4 space-y-2">
                      {recentNews.length > 0 ? (
                        recentNews.map((article) => (
                          <RecentItem 
                            key={article.id}
                            title={article.title} 
                            subtitle={`${article.category} • ${new Date(article.publishDate).toLocaleDateString()}`} 
                            statusColor={article.isFeatured ? "bg-blue-500" : "bg-emerald-500"} 
                          />
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic p-3">No news articles yet. Create one in Strapi.</p>
                      )}
                    </div>
                  </>
                )}
              </ManagementColumn>

              <ManagementColumn title="Events Hub" icon={<Calendar size={18}/>}>
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-20 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                  </div>
                ) : (
                  <>
                    <MetricCard 
                      label="Upcoming Events" 
                      value={upcomingEvents.toString()} 
                      trend={`${events.length} total`} 
                      isPositive 
                      type="published" 
                    />
                    <div className="mt-4 space-y-2">
                      {recentEvents.length > 0 ? (
                        recentEvents.map((event) => (
                          <RecentItem 
                            key={event.id}
                            title={event.title} 
                            subtitle={`${new Date(event.date).toLocaleDateString()} • ${event.location}`} 
                            statusColor={event.isFeatured ? "bg-purple-500" : "bg-amber-500"} 
                          />
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic p-3">No events yet. Create one in Strapi.</p>
                      )}
                    </div>
                  </>
                )}
              </ManagementColumn>

              <ManagementColumn title="CMS Status" icon={<Megaphone size={18}/>}>
                <MetricCard 
                  label="Connection" 
                  value={loading ? "..." : error ? "Error" : "Active"} 
                  trend={loading ? "Checking..." : error ? "Offline" : "Online"} 
                  isPositive={!error} 
                  type="published" 
                />
                <div className="mt-4 space-y-2">
                  <RecentItem 
                    title="Strapi CMS" 
                    subtitle={error ? "Not Connected" : "Connected"} 
                    statusColor={error ? "bg-rose-500" : "bg-emerald-500"} 
                  />
                  <RecentItem 
                    title="API Endpoint" 
                    subtitle="localhost:1337" 
                    statusColor="bg-blue-500" 
                  />
                </div>
              </ManagementColumn>
            </div>

            {/* Additional Content Stats */}
            {!loading && !error && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                    Content Statistics
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-indigo-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Leadership</span>
                    </div>
                    <div className="text-2xl font-black text-slate-800">{activeLeaders}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{leadership.length} total</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={16} className="text-emerald-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Benefits</span>
                    </div>
                    <div className="text-2xl font-black text-slate-800">{activeBenefits}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{benefits.length} total</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle size={16} className="text-amber-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase">FAQs</span>
                    </div>
                    <div className="text-2xl font-black text-slate-800">{activeFaqs}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{faqs.length} total</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Handshake size={16} className="text-purple-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Partners</span>
                    </div>
                    <div className="text-2xl font-black text-slate-800">{activePartners}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{partners.length} total</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-rose-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Timeline</span>
                    </div>
                    <div className="text-2xl font-black text-slate-800">{timelineEvents.length}</div>
                    <div className="text-[10px] text-slate-400 mt-1">events</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Newspaper size={16} className="text-blue-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
                    </div>
                    <div className="text-2xl font-black text-slate-800">
                      {events.length + newsArticles.length + leadership.length + benefits.length + faqs.length + partners.length + timelineEvents.length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">items</div>
                  </div>
                </div>
              </section>
            )}

          </div>
        </div>

        <Footer />
      </main>

      {/* Quick Reference Card */}
      <QuickReferenceCard />
    </div>
  );
};

export default CmsContentPage;