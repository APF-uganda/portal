import { useState, useEffect } from 'react';
import { 
  Edit3, Search, Star, Plus, ArrowLeft, Trash2, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, X, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/cmsApi';
import { CMS_BASE_URL } from '../../config/api'; 

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { ArticleForm } from '../../components/createcms-components/article';

const NewsManagement = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | undefined>();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  
 
  const [publicationState, setPublicationState] = useState<'live' | 'preview'>('live');
  
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const navigate = useNavigate();

  const showToast = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000); 
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
    
      const res = await api.get(`/news-articles?publicationState=${publicationState}&populate=*&sort=createdAt:desc`);
      const formatted = res.data.data.map((item: any) => {
        const data = item.attributes || item;
        const imageObj = data.featuredImage?.data?.attributes || data.featuredImage;
        const categoryData = data.news?.data?.attributes || data.news;
        
        return {
          id: item.id,
          documentId: item.documentId || item.id,
          ...data,
          displayCategory: categoryData?.name || 'General',
          featuredImage: imageObj?.url ? `${CMS_BASE_URL}${imageObj.url}` : null
        };
      });
      setArticles(formatted);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      showToast("Could not sync with CMS", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [publicationState]);

  const handleSave = async (formData: any, status: 'draft' | 'published' = 'published') => {
    if (!formData.title || !formData.description || !formData.featuredImage) {
      showToast("Required fields are missing", "error");
      return;
    }

    setLoading(true);
    try {
      const strapiBlocks = formData.contentBlocks
        .filter((b: any) => b.value && b.value.trim() !== "" && b.type === 'text')
        .map((block: any) => ({
          type: 'paragraph', 
          children: [{ type: 'text', text: block.value.trim() }] 
        }));
    
      const payload = {
        data: {
          title: formData.title.trim(),
          description: formData.description.trim(), 
          content: strapiBlocks, 
          featuredImage: formData.featuredImage ? [Number(formData.featuredImage)] : [],
          author: formData.author || "APF Admin",
          publishDate: formData.publishDate || new Date().toISOString().split('T')[0],
          readTime: Number(formData.readTime) || 5,
          isFeatured: !!formData.isFeatured,
          publishedAt: status === 'published' ? new Date().toISOString() : null, 
        }
      };
    
      const targetId = selectedArticle?.documentId || selectedArticle?.id;
      if (selectedArticle && targetId) {
        await api.put(`/news-articles/${targetId}`, payload);
      } else {
        await api.post('/news-articles', payload);
      }
      
      setIsEditing(false);
      fetchNews(); 
      showToast(status === 'published' ? "Article Published!" : "Draft Saved!", "success");
    } catch (err: any) {
      showToast("Save Failed. Please check validation.", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/news-articles/${deleteId}`);
      setDeleteId(null);
      fetchNews();
      showToast("Article removed", "success");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesFilter = filter === 'All' || a.displayCategory === filter;
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans relative overflow-hidden">
      
     
      {deleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Article?</h3>
            <p className="text-gray-500 font-medium mb-8">This action is permanent. The article will be removed from the public portal and CMS database.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-4 rounded-2xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl border transition-all animate-in slide-in-from-top-10 ${
          notification.type === 'success' ? 'bg-white border-emerald-50 text-emerald-900' : 'bg-white border-red-50 text-red-900'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
          <span className="text-sm font-bold uppercase tracking-wider">{notification.msg}</span>
        </div>
      )}

      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-w-0 overflow-hidden`}>
        <Header 
          title="News Management" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-hidden">
          <div className="max-w-full mx-auto space-y-10 h-full overflow-y-auto">
            
            {!isEditing && (
              <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-gray-400 hover:text-[#7E49B3] transition-all">
                <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:-translate-x-1 transition-transform">
                  <ArrowLeft size={16} strokeWidth={3} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
              </button>
            )}
            
            {isEditing ? (
              <ArticleForm initialData={selectedArticle} onSave={handleSave} onCancel={() => setIsEditing(false)} isLoading={loading} />
            ) : (
              <div className="space-y-10">
                {/* TOP CONTROL BAR */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm">
                  <div className="flex items-center gap-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Articles</h2>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                      <button 
                        onClick={() => setPublicationState('live')} 
                        className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${publicationState === 'live' ? 'bg-white text-[#7E49B3] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        Live
                      </button>
                      <button 
                        onClick={() => setPublicationState('preview')} 
                        className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${publicationState === 'preview' ? 'bg-white text-amber-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        Drafts
                      </button>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }} className="flex items-center gap-3 px-10 py-4 bg-[#7E49B3] rounded-2xl text-white hover:bg-[#3C096C] transition-all text-sm font-bold shadow-xl shadow-purple-100 active:scale-95 group">
                    <Plus size={18} strokeWidth={3} /> Create News
                  </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-xl shadow-gray-200/40 overflow-hidden">
                  {/* FILTERS & SEARCH */}
                  <div className="p-8 border-b border-gray-50 flex flex-col xl:flex-row justify-between items-center gap-8 bg-white">
                    <div className="flex gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0">
                      {['All', 'Policy Update', 'Thought Leadership', 'Announcements'].map((t) => (
                        <button key={t} onClick={() => setFilter(t)} className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap border ${filter === t ? 'bg-[#7E49B3] text-white border-[#7E49B3] shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-purple-200'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="relative w-full xl:w-[400px]">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        placeholder="SEARCH TITLES..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none text-[10px] font-bold tracking-widest text-gray-900 uppercase transition-all" 
                      />
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="overflow-x-auto">
                    {loading && articles.length === 0 ? (
                      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-[#7E49B3]" size={40} />
                        <span className="text-[10px] font-bold tracking-[0.3em] text-gray-300 uppercase">Synchronizing Data...</span>
                      </div>
                    ) : (
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                            <th className="px-10 py-6 text-left">News Article</th>
                            <th className="px-6 py-6 text-center">Category</th>
                            <th className="px-6 py-6 text-center">Status</th>
                            <th className="px-10 py-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50/30 transition-all group">
                              <td className="px-10 py-8">
                                <div className="flex items-center gap-6">
                                  <div className="w-24 h-14 rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                                    {article.featuredImage ? (
                                      <img src={article.featuredImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt=""/>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-50"><ImageIcon size={20} className="text-gray-200"/></div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-gray-900 font-bold text-base leading-tight group-hover:text-[#7E49B3] transition-colors">{article.title}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{article.publishDate}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-8 text-center">
                                 <span className="text-[10px] font-bold tracking-widest text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 uppercase">
                                   {article.displayCategory}
                                 </span>
                              </td>
                              <td className="px-6 py-8 text-center">
                                {article.isFeatured ? (
                                  <div className="flex justify-center"><Star size={18} className="text-amber-400 fill-amber-400" /></div>
                                ) : (
                                  <span className="text-gray-200 text-[9px] font-bold tracking-widest uppercase">Standard</span>
                                )}
                              </td>
                              <td className="px-10 py-8 text-right">
                                <div className="flex justify-end gap-3">
                                  <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="p-3 text-gray-400 hover:text-[#7E49B3] hover:bg-purple-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                                  <button onClick={() => setDeleteId(article.documentId || article.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={4} className="py-32 text-center text-gray-300 font-bold text-xs uppercase tracking-[0.4em]">Empty Desk • No Articles Found</td></tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default NewsManagement;