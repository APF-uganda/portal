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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | undefined>();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [publicationState, setPublicationState] = useState<'published' | 'preview'>('published');
  
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
    if (!formData.title) {
      showToast("Article Title is missing", "error");
      return;
    }

    if (!formData.description) {
      showToast("Article description is required", "error");
      return;
    }

    if (!formData.featuredImage) {
      showToast("Featured image is required", "error");
      return;
    }

    setLoading(true);
  
    try {
      // First, ensure the news category exists
      let categoryId = null;
      if (formData.news) {
        try {
          // Check if category exists
          await api.get(`/news-categories/${formData.news}`);
          categoryId = formData.news;
        } catch (err) {
          // Category doesn't exist, create it
          console.log("Category doesn't exist, creating default category");
          try {
            const newCategoryRes = await api.post('/news-categories', {
              data: {
                name: 'General News',
                description: 'General news and updates',
                publishedAt: new Date().toISOString()
              }
            });
            categoryId = newCategoryRes.data.data.id;
          } catch (createErr) {
            console.error("Failed to create category:", createErr);
            // Use null if we can't create category
            categoryId = null;
          }
        }
      }

      // Map internal content blocks to Strapi paragraph blocks
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
          
          // featuredImage expects an array of IDs (multiple: true in schema)
          featuredImage: formData.featuredImage ? [Number(formData.featuredImage)] : [],
          
          author: formData.author || "APF Admin",
          publishDate: formData.publishDate || new Date().toISOString().split('T')[0],
          readTime: Number(formData.readTime) || 5,
          isFeatured: !!formData.isFeatured,
          
          // Only include news category if we have a valid ID
          ...(categoryId && { news: categoryId }),
          
          // Only set publishedAt for published articles
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
      showToast(status === 'published' ? "Article Published Successfully!" : "Draft Saved!", "success");
      
    } catch (err: any) {
      console.error("Save Error:", err.response?.data || err);
      const errorData = err.response?.data?.error;
      const details = errorData?.details || {};
      
      // More specific error messages
      if (details.errors) {
        const fieldErrors = details.errors.map((e: any) => `${e.path?.join('.')}: ${e.message}`).join(', ');
        showToast(`Validation Error: ${fieldErrors}`, "error");
      } else {
        showToast(`Save Failed: ${errorData?.message || "Please check all required fields"}`, "error");
      }
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
    <div className="flex min-h-screen bg-[#F4F2FE] relative overflow-hidden">
      {notification && (
        <div className={`fixed top-4 md:top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-5 rounded-xl md:rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 transition-all animate-in fade-in slide-in-from-top-10 duration-500 mx-4 ${
          notification.type === 'success' ? 'bg-white border-emerald-50 text-emerald-900' : 'bg-white border-red-50 text-red-900'
        }`}>
          <div className={`p-1.5 md:p-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500 w-4.5 h-4.5 md:w-6 md:h-6"/> : <AlertCircle className="text-red-500 w-4.5 h-4.5 md:w-6 md:h-6"/>}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs md:text-sm opacity-40 leading-none mb-1">Status</span>
            <span className="text-xs truncate">{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="ml-2 md:ml-4 p-1.5 md:p-2 hover:bg-slate-50 rounded-lg md:rounded-xl transition-colors flex-shrink-0">
            <X size={14} className="md:w-4 md:h-4 text-slate-300" />
          </button>
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

        <div className="flex-1 p-3 md:p-6 lg:p-10 overflow-hidden">
          <div className="max-w-full mx-auto space-y-6 md:space-y-8 h-full overflow-y-auto">
            {!isEditing && (
              <button onClick={() => navigate(-1)} className="group flex items-center gap-2 md:gap-3 text-slate-400 hover:text-purple-700 transition-all">
                <div className="p-2 md:p-2.5 rounded-xl md:rounded-2xl bg-white border border-slate-100 group-hover:border-purple-200 shadow-sm transition-all group-hover:-translate-x-1">
                  <ArrowLeft size={14} className="md:w-4 md:h-4" strokeWidth={3} />
                </div>
                <span className="text-xs md:text-sm">Return to Dashboard</span>
              </button>
            )}
            
            {isEditing ? (
              <div className="w-full max-w-none">
                <ArticleForm 
                  initialData={selectedArticle} 
                  onSave={handleSave} 
                  onCancel={() => setIsEditing(false)} 
                  isLoading={loading} 
                />
              </div>
            ) : (
              <div className="w-full max-w-none space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 md:p-5 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 md:gap-6 overflow-x-auto">
                    <h2 className="text-xl md:text-2xl text-slate-900 tracking-tighter border-r-2 border-slate-100 pr-4 md:pr-6 whitespace-nowrap">Articles</h2>
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      <button onClick={() => setPublicationState('published')} className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm tracking-widest transition-all whitespace-nowrap ${publicationState === 'published' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Live</button>
                      <button onClick={() => setPublicationState('preview')} className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm tracking-widest transition-all whitespace-nowrap ${publicationState === 'preview' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Drafts</button>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }} className="flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-[#5F1C9F] rounded-full text-white  hover:bg-purple-700 transition-all text-xs md:text-sm tracking-widest shadow-xl active:scale-95 group whitespace-nowrap">
                    <Plus size={16} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-300" /> Create News
                  </button>
                </div>

                <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                  <div className="p-4 md:p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6 bg-white">
                    <div className="flex bg-white p-1.5 rounded-full border border-slate-100 overflow-x-auto w-full lg:w-auto">
                      {['All', 'Policy Update', 'Thought Leadership', 'Announcements', 'SME Support'].map((t) => (
                        <button key={t} onClick={() => setFilter(t)} className={`px-4 md:px-6 py-2.5 text-xs md:text-sm  rounded-xl transition-all whitespace-nowrap ${filter === t ? 'bg-[#5F1C9F] text-white shadow-lg' : 'text-black hover:text-[#240046]'}`}>{t}</button>
                      ))}
                    </div>
                    <div className="relative w-full lg:w-[300px] xl:w-[350px]">
                      <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input placeholder="SEARCH TITLES..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none text-xs md:text-sm tracking-widest text-slate-900 transition-all" />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {loading && articles.length === 0 ? (
                      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-purple-600" size={40} strokeWidth={3} />
                        <span className="text-sm tracking-[0.3em] text-slate-300">Synchronizing...</span>
                      </div>
                    ) : (
                      <div className="min-w-[800px]">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 text-sm text-slate-400 border-b border-slate-100">
                              <th className="px-4 md:px-8 py-6 text-left">News Article</th>
                              <th className="px-4 md:px-6 py-6 text-center">Category</th>
                              <th className="px-4 md:px-6 py-6 text-center">Featured</th>
                              <th className="px-4 md:px-8 py-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                              <tr key={article.id} className="hover:bg-slate-50/30 transition-all group">
                                <td className="px-4 md:px-8 py-6">
                                  <div className="flex items-center gap-4 md:gap-6">
                                    <div className="w-16 md:w-20 h-10 md:h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
                                      {article.featuredImage ? (
                                        <img src={article.featuredImage} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="" loading="lazy"/>
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-50"><ImageIcon size={20} className="text-slate-200"/></div>
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="text-slate-900 text-sm tracking-tight line-clamp-1 group-hover:text-purple-700 transition-colors">{article.title}</h4>
                                      <p className="text-xs md:text-sm text-slate-400 tracking-widest mt-1">{article.publishDate}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 md:px-6 py-6 text-center">
                                   <span className="text-[8px] md:text-[9px] tracking-[0.1em] text-slate-500 bg-slate-100 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-slate-200">
                                     {article.displayCategory}
                                   </span>
                                </td>
                                <td className="px-4 md:px-6 py-6 text-center">
                                  {article.isFeatured ? (
                                    <div className="flex justify-center"><Star size={16} className="text-amber-400 fill-amber-400" /></div>
                                  ) : (
                                    <span className="text-slate-200 text-[8px] md:text-[9px] tracking-widest">Off</span>
                                  )}
                                </td>
                                <td className="px-4 md:px-8 py-6 text-right">
                                  <div className="flex justify-end gap-2 md:gap-3">
                                    <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="p-2 md:p-3 text-slate-400 hover:text-purple-700 hover:bg-white hover:shadow-md rounded-xl transition-all"><Edit3 size={18} /></button>
                                    <button onClick={() => handleDelete(article.documentId || article.id)} className="p-2 md:p-3 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all"><Trash2 size={18} /></button>
                                  </div>
                                </td>
                              </tr>
                            )) : (
                              <tr><td colSpan={4} className="py-24 text-center text-slate-300 text-sm tracking-[0.4em]">Empty Desk • No Articles Found</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
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