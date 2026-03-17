import { useState, useEffect } from 'react';
import { 
  Edit3, Search, Star, Plus, ArrowLeft, Trash2, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, X, Trash 
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
  const [publicationState, setPublicationState] = useState<'published' | 'preview'>('published');
  
  // Custom Modal & Toast State
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | number | null }>({ isOpen: false, id: null });

  const navigate = useNavigate();

  const showToast = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000); 
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
  
      const res = await api.get(`/news-articles?publicationState=preview&populate=*&sort=createdAt:desc`);
      const formatted = res.data.data.map((item: any) => {
        const data = item.attributes || item;
        const imageObj = data.featuredImage?.data?.attributes || data.featuredImage;
        const categoryData = data.news?.data?.attributes || data.news;
        
        return {
          id: item.id,
          documentId: item.documentId || item.id,
          ...data,
          displayCategory: categoryData?.name || 'General',
          featuredImage: imageObj?.url ? `${CMS_BASE_URL}${imageObj.url}` : null,
          isDraft: !data.publishedAt
        };
      });
      setArticles(formatted);
    } catch (err) {
      console.error("Fetch failed:", err);
      showToast("Could not sync with CMS", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []); // Fetch once, filter locally

  const handleSave = async (formData: any, status: 'draft' | 'published' = 'published') => {
    if (!formData.title || !formData.description || !formData.featuredImage) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const strapiBlocks = (formData.contentBlocks || [])
        .filter((b: any) => b.value?.trim() !== "" && b.type === 'text')
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
      await fetchNews(); 
      showToast(status === 'published' ? "Article Published!" : "Draft Saved Successfully!", "success");
    } catch (err: any) {
      showToast("Save Failed. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await api.delete(`/news-articles/${deleteModal.id}`);
      setDeleteModal({ isOpen: false, id: null });
      fetchNews();
      showToast("Article permanently removed", "success");
    } catch (err) {
      showToast("Could not delete article", "error");
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesState = publicationState === 'published' ? !a.isDraft : a.isDraft;
    const matchesFilter = filter === 'All' || a.displayCategory === filter;
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans text-slate-900 relative overflow-hidden">
      
    
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeleteModal({ isOpen: false, id: null })} />
          <div className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Trash className="text-red-500" size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Delete Article?</h3>
            <p className="text-slate-500 text-center text-sm mb-8">This action cannot be undone. The article will be removed from the CMS permanently.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- NOTIFICATION TOAST --- */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-top-full ${
          notification.type === 'success' ? 'bg-white border-emerald-100 text-emerald-900' : 'bg-white border-red-100 text-red-900'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={20}/> : <AlertCircle className="text-red-500" size={20}/>}
          <span className="text-sm font-bold tracking-tight">{notification.msg}</span>
        </div>
      )}

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobileOpen={isMobileOpen} onMobileToggle={() => setIsMobileOpen(!isMobileOpen)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-w-0`}>
        <Header title="News Management" onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Content Hub</h1>
                <p className="text-slate-500 text-sm mt-1">Manage and publish your organization's latest updates.</p>
              </div>
              <button 
                onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#5F1C9F] rounded-2xl text-white hover:bg-[#4a1480] transition-all font-bold text-sm shadow-xl shadow-purple-100 active:scale-95"
              >
                <Plus size={18} strokeWidth={3} /> Create New Article
              </button>
            </div>

            {isEditing ? (
              <ArticleForm 
                initialData={selectedArticle} 
                onSave={handleSave} 
                onCancel={() => setIsEditing(false)} 
                isLoading={loading} 
              />
            ) : (
              <div className="space-y-6">
                {/* Filters Row */}
                <div className="bg-white p-2 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex bg-slate-100/80 p-1.5 rounded-[1.4rem] w-full md:w-auto">
                    <button 
                      onClick={() => setPublicationState('published')} 
                      className={`flex-1 md:px-8 py-2.5 rounded-[1.1rem] text-xs font-black tracking-widest uppercase transition-all ${publicationState === 'published' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Live
                    </button>
                    <button 
                      onClick={() => setPublicationState('preview')} 
                      className={`flex-1 md:px-8 py-2.5 rounded-[1.1rem] text-xs font-black tracking-widest uppercase transition-all ${publicationState === 'preview' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Drafts
                    </button>
                  </div>
                  
                  <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar px-2">
                    {['All', 'Policy Update', 'Thought Leadership', 'Announcements'].map((t) => (
                      <button 
                        key={t} 
                        onClick={() => setFilter(t)} 
                        className={`px-5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${filter === t ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-72 mr-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      placeholder="Search articles..." 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-100 outline-none text-sm font-medium" 
                    />
                  </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-50">
                          <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Article Information</th>
                          <th className="px-6 py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                          <th className="px-6 py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Visibility</th>
                          <th className="px-8 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                          <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-5">
                                <div className="w-20 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/50 flex-shrink-0">
                                  {article.featuredImage ? (
                                    <img src={article.featuredImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt=""/>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50"><ImageIcon size={18} className="text-slate-200"/></div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-slate-900 font-bold text-sm leading-tight line-clamp-1 group-hover:text-purple-700 transition-colors">{article.title}</h4>
                                  <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{article.publishDate}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6 text-center">
                               <span className="inline-block text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50 uppercase tracking-tighter">
                                 {article.displayCategory}
                               </span>
                            </td>
                            <td className="px-6 py-6 text-center">
                              {article.isFeatured ? (
                                <div className="flex justify-center items-center gap-1.5 text-amber-500 font-black text-[10px] uppercase">
                                  <Star size={14} className="fill-amber-500" /> Featured
                                </div>
                              ) : (
                                <span className="text-slate-300 font-bold text-[10px] uppercase">Standard</span>
                              )}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { setSelectedArticle(article); setIsEditing(true); }} 
                                  className="p-2.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                                >
                                  <Edit3 size={18} />
                                </button>
                                <button 
                                  onClick={() => setDeleteModal({ isOpen: true, id: article.documentId || article.id })} 
                                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="py-32 text-center">
                              <div className="flex flex-col items-center opacity-20">
                                <ImageIcon size={48} className="mb-4" />
                                <p className="font-black text-sm uppercase tracking-[0.3em]">No Articles Found</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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