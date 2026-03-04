import { useState, useEffect } from 'react';
import { 
  Edit3, Search, Plus, ArrowLeft, Trash2, Image as ImageIcon, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/cmsApi';

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { StatusBadge } from '../../components/createcms-components/status';
import { ArticleForm } from '../../components/createcms-components/article';

const NewsManagement = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | undefined>();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  const navigate = useNavigate();
  const STRAPI_URL = "http://localhost:1337";

  const fetchNews = async () => {
    setLoading(true);
    try {
      // populate=* ensures we get the 'image' and 'news_categories' relation data
      const res = await api.get('/news-articles?populate=*&sort=createdAt:desc');
      
      const formatted = res.data.data.map((item: any) => {
        const data = item.attributes || item;
        return {
          id: item.id,
          documentId: item.documentId,
          ...data,
          // Extract category name from the Strapi Relation 'news_categories'
          displayCategory: data.news_categories?.data?.[0]?.attributes?.name || 'General',
          featuredImage: data.image?.data?.attributes?.url 
            ? `${STRAPI_URL}${data.image.data.attributes.url}` 
            : null
        };
      });
      setArticles(formatted);
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSave = async (formData: any) => {
    setLoading(true);
    
    const payload = {
      data: {
        title: formData.title,
        description: formData.summary,
        
        // 1. IMAGE: Ensure the field API ID in Strapi is exactly 'image'
        image: formData.imageId || null, 

        // 2. RELATION: Strapi expects an array of IDs for the relation field
        news_categories: formData.categoryId ? [formData.categoryId] : [],

        isTopic: !!formData.isTopPick,
        readTime: parseInt(formData.readTime) || 5,
        publishDate: formData.date || new Date().toISOString().split('T')[0],
        contentBlocks: formData.contentBlocks || [],
        
        // Force publish for public-facing visibility
        publishedAt: new Date().toISOString(), 
      }
    };

    try {
      if (selectedArticle) {
        const id = selectedArticle.documentId || selectedArticle.id;
        await api.put(`/news-articles/${id}`, payload);
      } else {
        await api.post('/news-articles', payload);
      }
      
      setIsEditing(false);
      fetchNews();
    } catch (err: any) {
      console.error("Payload Debug:", payload);
      console.error("Strapi Response Error:", err.response?.data);
      alert(`Save Failed: ${err.response?.data?.error?.message || "Check field names in Strapi"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/news-articles/${id}`);
      fetchNews();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesFilter = filter === 'All' || a.displayCategory === filter;
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F4F2FE]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col`}>
        <Header title="News Management" />

        <div className="flex-1 p-10 md:p-14">
          <div className="max-w-[1600px] mx-auto space-y-10">
            
            {!isEditing && (
              <button 
                onClick={() => navigate(-1)} 
                className="group flex items-center gap-3 text-slate-400 hover:text-purple-700 transition-all"
              >
                <div className="p-2 rounded-xl bg-white border border-slate-100 group-hover:border-purple-200 shadow-sm">
                  <ArrowLeft size={16} />
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
              <>
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-slate-200 pb-10">
                  <div>
                    <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">News Console</h1>
                    <p className="text-slate-500 text-[11px] tracking-widest">Global Broadcast & Thought Leadership Control</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }} 
                    className="flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-2xl hover:bg-purple-700 transition-all text-xs font-black uppercase tracking-[0.15em] shadow-2xl active:scale-95"
                  >
                    <Plus size={10} strokeWidth={3} /> Create News Entry
                  </button>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden mt-10">
                   <div className="p-10 border-b border-slate-50 flex flex-col 2xl:flex-row justify-between items-center gap-8 bg-slate-50/30">
                      <div className="flex bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-inner overflow-x-auto w-full 2xl:w-auto">
                        {['All', 'Policy Update', 'Thought Leadership', 'Announcements', 'SME Support'].map((t) => (
                          <button 
                            key={t} 
                            onClick={() => setFilter(t)} 
                            className={`px-8 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all whitespace-nowrap ${filter === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div className="relative w-full 2xl:w-[450px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input 
                          placeholder="SEARCH ENTRIES..." 
                          value={search} 
                          onChange={(e) => setSearch(e.target.value)} 
                          className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[1.5rem] focus:ring-4 focus:ring-purple-50 outline-none text-xs font-black text-slate-900 placeholder:text-slate-300 shadow-sm border border-slate-100" 
                        />
                      </div>
                   </div>

                   <div className="overflow-x-auto min-h-[400px]">
                      {loading && articles.length === 0 ? (
                        <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                          <Loader2 className="animate-spin text-purple-600" size={48} strokeWidth={3} />
                          <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Syncing with Strapi...</span>
                        </div>
                      ) : (
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                              <th className="px-12 py-8 text-left">Article Blueprint</th>
                              <th className="px-10 py-8 text-center">Classification</th>
                              <th className="px-10 py-8 text-center">Placement</th>
                              <th className="px-12 py-8 text-right">Control</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {filteredArticles.map((article) => (
                              <tr key={article.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-12 py-8">
                                  <div className="flex items-center gap-8">
                                    <div className="w-24 h-16 rounded-[1.25rem] bg-slate-100 border border-slate-200 overflow-hidden shadow-inner flex-shrink-0 relative group-hover:scale-105 transition-transform">
                                      {article.featuredImage ? (
                                        <img src={article.featuredImage} className="w-full h-full object-cover" alt=""/>
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-slate-300"/></div>
                                      )}
                                    </div>
                                    <div className="max-w-xl">
                                      <h4 className="font-black text-slate-900 text-lg line-clamp-1 mb-1 group-hover:text-purple-700 transition-colors uppercase tracking-tight">{article.title}</h4>
                                      <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                          {article.publishDate || "No Date"}
                                        </span>
                                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{article.readTime} MIN READ</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                  <StatusBadge status={article.displayCategory} />
                                </td>
                                <td className="px-10 py-8 text-center">
                                  {article.isTopic ? (
                                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl border border-amber-100 shadow-sm">
                                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                      <span className="font-black text-[9px] uppercase tracking-widest">Priority Pick</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-300 text-[9px] font-black uppercase tracking-widest">Standard</span>
                                  )}
                                </td>
                                <td className="px-12 py-8 text-right">
                                  <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                    <button 
                                      onClick={() => { setSelectedArticle(article); setIsEditing(true); }} 
                                      className="p-4 bg-white text-slate-400 hover:text-purple-700 border border-slate-100 hover:border-purple-200 rounded-[1rem] transition-all shadow-sm hover:shadow-md"
                                    >
                                      <Edit3 size={20} strokeWidth={2.5} />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(article.documentId || article.id)}
                                      className="p-4 bg-white text-slate-400 hover:text-red-500 border border-slate-100 hover:border-red-200 rounded-[1rem] transition-all shadow-sm hover:shadow-md"
                                    >
                                      <Trash2 size={20} strokeWidth={2.5} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                   </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default NewsManagement;