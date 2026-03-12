import { useState, useEffect } from 'react';
import { 
  Edit3, Search, Plus, ArrowLeft, Trash2, Image as ImageIcon, Loader2 
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
  
  const navigate = useNavigate();

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
          featuredImage: imageObj?.url 
            ? `${CMS_BASE_URL}${imageObj.url}` 
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
  }, [publicationState]);

  const handleSave = async (formData: any, status: 'draft' | 'published' = 'published') => {
    setLoading(true);
  
    // Strapi Blocks format
    const strapiBlocks = formData.contentBlocks.map((block: any) => ({
      type: 'paragraph', 
      children: [{ type: 'text', text: block.value || "" }] 
    }));
  
    const payload = {
      data: {
        title: formData.title,
        description: formData.summary,
        content: strapiBlocks, 
        
        featuredImage: formData.imageId ? [formData.imageId] : [], 
        author: formData.author || "APF Admin",
        publishDate: formData.date || new Date().toISOString().split('T')[0],
        readTime: Number(formData.readTime) || 5,
        isTopic: !!formData.isTopPick,
        isFeatured: !!formData.isTopPick, 
        
        
        news: formData.categoryId ? formData.categoryId : null,
        
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
      alert(status === 'published' ? "News Article Published!" : "Draft Saved!");
    } catch (err: any) {
      console.error("Payload sent:", JSON.stringify(payload, null, 2));
      const errorData = err.response?.data?.error;
      console.error("Server Error:", errorData);
      
      // Detailed error logging to see exactly which field failed
      const msg = errorData?.message || "Check fields and permissions";
      const details = errorData?.details?.errors ? `: ${errorData.details.errors[0].path[0]} field error` : "";
      
      alert(`Save Failed: ${msg}${details}`);
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

        <div className="flex-1 p-10">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {!isEditing && (
              <button 
                onClick={() => navigate(-1)} 
                className="group flex items-center gap-3 text-slate-400 hover:text-purple-700 transition-all"
              >
                <div className="p-2 rounded-xl bg-white border border-slate-100 group-hover:border-purple-200 shadow-sm">
                  <ArrowLeft size={16} />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest">Return to Dashboard</span>
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
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tighter border-r border-slate-200 pr-4">Articles</h2>
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button 
                        onClick={() => setPublicationState('published')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${publicationState === 'published' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-400'}`}
                      >
                        Live
                      </button>
                      <button 
                        onClick={() => setPublicationState('preview')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${publicationState === 'preview' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}
                      >
                        Drafts
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }} 
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-purple-700 transition-all text-xs font-bold uppercase shadow-lg active:scale-95"
                  >
                    <Plus size={14} strokeWidth={3} /> Create News
                  </button>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="flex bg-white p-1 rounded-xl border border-slate-100 overflow-x-auto w-full lg:w-auto">
                      {['All', 'Policy Update', 'Thought Leadership', 'Announcements', 'SME Support'].map((t) => (
                        <button 
                          key={t} 
                          onClick={() => setFilter(t)} 
                          className={`px-5 py-2 text-xs font-bold uppercase rounded-lg transition-all whitespace-nowrap ${filter === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="relative w-full lg:w-[300px]">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        placeholder="Search titles..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none text-xs font-bold text-slate-900" 
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {loading && articles.length === 0 ? (
                      <div className="h-[300px] flex flex-col items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-purple-600" size={32} />
                        <span className="font-bold text-xs uppercase text-slate-400">Fetching Content...</span>
                      </div>
                    ) : (
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                            <th className="px-6 py-4 text-left">News Article</th>
                            <th className="px-4 py-4 text-center">Category</th>
                            <th className="px-4 py-4 text-center">Featured</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                            <tr key={article.id} className="hover:bg-slate-50/30 transition-all group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                    {article.featuredImage ? (
                                      <img src={article.featuredImage} className="w-full h-full object-cover" alt=""/>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-slate-300"/></div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-purple-700 transition-colors">{article.title}</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase">{article.publishDate}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center">
                                 <span className="text-xs font-bold uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                   {article.displayCategory}
                                 </span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                {article.isTopic || article.isFeatured ? (
                                  <span className="text-amber-600 text-xs font-bold uppercase">Yes</span>
                                ) : (
                                  <span className="text-slate-300 text-xs font-bold uppercase">No</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => { setSelectedArticle(article); setIsEditing(true); }} 
                                    className="p-2 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(article.documentId || article.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                                <td colSpan={4} className="py-20 text-center text-slate-300 font-bold text-xs uppercase">
                                    No news articles to show
                                </td>
                            </tr>
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