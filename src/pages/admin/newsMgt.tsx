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

  
  const toggleTopPick = async (article: any) => {
    try {
      const targetId = article.documentId || article.id;
      const newStatus = !article.isFeatured;
      await api.put(`/news-articles/${targetId}`, { data: { isFeatured: newStatus } });
      
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, isFeatured: newStatus } : a));
      showToast(newStatus ? "Set as Top Pick" : "Removed from Top Picks", "success");
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  useEffect(() => { fetchNews(); }, []); 

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
          return { type: 'paragraph', children: [{ type: 'text', text: textContent.trim() }] };
        }
        return null;
      }).filter((block: any) => block !== null);
    
      const payload = {
        data: {
          ...formData,
          content: strapiBlocks,
          publishedAt: status === 'published' ? new Date().toISOString() : null,
          isFeatured: !!formData.isFeatured 
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

  const filteredArticles = articles.filter(a => {
    const matchesState = publicationState === 'published' ? a.isActuallyPublished : !a.isActuallyPublished;
    const matchesFilter = filter === 'All' || a.displayCategory === filter;
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-montserrat text-gray-900 relative">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobileOpen={isMobileOpen} onMobileToggle={() => setIsMobileOpen(!isMobileOpen)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-w-0`}>
        <Header title="News Management" onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            
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
              <ArticleForm initialData={selectedArticle} onSave={handleSave} onCancel={() => setIsEditing(false)} isLoading={loading} />
            ) : (
              <div className="space-y-6">
                {/* Search & Filters */}
                <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row gap-6">
                 
                  <div className="relative w-full xl:w-80">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input placeholder="SEARCH ARTICLES..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none text-[10px] font-bold uppercase" />
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                  <div className="hidden md:block p-6">
                    <table className="w-full text-sm text-left text-gray-600">
                      <thead className="bg-[#F4F2FE] text-gray-700 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3">News Content</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Top Pick Status</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredArticles.map((article) => (
                          <tr key={article.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                  {article.featuredImage && <img src={article.featuredImage} className="w-full h-full object-cover" />}
                                </div>
                                <div className="font-bold text-gray-900 truncate max-w-[200px]">{article.title}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-medium">{article.displayCategory}</td>
                            <td className="px-4 py-4">
                               <button 
                                onClick={() => toggleTopPick(article)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 border transition-all ${article.isFeatured ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-300'}`}
                               >
                                <Star size={12} className={article.isFeatured ? "fill-amber-600" : ""} />
                                {article.isFeatured ? "Top Pick" : "Set Top Pick"}
                               </button>
                            </td>
                            <td className="px-4 py-4">
                               <div className="flex justify-center gap-2">
                                  <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:text-purple-600"><Edit3 size={16}/></button>
                                  <button onClick={() => setDeleteModal({ isOpen: true, id: article.documentId || article.id })} className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
                               </div>
                            </td>
                          </tr>
                        ))}
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