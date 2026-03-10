import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, PlayCircle } from 'lucide-react';
import api from '../../services/cmsApi';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const STRAPI_URL = "http://localhost:1337";

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/news-articles/${id}?populate=*`);
        const data = res.data.data.attributes || res.data.data;
        
        // Use featuredImage from Strapi OR a link saved in the record
        const featuredImage = data.featuredImage?.data?.[0]?.attributes?.url 
          ? `${STRAPI_URL}${data.featuredImage.data[0].attributes.url}` 
          : (data.imageLink || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200");

        setArticle({ ...data, featuredImage, bodyContent: data.content });
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, STRAPI_URL]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-600"></div></div>;
  if (!article) return <div className="text-center py-20 font-bold text-slate-400 uppercase tracking-widest">Article not found</div>;

  return (
    <article className="bg-white min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-purple-700 transition-colors mb-8 group font-bold text-xs uppercase">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="space-y-6">
          <span className="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase">{article.title}</h1>
          <div className="flex gap-6 text-slate-400 py-6 border-y border-slate-100 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2"><Calendar size={14} /> {article.publishDate}</div>
            <div className="flex items-center gap-2"><Clock size={14} /> {article.readTime} MIN READ</div>
          </div>
        </div>
      </div>

      {article.featuredImage && (
        <div className="max-w-6xl mx-auto px-6 my-12">
          <img src={article.featuredImage} className="w-full h-[400px] md:h-[600px] object-cover rounded-[2.5rem] shadow-2xl border" alt="" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 space-y-10">
        {article.description && (
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium italic border-l-4 border-purple-500 pl-6 py-2 bg-slate-50 rounded-r-2xl">
            {article.description}
          </p>
        )}

        <div className="prose prose-slate prose-lg max-w-none">
          {Array.isArray(article.bodyContent) && article.bodyContent.map((block: any, idx: number) => {
            if (block.type === 'paragraph') {
              const text = block.children?.map((c: any) => c.text).join(" ");
              
              // Detect Image Link
              if (text.startsWith("Image: http") || (text.startsWith("http") && text.match(/\.(jpeg|jpg|gif|png|webp)$/))) {
                const url = text.replace("Image: ", "");
                return <img key={idx} src={url} className="rounded-3xl w-full my-8 shadow-lg" alt="Content detail" />;
              }

              // Detect Video Link
              if (text.includes("youtube.com") || text.includes("youtu.be")) {
                const embed = getEmbedUrl(text.replace("Video: ", ""));
                return (
                  <div key={idx} className="my-10 aspect-video rounded-3xl overflow-hidden shadow-xl">
                    <iframe width="100%" height="100%" src={embed || ""} frameBorder="0" allowFullScreen></iframe>
                  </div>
                );
              }

              return <p key={idx} className="text-lg text-slate-800 leading-[1.8] mb-6">{text}</p>;
            }
            return null;
          })}
        </div>
      </div>
    </article>
  );
};

export default NewsDetail;