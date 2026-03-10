import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import api from '../../services/cmsApi';
import { CMS_BASE_URL } from '../../config/api';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/news-articles/${id}?populate=*`);
        // Handle Strapi's nested data structure
        const data = res.data.data.attributes || res.data.data;
        
        // Format the featured image URL
        const featuredImage = data.image?.data?.attributes?.url 
          ? `${CMS_BASE_URL}${data.image.data.attributes.url}` 
          : null;

        setArticle({ ...data, featuredImage });
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!article) return <div className="text-center py-20">Article not found.</div>;

  return (
    <article className="bg-white min-h-screen pb-20">
      {/* Article Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-purple-700 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Back to News</span>
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {article.category}
             </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 py-6 border-y border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Calendar size={14} /> {article.publishDate}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Clock size={14} /> {article.readTime} MIN READ
            </div>
          </div>
        </div>
      </div>

      {/* Main Image */}
      {article.featuredImage && (
        <div className="max-w-6xl mx-auto px-6 my-12">
          <img 
            src={article.featuredImage} 
            className="w-full h-[400px] md:h-[600px] object-cover rounded-[2rem] shadow-2xl" 
            alt={article.title} 
          />
        </div>
      )}

      {/* Content Blocks */}
      <div className="max-w-3xl mx-auto px-6 space-y-10">
        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium italic border-l-4 border-purple-500 pl-6 py-2">
          {article.description}
        </p>

        <div className="prose prose-slate prose-lg max-w-none">
          {article.contentBlocks?.map((block: any, idx: number) => {
            if (block.type === 'text') {
              return (
                <p key={idx} className="text-lg text-slate-800 leading-[1.8] whitespace-pre-wrap mb-6">
                  {block.value}
                </p>
              );
            }
            if (block.type === 'image') {
              return (
                <figure key={idx} className="my-12">
                  <img src={block.value} className="rounded-2xl w-full" alt="Content detail" />
                </figure>
              );
            }
            return null;
          })}
        </div>
      </div>
    </article>
  );
};

export default NewsDetail;
