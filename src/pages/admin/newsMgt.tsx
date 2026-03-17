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
  }, []); 

  const handleSave = async (formData: any, status: 'draft' | 'published' = 'published') => {
    if (!formData.title || !formData.description || !formData.featuredImage) {
      showToast("Required fields missing", "error");
      return;
    }

    setLoading(true);
    try {
      const strapiBlocks = (formData.content || [])
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
          // Image upload only - sending the ID
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
      showToast(status === 'published' ? "Article Published!" : "Draft Saved!", "success");
    } catch (err: any) {
      showToast("Save Failed", "error");
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
    const matchesState = publicationState === 'published' ? !a.isDraft : a.isDraft;
    const matchesFilter = filter === 'All' || a.displayCategory === filter;
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans text-slate-900 relative">
      
     
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/20">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 max-w-sm w-full shadow-[0_20px_70px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <Trash2 className="text-red-500" size={32} />
            </div>
            <h3 className="text-2xl font-black text-center mb-2 tracking-tight">Delete Article?</h3>
            <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">This article will be permanently removed from the system.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="flex-1 py-4 rounded-2xl border border-slate-100 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-2xl border border-slate-50 animate-in slide-in-from-top-full">
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={18}/> : <AlertCircle className="text-red-500" size={18}/>}
          <span className="text-xs font-black uppercase tracking-widest">{notification.msg}</span>
        </div>
      )}

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobileOpen={isMobileOpen} onMobileToggle={() => setIsMobileOpen(!isMobileOpen)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-w-0`}>
        <Header title="News Management" onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
            
            {!isEditing && (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-slate-900">Newsroom</h1>
                  <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.15em] mt-1">Global Content Management</p>
                </div>
                <button 
                  onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#5F1C9F] rounded-2xl text-white hover:bg-[#4a1480] transition-all font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-100 active:scale-95"
                >
                  <Plus size={16} strokeWidth={4} /> Create Article
                </button>
              </div>
            )}

            {isEditing ? (
              <ArticleForm 
                initialData={selectedArticle} 
                onSave={handleSave} 
                onCancel={() => setIsEditing(false)} 
                isLoading={loading} 
              />
            ) : (
              <div className="space-y-6">
              
                <div className="bg-white p-3 md:p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row gap-4">
                  <div className="flex bg-slate-50 p-1.5 rounded-[1.4rem]">
                    <button 
                      onClick={() => setPublicationState('published')} 
                      className={`flex-1 px-6 md:px-10 py-3 rounded-[1.1rem] text-[10px] font-black tracking-[0.2em] uppercase transition-all ${publicationState === 'published' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Live
                    </button>
                    <button 
                      onClick={() => setPublicationState('preview')} 
                      className={`flex-1 px-6 md:px-10 py-3 rounded-[1.1rem] text-[10px] font-black tracking-[0.2em] uppercase transition-all ${publicationState === 'preview' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Drafts
                    </button>
                  </div>
                  
                  <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {['All', 'Policy Update', 'Thought Leadership', 'Announcements'].map((t) => (
                      <button 
                        key={t} 
                        onClick={() => setFilter(t)} 
                        className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${filter === t ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
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
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-100 outline-none text-[10px] font-black tracking-widest uppercase" 
                    />
                  </div>
                </div>

             
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50/30 border-b border-slate-50">
                          <th className="px-8 py-7 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">News Content</th>
                          <th className="hidden md:table-cell px-6 py-7 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Category</th>
                          <th className="hidden sm:table-cell px-6 py-7 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Status</th>
                          <th className="px-8 py-7 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                          <tr key={article.id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-10 md:w-24 md:h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/30 flex-shrink-0 shadow-sm">
                                  {article.featuredImage ? (
                                    <img src={article.featuredImage} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" alt=""/>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200"><ImageIcon size={20}/></div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-slate-900 font-black text-sm md:text-base tracking-tight line-clamp-1 group-hover:text-[#5F1C9F] transition-colors">{article.title}</h4>
                                  <p className="text-[10px] font-black text-slate-300 mt-1 uppercase tracking-[0.15em]">{article.publishDate}</p>
                                </div>
                              </div>
                            </td>
                            <td className="hidden md:table-cell px-6 py-6 text-center">
                               <span className="inline-block text-[9px] font-black text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
                                 {article.displayCategory}
                               </span>
                            </td>
                            <td className="hidden sm:table-cell px-6 py-6 text-center">
                              {article.isFeatured ? (
                                <div className="flex justify-center items-center gap-2 text-amber-500 font-black text-[9px] uppercase tracking-widest">
                                  <Star size={12} className="fill-amber-500" /> Featured
                                </div>
                              ) : (
                                <span className="text-slate-200 font-black text-[9px] uppercase tracking-widest italic">Standard</span>
                              )}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-1 md:gap-3">
                                <button 
                                  onClick={() => { setSelectedArticle(article); setIsEditing(true); }} 
                                  className="p-3 text-slate-300 hover:text-purple-600 hover:bg-white hover:shadow-lg rounded-2xl transition-all"
                                >
                                  <Edit3 size={18} />
                                </button>
                                <button 
                                  onClick={() => setDeleteModal({ isOpen: true, id: article.documentId || article.id })} 
                                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-2xl transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="py-32 text-center">
                              <div className="flex flex-col items-center opacity-10">
                                <Loader2 size={40} className="animate-spin mb-4" />
                                <p className="font-black text-xs uppercase tracking-[0.5em]">No data found</p>
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