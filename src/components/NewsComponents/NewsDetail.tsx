import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, ChevronLeft, PlayCircle } from 'lucide-react';
import { useNewsArticle } from '../../hooks/useCMS';
import OtherNewsSection from './OtherNewsSection';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article, otherArticles, loading, error } = useNewsArticle(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-montserrat">
        <div className="w-12 h-12 border-4 border-purple-100 border-t-[#5F1C9F] rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Loading Story...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center font-montserrat">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Article Not Found</h2>
        <button onClick={() => navigate('/news')} className="flex items-center gap-2 bg-[#5F1C9F] text-white px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest transition-transform active:scale-95">
          <ArrowLeft size={16} strokeWidth={3} /> Return to News
        </button>
      </div>
    );
  }

  const mainContent = article.content || article.contentBlocks || [];
  const displayImage = article.image || "/images/Hero.jpg";

  return (
    <main className="bg-white min-h-screen font-montserrat animate-fade-in-up overflow-x-hidden">
     
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-50 px-4 py-4 md:px-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-900 hover:text-[#5F1C9F] font-bold text-[10px] uppercase tracking-widest transition-all group">
            <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-4">
             <span className="hidden md:block text-[9px] font-bold text-gray-300 uppercase tracking-widest">APF Uganda News</span>
             <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><Share2 size={18} /></button>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="max-w-4xl mx-auto pt-10 md:pt-20 px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-[2.5px] bg-[#5F1C9F] rounded-full"></span>
          <span className="text-[#5F1C9F] font-bold text-[10px] uppercase tracking-[0.4em]">{article.tag || article.category || 'Featured'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-10 uppercase">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-y-4 gap-x-8 mb-12 py-6 border-y border-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
          <span className="flex items-center gap-2 whitespace-nowrap"><Calendar size={14} className="text-[#5F1C9F]" /> {article.date}</span>
          <span className="flex items-center gap-2 whitespace-nowrap"><Clock size={14} className="text-[#5F1C9F]" /> {article.readTime || '5'} MIN READ</span>
        </div>
      </header>

      {/*  Hero Image */}
      <div className="max-w-4xl mx-auto px-6 mb-12 md:mb-20">
        <div className="aspect-[16/9] md:aspect-[21/10] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
          <img src={displayImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content Area */}
      <article className="max-w-3xl mx-auto px-6 pb-24">
        <div className="text-gray-700 leading-relaxed font-medium text-lg md:text-xl">
          {Array.isArray(mainContent) && mainContent.length > 0 ? (
            mainContent.map((block: any, i: number) => {
              
              // TEXT BLOCKS
              if (block.type === 'paragraph' || block.type === 'text') {
                const textValue = block.value || block.children?.map((c: any) => c.text).join('') || "";
                return <p key={i} className="mb-8">{textValue}</p>;
              }
             
              // HEADINGS
              if (block.type === 'heading') {
                return (
                  <h3 key={i} className="font-bold text-gray-900 text-2xl md:text-3xl mt-12 mb-6 uppercase tracking-tight">
                    {block.value || block.children?.map((c: any) => c.text).join('')}
                  </h3>
                );
              }

              // IN-CONTENT IMAGES 
              if (block.type === 'image' && (block.value || block.url)) {
                return (
                  <div key={i} className="my-12 group">
                    <img 
                      src={block.value || block.url} 
                      className="w-full rounded-[2rem] shadow-md border border-gray-50 group-hover:shadow-xl transition-shadow duration-500" 
                      alt="" 
                    />
                    {block.caption && (
                      <p className="mt-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">{block.caption}</p>
                    )}
                  </div>
                );
              }

              // VIDEO BLOCKS 
              if (block.type === 'video' && block.url) {
                return (
                  <div key={i} className="my-12 aspect-video rounded-[2rem] overflow-hidden shadow-lg bg-gray-900">
                    <iframe 
                      src={block.url.replace("watch?v=", "embed/")} 
                      className="w-full h-full"
                      allowFullScreen
                      title="Article Video"
                    ></iframe>
                  </div>
                );
              }

              return null;
            })
          ) : (
            <p className="text-xl font-medium leading-relaxed text-gray-600 italic">
              {article.description || "No further details available for this article."}
            </p>
          )}
        </div>
      </article>

      <section className="bg-gray-50 py-16 md:py-32">
        <OtherNewsSection articles={otherArticles} />
      </section>
    </main>
  );
};

export default NewsDetail;