import { useState, useEffect, useCallback } from 'react';
import { 
  Edit3, Search, Star, Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle, ArrowLeft, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import api from '../../services/cmsApi';
import { CMS_BASE_URL } from '../../config/api'; 

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ArticleForm } from '../../components/createcms-components/article';

const NewsManagement = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | undefined>();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [publicationState, setPublicationState] = useState<'published' | 'preview'>('published');
  
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | number | null }>({ isOpen: false, id: null });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000); 
  };

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      // Strapi v5: fetch published and drafts separately then merge
      const [publishedRes, draftRes] = await Promise.all([
        api.get(`/news-articles?status=published&populate=*&sort=createdAt:desc&_t=${Date.now()}`),
        api.get(`/news-articles?status=draft&populate=*&sort=createdAt:desc&_t=${Date.now()}`),
      ]);

      const mapItem = (item: any, isPublished: boolean) => {
        const data = item.attributes || item;
        const imageObj = data.featuredImage?.data?.attributes 
          || data.featuredImage?.attributes
          || (data.featuredImage && typeof data.featuredImage === 'object' && !Array.isArray(data.featuredImage) ? data.featuredImage : null);
        const categoryData = data.news?.data?.attributes || data.news;
        
        let imageUrl = null;
        if (imageObj?.url) {
          imageUrl = imageObj.url.startsWith('http') 
            ? imageObj.url 
            : `${CMS_BASE_URL}${imageObj.url}`;
        } else if (typeof data.featuredImage === 'string' && data.featuredImage.startsWith('http')) {
          imageUrl = data.featuredImage;
        }

        return {
          id: item.id,
          documentId: item.documentId || item.id,
          ...data,
          displayCategory: categoryData?.name || 'General',
          featuredImage: imageUrl,
          imageId: data.featuredImage?.data?.id || data.featuredImage?.id || null,
          isActuallyPublished: isPublished,
        };
      };

      const published = (publishedRes.data.data || []).map((i: any) => mapItem(i, true));
      const drafts = (draftRes.data.data || []).map((i: any) => mapItem(i, false));

      // Merge, deduplicate by documentId (drafts of published articles appear in both)
      const publishedIds = new Set(published.map((a: any) => a.documentId));
      const uniqueDrafts = drafts.filter((a: any) => !publishedIds.has(a.documentId));

      setArticles([...published, ...uniqueDrafts]);
    } catch (err) {
      console.error("Fetch failed:", err);
      showToast("Could not sync with CMS", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]); 

  const handleSave = async (formData: any, status: 'draft' | 'published' = 'published') => {
    if (status === 'published' && (!formData.title || !formData.description || !formData.featuredImage)) {
      showToast("Title, Summary, and Cover Image are required to publish", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        data: {
          title: formData.title?.trim(),
          description: formData.description?.trim(), 
          content: formData.content, 
          featuredImage: formData.featuredImage ? Number(formData.featuredImage) : (selectedArticle?.imageId || null),
          author: formData.author || "APF Admin",
          publishDate: formData.publishDate || new Date().toISOString().split('T')[0],
          readTime: Number(formData.readTime) || 5,
          isFeatured: !!formData.isFeatured,
          news: formData.news ? Number(formData.news) : undefined,
          publishedAt: status === 'published' ? new Date().toISOString() : null,
        }
      };

      const targetId = selectedArticle?.documentId || selectedArticle?.id;
      const statusParam = status === 'published' ? '' : '?status=draft';

      if (selectedArticle && targetId) {
        await api.put(`/news-articles/${targetId}${statusParam}`, payload);
      } else {
        await api.post(`/news-articles${statusParam}`, payload);
      }
      
      setIsEditing(false);
      setSelectedArticle(undefined);
      await fetchNews(); 
      showToast(status === 'published' ? "Article Published!" : "Draft Saved!", "success");
    } catch (err: any) {
      console.error("Save Error:", err.response?.data || err);
      showToast(`Save Failed: ${err.response?.data?.error?.message || err.message}`, "error");
    } finally {
      setIsSaving(false);
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
    const matchesState = publicationState === 'published' 
      ? a.isActuallyPublished === true 
      : a.isActuallyPublished === false;
      
    const matchesFilter = filter === 'All' || a.displayCategory === filter;
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F4F7FE]  text-gray-900 relative">
      
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-md bg-[#4A1480]">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <Trash2 className="text-red-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2 tracking-tight uppercase">Delete Article?</h3>
            <p className="text-gray-600 text-center text-sm mb-8 leading-relaxed font-medium">This article will be permanently removed from the system.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="flex-1 py-4 rounded-2xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-2xl border border-slate-50 animate-in slide-in-from-top-full">
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={18}/> : <AlertCircle className="text-red-500" size={18}/>}
          <span className="text-[10px] font-bold uppercase tracking-widest">{notification.msg}</span>
        </div>
      )}

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobileOpen={isMobileOpen} onMobileToggle={() => setIsMobileOpen(!isMobileOpen)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-w-0`}>
        <Header title="News Management" onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <button 
                  onClick={() => navigate('/admin/cmsPage')} 
                  className="flex items-center gap-2 text-slate-400 hover:text-purple-600 font-medium text-sm mb-2 transition-colors"
                >
                  <ArrowLeft size={16} /> Back to Control Center
                </button>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 uppercase">News</h1>
                <p className="text-[#5F1C9F] text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Manage your public news feed and drafts</p>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-[#5F1C9F] rounded-2xl text-white hover:bg-[#4a1480] transition-all font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95"
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
                isLoading={isSaving} 
              />
            ) : (
              <div className="space-y-6">
                {/* TOP BAR  */}
                <div className="bg-white p-4 md:p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    {/* Published / Drafts toggle */}
                    <div className="flex bg-slate-100/50 p-1.5 rounded-[1.4rem] shrink-0">
                      <button 
                        onClick={() => setPublicationState('published')} 
                        className={`flex-1 px-6 py-3 rounded-[1.1rem] text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap ${publicationState === 'published' ? 'bg-white text-[#5F1C9F] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Published
                      </button>
                      <button 
                        onClick={() => setPublicationState('preview')} 
                        className={`flex-1 px-6 py-3 rounded-[1.1rem] text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap ${publicationState === 'preview' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Drafts
                      </button>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 min-w-0">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        placeholder="Search articles..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-100 outline-none text-[10px] font-bold tracking-widest uppercase" 
                      />
                    </div>
                  </div>

                  {/* Category filters — scrollable row */}
                  <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
                    {['All', 'Policy Update', 'Thought Leadership', 'Announcements', 'SME Support'].map((t) => (
                      <button 
                        key={t} 
                        onClick={() => setFilter(t)} 
                        className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap shrink-0 ${filter === t ? 'bg-[#4A1480] text-white' : 'bg-slate-50 text-gray-500 hover:bg-slate-100'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                   <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                     <Loader2 className="animate-spin text-[#5F1C9F] mb-4" size={32} />
                     <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Updating News Feed...</p>
                   </div>
                ) : (
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                  <div className="hidden md:block p-3 md:p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-600 border border-[#F4F2FE] rounded-xl">
                        <thead className="bg-[#F4F2FE] text-gray-700 uppercase text-xs">
                          <tr>
                            <th className="px-6 py-4 border-b min-w-[300px]">Article Details</th>
                            <th className="px-4 py-4 border-b whitespace-nowrap">Category</th>
                            <th className="px-4 py-4 border-b whitespace-nowrap">Status</th>
                            <th className="px-4 py-4 border-b text-center whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                            <tr key={article.id} className="border-b last:border-none hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-20 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                                    {article.featuredImage ? (
                                      <img src={article.featuredImage} className="w-full h-full object-cover" alt={article.title}/>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
                                        <ImageIcon size={20}/>
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-gray-900 font-bold uppercase text-[11px] tracking-tight line-clamp-1">{article.title}</h4>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{article.publishDate || 'No Date'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 font-bold text-gray-500 text-[10px] uppercase tracking-widest whitespace-nowrap">{article.displayCategory}</td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                {article.isFeatured ? (
                                  <span className="px-3 py-1.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 flex items-center w-fit gap-1 border border-amber-100 uppercase tracking-widest whitespace-nowrap">
                                    <Star size={10} className="fill-amber-600" /> Featured
                                  </span>
                                ) : (
                                  <span className="px-3 py-1.5 rounded-full text-[9px] font-bold bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest whitespace-nowrap">Standard</span>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex justify-center gap-3">
                                  <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="p-2.5 bg-white border border-slate-100 rounded-xl text-purple-600 hover:bg-purple-50 transition-all shadow-sm active:scale-90">
                                    <Edit3 size={16} />
                                  </button>
                                  <button onClick={() => setDeleteModal({ isOpen: true, id: article.documentId || article.id })} className="p-2.5 bg-white border border-slate-100 rounded-xl text-red-500 hover:bg-red-50 transition-all shadow-sm active:scale-90">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={4} className="py-24 text-center text-slate-300 font-bold text-[10px] uppercase tracking-[0.3em]">No articles found in this section</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="md:hidden divide-y divide-slate-50">
                    {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                      <div key={article.id} className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                              {article.featuredImage ? <img src={article.featuredImage} className="w-full h-full object-cover" alt=""/> : <ImageIcon className="m-auto h-full text-slate-200" size={20}/>}
                           </div>
                           <div className="min-w-0">
                              <h4 className="text-[11px] font-bold text-gray-900 uppercase truncate tracking-tight">{article.title}</h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">{article.displayCategory} • {article.publishDate}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="flex-1 py-4 bg-slate-50 rounded-2xl text-[9px] font-bold uppercase tracking-widest text-[#5F1C9F] active:bg-purple-50">Edit Article</button>
                           <button onClick={() => setDeleteModal({ isOpen: true, id: article.documentId || article.id })} className="flex-1 py-4 bg-red-50 rounded-2xl text-[9px] font-bold uppercase tracking-widest text-red-500 active:bg-red-100">Delete</button>
                        </div>
                      </div>
                    )) : (
                      <div className="py-20 text-center text-slate-300 font-bold text-[10px] uppercase tracking-widest">No articles found</div>
                    )}
                  </div>
                </div>
                )}
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