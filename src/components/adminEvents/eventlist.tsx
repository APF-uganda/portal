import { useState, useEffect, useCallback } from 'react';
import { 
  Edit3, Search, Plus, Trash2, Image as ImageIcon, CheckCircle2, 
  AlertCircle, ArrowLeft, Calendar, MapPin, Users, ExternalLink, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import api from '../../services/cmsApi';
import { CMS_BASE_URL } from '../../config/api'; 

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const EventsList = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [publicationState, setPublicationState] = useState<'published' | 'preview'>('published');
  
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | number | null }>({ isOpen: false, id: null });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000); 
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
     
      const res = await api.get(`/events?publicationState=preview&populate=*&sort=date:desc&_t=${Date.now()}`);
      const formatted = res.data.data.map((item: any) => {
        const data = item.attributes || item;
        const imageObj = data.image?.data?.attributes || data.image;
        
        return {
          id: item.id,
          documentId: item.documentId || item.id,
          ...data,
          featuredImage: imageObj?.url ? `${CMS_BASE_URL}${imageObj.url}` : null,
          isActuallyPublished: !!data.publishedAt 
        };
      });
      setEvents(formatted);
    } catch (err) {
      console.error("Fetch failed:", err);
      showToast("Could not sync with CMS", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

    
    window.addEventListener('focus', fetchEvents);
    return () => window.removeEventListener('focus', fetchEvents);
  }, [fetchEvents]); 

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      
      await api.delete(`/events/${deleteModal.id}`);
      setDeleteModal({ isOpen: false, id: null });
      
      // Refresh list 
      await fetchEvents();
      showToast("Event removed successfully", "success");
    } catch (err: any) {
      console.error("Delete failed:", err);
      const errorMsg = err.response?.data?.error?.message || "Delete failed";
      showToast(errorMsg, "error");
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesState = publicationState === 'published' ? e.isActuallyPublished : !e.isActuallyPublished;
    const matchesSearch = (e.title || "").toLowerCase().includes(search.toLowerCase()) || 
                         (e.location || "").toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-montserrat text-gray-900 relative overflow-x-hidden">
      
      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <Trash2 className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight uppercase">Delete Event?</h3>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">This removes the public post. Registration records remain safe.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] md:w-auto flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-2xl border border-slate-50 animate-in slide-in-from-top-full">
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={18}/> : <AlertCircle className="text-red-500" size={18}/>}
          <span className="text-[10px] font-bold uppercase tracking-widest">{notification.msg}</span>
        </div>
      )}

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobileOpen={isMobileOpen} onMobileToggle={() => setIsMobileOpen(!isMobileOpen)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-w-0`}>
        <Header title="Events Management" onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-6">
              <div className="w-full md:w-auto">
                <button onClick={() => navigate('/admin/cmsPage')} className="flex items-center gap-2 text-slate-400 hover:text-purple-600 font-medium text-xs mb-2 transition-colors">
                  <ArrowLeft size={14} /> Back to Manage CMS
                </button>
                <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-gray-900 uppercase">Events</h1>
                
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
                  <p className="text-[#5F1C9F] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Manage Content</p>
                  <span className="hidden md:inline text-slate-300">|</span>
                  <button 
                    onClick={() => navigate('/admineventMgt')} 
                    className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] transition-colors group"
                  >
                    <Users size={12} className="group-hover:scale-110 transition-transform"/> 
                    Attendees 
                    <ExternalLink size={10} />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => navigate('/eventMgt')}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-[#5F1C9F] rounded-xl md:rounded-2xl text-white hover:bg-[#4a1480] transition-all font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-lg active:scale-95"
              >
                <Plus size={18} strokeWidth={3} /> Create Event
              </button>
            </div>

            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Search & Tabs */}
              <div className="bg-white p-3 md:p-5 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row gap-4 md:gap-6">
                <div className="flex bg-slate-100/50 p-1 rounded-xl md:rounded-[1.4rem] w-full xl:min-w-[320px]">
                  <button onClick={() => setPublicationState('published')} className={`flex-1 px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-[1.1rem] text-[9px] md:text-[11px] font-bold uppercase transition-all ${publicationState === 'published' ? 'bg-white text-[#5F1C9F] shadow-sm' : 'text-slate-400'}`}>Live</button>
                  <button onClick={() => setPublicationState('preview')} className={`flex-1 px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-[1.1rem] text-[9px] md:text-[11px] font-bold uppercase transition-all ${publicationState === 'preview' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>Drafts</button>
                </div>
                
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    placeholder="SEARCH EVENTS..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl text-[10px] font-bold uppercase outline-none focus:ring-2 focus:ring-purple-500/10 transition-all" 
                  />
                </div>
              </div>

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100">
                  <Loader2 className="animate-spin text-purple-600 mb-4" size={32} />
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Syncing with CMS...</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-600">
                      <thead className="bg-[#F4F2FE] text-gray-700 uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Event Details</th>
                          <th className="px-6 py-4">Venue</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0">
                                  {event.featuredImage ? <img src={event.featuredImage} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={14} className="text-slate-300"/></div>}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-gray-900 font-bold truncate text-sm uppercase">{event.title}</h4>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                    <Calendar size={12} className="text-purple-400"/> {new Date(event.date).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-slate-600 font-semibold text-xs uppercase">
                              <div className="flex items-center gap-1.5"><MapPin size={12} className="text-purple-400"/> {event.location}</div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-center gap-2">
                                <button 
                                  onClick={() => navigate(`/eventMgt`, { state: { editEvent: event } })} 
                                  className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button 
                                  onClick={() => setDeleteModal({ isOpen: true, id: event.documentId || event.id })} 
                                  className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : null}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List */}
                  <div className="md:hidden space-y-4">
                    {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                      <div key={event.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                            {event.featuredImage ? <img src={event.featuredImage} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-slate-200"/></div>}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-gray-900 font-bold text-sm leading-tight mb-1 line-clamp-2 uppercase">{event.title}</h4>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                                <Calendar size={12} className="text-purple-400"/> {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase truncate">
                                <MapPin size={12} className="text-purple-400"/> {event.location}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                          <button 
                            onClick={() => navigate(`/eventMgt`, { state: { editEvent: event } })} 
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest active:bg-slate-100 transition-colors"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, id: event.documentId || event.id })} 
                            className="flex-[0.5] flex items-center justify-center py-3 bg-red-50 text-red-500 rounded-xl active:bg-red-100 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )) : null}
                  </div>

                  {/* Empty State */}
                  {filteredEvents.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-3xl border border-slate-100">
                      <Calendar size={40} className="text-slate-100 mx-auto mb-3" />
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No matching events found</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default EventsList;