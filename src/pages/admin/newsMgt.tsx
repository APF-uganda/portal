import { useState, useEffect } from 'react';
import { 
  Edit3, Search, Star, Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import api from '../../services/cmsApi';
import { CMS_BASE_URL } from '../../config/api'; 

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ArticleForm } from '../../components/createcms-components/article';

const NewsManagement = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | undefined>();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [publicationState, setPublicationState] = useState<'published' | 'preview'>('published');
  
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | number | null }>({ isOpen: false, id: null });

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
          isActuallyPublished: !!data.publishedAt 
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
  }, []); 

  const handleSave = async (formData: any, status: 'draft' | 'published' = 'published') => {
    if (!formData.title || !formData.description || !formData.featuredImage) {
      showToast("Required fields missing", "error");
      return;
    }

    setLoading(true);
    try {
      const strapiBlocks = (formData.content || []).map((block: any) => {
        if (block.type === 'paragraph') {
          const textContent = block.children?.[0]?.text || block.value || "";
          if (!textContent.trim()) return null;
          return {
            type: 'paragraph',
            children: [{ type: 'text', text: textContent.trim() }]
          };
        }
        if (block.type === 'image') {
          const imageUrl = block.image?.url || block.url || block.value;
          if (!imageUrl) return null;
          return {
            type: 'paragraph',
            children: [{ type: 'text', text: `__IMAGE__${imageUrl}__IMAGE__` }]
          };
        }
        return null;
      }).filter((block: any) => block !== null);
    
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
          news: formData.news ? Number(formData.news) : undefined
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
      showToast(status === 'published' ? "Article Published!" : "Draft Saved!", "success");
    } catch (err: any) {
      showToast(`Save Failed: ${err.response?.data?.error?.message || err.message}`, "error");
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
      showToast("Article removed", "success");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesState = publicationState === 'published' ? a.isActuallyPublished : !a.isActuallyPublished;
    const matchesFilter = filter === 'All' || a.displayCategory === filter;
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-montserrat text-gray-900 relative">
      
      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/20">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 font-montserrat">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <Trash2 className="text-red-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2 tracking-tight uppercase">Delete Article?</h3>
            <p className="text-gray-600 text-center text-sm mb-8 leading-relaxed font-medium">This article will be permanently deleted.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="flex-1 py-4 rounded-2xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-2xl border border-slate-50 animate-in slide-in-from-top-full font-montserrat">
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={18}/> : <AlertCircle className="text-red-500" size={18}/>}
          <span className="text-[10px] font-bold uppercase tracking-widest">{notification.msg}</span>
        </div>
      )}

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobileOpen={isMobileOpen} onMobileToggle={() => setIsMobileOpen(!isMobileOpen)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-w-0`}>
        <Header title="News Management" onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
            
            {/* NAVIGATION HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <button 
                  onClick={() => navigate('/admin/cmsPage')} 
                  className="flex items-center gap-2 text-slate-400 hover:text-purple-600 font-medium text-sm mb-2 transition-colors"
                >
                  <ArrowLeft size={16} /> Back to Control Center
                </button>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 uppercase">News</h1>
                <p className="text-[#5F1C9F] text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Create and Manage News articles</p>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-[#5F1C9F] rounded-2xl text-white hover:bg-[#4a1480] transition-all font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-purple-200 active:scale-95"
                >
                  <Plus size={18} strokeWidth={3} /> Create Article
                </button>
              )}
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
                {/* Filters and Search Bar */}
                <div className="bg-white p-4 md:p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row gap-6 font-montserrat">
                  <div className="flex bg-slate-100/50 p-1.5 rounded-[1.4rem] min-w-[300px]">
                    <button 
                      onClick={() => setPublicationState('published')} 
                      className={`flex-1 px-8 py-3 rounded-[1.1rem] text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${publicationState === 'published' ? 'bg-white text-[#5F1C9F] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Live Feed
                    </button>
                    <button 
                      onClick={() => setPublicationState('preview')} 
                      className={`flex-1 px-8 py-3 rounded-[1.1rem] text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${publicationState === 'preview' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Drafts
                    </button>
                  </div>
                  
                  <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {['All', 'Policy Update', 'Thought Leadership', 'Announcements'].map((t) => (
                      <button 
                        key={t} 
                        onClick={() => setFilter(t)} 
                        className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${filter === t ? 'bg-gray-900 text-white' : 'bg-slate-50 text-gray-500 hover:bg-slate-100'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full xl:w-80">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      placeholder="SEARCH ARTICLES..." 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)} 
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-100 outline-none text-[10px] font-bold tracking-widest uppercase" 
                    />
                  </div>
                </div>

                {/* News Table */}
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden font-montserrat">
                  <div className="hidden md:block bg-white shadow rounded-lg p-3 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                      <h3 className="text-base md:text-lg font-semibold text-gray-700">All News Articles</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-600 border border-[#F4F2FE] rounded-xl">
                        <thead className="bg-[#F4F2FE] text-gray-700 uppercase text-xs">
                          <tr>
                            <th className="px-3 md:px-4 py-2 border-b min-w-[250px]">News Content</th>
                            <th className="px-3 md:px-4 py-2 border-b min-w-[120px]">Category</th>
                            <th className="px-3 md:px-4 py-2 border-b min-w-[120px]">Status</th>
                            <th className="px-3 md:px-4 py-2 border-b min-w-[100px] text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                            <tr key={article.id} className="border-b last:border-none hover:bg-gray-50 transition-colors">
                              <td className="px-3 md:px-4 py-3">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                    {article.featuredImage ? <img src={article.featuredImage} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300"><ImageIcon size={18}/></div>}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-gray-900 font-bold truncate">{article.title}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase">{article.publishDate}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 md:px-4 py-3 font-medium text-gray-700">{article.displayCategory}</td>
                              <td className="px-3 md:px-4 py-3">
                                {article.isFeatured ? (
                                  <span className="px-2 md:px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-amber-700 flex items-center w-fit gap-1"><Star size={12} className="fill-amber-700" /> Featured</span>
                                ) : (
                                  <span className="px-2 md:px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">Standard</span>
                                )}
                              </td>
                              <td className="px-3 md:px-4 py-3">
                                <div className="flex justify-center gap-2">
                                  <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="bg-transparent border-2 border-gray-200 hover:bg-[#5F2F8B] hover:border-[#5F2F8B] hover:text-white text-gray-700 px-2 py-1 rounded-lg text-xs transition-colors flex items-center gap-1"><Edit3 size={14} /><span>Edit</span></button>
                                  <button onClick={() => setDeleteModal({ isOpen: true, id: article.documentId || article.id })} className="bg-transparent border-2 border-gray-200 hover:bg-red-500 hover:border-red-500 hover:text-white text-gray-700 px-2 py-1 rounded-lg text-xs transition-colors"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={4} className="py-8 text-center text-gray-500">No articles found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden divide-y divide-slate-100">
                    {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                      <div key={article.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                              {article.featuredImage ? <img src={article.featuredImage} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={20}/></div>}
                           </div>
                           <div className="min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 uppercase truncate">{article.title}</h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{article.displayCategory} • {article.publishDate}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="flex-1 py-3 bg-slate-50 rounded-xl text-[9px] font-bold uppercase tracking-widest text-[#5F1C9F]">Edit</button>
                           <button onClick={() => setDeleteModal({ isOpen: true, id: article.documentId || article.id })} className="flex-1 py-3 bg-red-50 rounded-xl text-[9px] font-bold uppercase tracking-widest text-red-500">Delete</button>
                        </div>
                      </div>
                    )) : (
                      <div className="py-20 text-center text-gray-300 font-bold text-[10px] uppercase tracking-widest">No records found</div>
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