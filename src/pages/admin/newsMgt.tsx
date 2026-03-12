import { useState, useEffect } from 'react';
import { 
  Edit3, Search, Star, Plus, ArrowLeft, Trash2, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, X 
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
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | undefined>();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [publicationState, setPublicationState] = useState<'published' | 'preview'>('published');
  
  // Custom Notification State
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

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
        const imageObj = data.featuredImage?.data?.[0]?.attributes || data.featuredImage?.[0];
        
        return {
          id: item.id,
          documentId: item.documentId || item.id,
          ...data,
          displayCategory: data.news?.data?.attributes?.name || data.news?.name || 'General',
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
    // 1. Validation Logic
    if (!formData.title) {
      showToast("Article Title is missing", "error");
      return;
    }
    if (!formData.imageId && !formData.imageLink) {
      showToast("Featured Image is required for the News Card", "error");
      return;
    }

    setLoading(true);
  
    // Format content for Strapi Blocks
    const strapiBlocks = formData.contentBlocks
      .filter((b: any) => b.value && b.value.trim() !== "")
      .map((block: any) => ({
        type: 'paragraph', 
        children: [{ type: 'text', text: block.value.trim() }] 
      }));
  
    // 3. Construct Payload 
    const payload = {
      data: {
        title: formData.title.trim(),
        description: formData.summary || "", 
        content: strapiBlocks, 
        // Force Number array for media relation
        featuredImage: formData.imageId ? [Number(formData.imageId)] : [], 
        author: formData.author || "APF Admin",
        publishDate: formData.date || new Date().toISOString().split('T')[0],
        // ReadTime must be a Number
        readTime: Number(formData.readTime) || 5,
        isTopic: !!formData.isTopPick,
        isFeatured: !!formData.isTopPick, 
        // Relation must be ID Number or null
        news: formData.categoryId ? Number(formData.categoryId) : null,
        publishedAt: status === 'published' ? new Date().toISOString() : null, 
      }
    };
  
    try {
      const targetId = selectedArticle?.documentId || selectedArticle?.id;
      
      if (selectedArticle && targetId) {
        await api.put(`/news-articles/${targetId}`, payload);
      } else {
        await api.post('/news-articles', payload);
      }
      
      setIsEditing(false);
      fetchNews(); 
      showToast(status === 'published' ? "🚀 Article Published Successfully!" : "💾 Draft Saved!", "success");
    } catch (err: any) {
      console.error("Save Error:", err.response?.data);
      const errorData = err.response?.data?.error;
      const detailMsg = errorData?.details?.errors?.[0]?.path?.[0] 
        ? `Error in field: ${errorData.details.errors[0].path[0]}` 
        : errorData?.message || "Check connection and try again";
      
      showToast(`Save Failed: ${detailMsg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/news-articles/${id}`);
      fetchNews();
      showToast("Article successfully removed", "success");
    } catch (err) {
      showToast("Could not delete article", "error");
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesFilter = filter === 'All' || a.displayCategory === filter;
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F4F2FE] relative">
      {/* IMPROVED PREMIUM TOAST */}
      {notification && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-8 py-5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 transition-all animate-in fade-in slide-in-from-top-10 duration-500 ${
          notification.type === 'success' ? 'bg-white border-emerald-50 text-emerald-900' : 'bg-white border-red-50 text-red-900'
        }`}>
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={24}/> : <AlertCircle className="text-red-500" size={24}/>}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">Status</span>
            <span className="text-xs font-black uppercase tracking-wider">{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="ml-4 p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <X size={16} className="text-slate-300" />
          </button>
        </div>
      )}

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col`}>
        <Header title="News Management" />

        <div className="flex-1 p-10">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {!isEditing && (
              <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-slate-400 hover:text-purple-700 transition-all">
                <div className="p-2.5 rounded-2xl bg-white border border-slate-100 group-hover:border-purple-200 shadow-sm transition-all group-hover:-translate-x-1">
                  <ArrowLeft size={16} strokeWidth={3} />
                </div>
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">Return to Dashboard</span>
              </button>
            )}
            
            {isEditing ? (
              <ArticleForm 
                initialData={selectedArticle} 
                onSave={handleSave} 
                onCancel={() => setIsEditing(false)} 
                isLoading={loading} 
              />
            ) : (
              <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-6">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter border-r-2 border-slate-100 pr-6">Articles</h2>
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      <button onClick={() => setPublicationState('published')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${publicationState === 'published' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Live</button>
                      <button onClick={() => setPublicationState('preview')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${publicationState === 'preview' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Drafts</button>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }} className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-purple-700 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 group">
                    <Plus size={16} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-300" /> Create News
                  </button>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-50/20">
                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 overflow-x-auto w-full lg:w-auto">
                      {['All', 'Policy Update', 'Thought Leadership', 'Announcements', 'SME Support'].map((t) => (
                        <button key={t} onClick={() => setFilter(t)} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${filter === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{t}</button>
                      ))}
                    </div>
                    <div className="relative w-full lg:w-[350px]">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input placeholder="SEARCH TITLES..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none text-[10px] font-black tracking-widest text-slate-900 transition-all" />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {loading && articles.length === 0 ? (
                      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-purple-600" size={40} strokeWidth={3} />
                        <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300">Synchronizing...</span>
                      </div>
                    ) : (
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                            <th className="px-8 py-6 text-left">News Article</th>
                            <th className="px-6 py-6 text-center">Category</th>
                            <th className="px-6 py-6 text-center">Featured</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                            <tr key={article.id} className="hover:bg-slate-50/30 transition-all group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-6">
                                  <div className="w-20 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
                                    {article.featuredImage ? (
                                      <img src={article.featuredImage} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt=""/>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-slate-50"><ImageIcon size={20} className="text-slate-200"/></div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight line-clamp-1 group-hover:text-purple-700 transition-colors">{article.title}</h4>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{article.publishDate}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-6 text-center">
                                 <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                   {article.displayCategory}
                                 </span>
                              </td>
                              <td className="px-6 py-6 text-center">
                                {article.isTopic || article.isFeatured ? (
                                  <div className="flex justify-center"><Star size={16} className="text-amber-400 fill-amber-400" /></div>
                                ) : (
                                  <span className="text-slate-200 text-[9px] font-black uppercase tracking-widest">Off</span>
                                )}
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-3">
                                  <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="p-3 text-slate-400 hover:text-purple-700 hover:bg-white hover:shadow-md rounded-xl transition-all"><Edit3 size={18} /></button>
                                  <button onClick={() => handleDelete(article.documentId || article.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all"><Trash2 size={18} /></button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={4} className="py-24 text-center text-slate-300 font-black text-[10px] uppercase tracking-[0.4em]">Empty Desk • No Articles Found</td></tr>
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