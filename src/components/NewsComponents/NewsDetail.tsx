import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, ChevronLeft } from 'lucide-react';
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
        <div className="w-12 h-12 border-4 border-purple-100 border-t-[#5F1C9F] rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Story...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">Article Not Found</h2>
        <button 
          onClick={() => navigate('/news')} 
          className="flex items-center gap-2 bg-[#5F1C9F] text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-purple-100"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Return to News
        </button>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen font-sans animate-fade-in-up overflow-x-hidden">
     
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-50 px-4 py-4 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-black hover:text-[#5F1C9F] font-black text-[10px] uppercase tracking-widest transition-all group"
          >
            <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-4">
             <span className="hidden md:block text-[9px] font-black text-gray-300 uppercase tracking-widest">
               APF Uganda News
             </span>
             <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
               <Share2 size={18} />
             </button>
          </div>
        </div>
      </nav>

      {/*HEADER SECTION */}
      <header className="max-w-4xl mx-auto pt-10 md:pt-20 px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-[2px] bg-[#5F1C9F]"></span>
          <span className="text-[#5F1C9F] font-black text-[10px] uppercase tracking-[0.4em]">
            {article.category || 'Featured'}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-10">
          {article.title}
        </h1>

       
        <div className="flex flex-wrap items-center gap-y-4 gap-x-8 mb-12 py-6 border-y border-gray-100 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Calendar size={14} className="text-[#5F1C9F]" /> {article.publishDate || article.date}
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Clock size={14} className="text-[#5F1C9F]" /> {article.readTime || '5'} MIN READ
          </span>
        </div>
      </header>

      {/*  HERO IMAGE  */}
      <div className="max-w-6xl mx-auto px-0 md:px-6 mb-12 md:mb-24">
        <div className="aspect-[4/3] md:aspect-[21/9] rounded-none md:rounded-[3rem] overflow-hidden shadow-2xl">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      {/*  MAIN ARTICLE BODY */}
      <article className="max-w-3xl mx-auto px-6 pb-24">
        <div className="prose prose-base md:prose-xl max-w-none text-slate-800 leading-relaxed font-medium">
          {Array.isArray(article.content) ? article.content.map((block: any, i: number) => {
           
            if (block.type === 'paragraph') {
              return (
                <p key={i} className="mb-8">
                  {block.children?.map((child: any) => child.text).join('')}
                </p>
              );
            }
            if (block.type === 'heading') {
              const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
              return (
                <HeadingTag key={i} className="font-black text-slate-900 mt-12 mb-6 tracking-tight">
                  {block.children?.map((child: any) => child.text).join('')}
                </HeadingTag>
              );
            }
            return null;
          }) : (
            <p className="text-xl md:text-2xl font-bold leading-snug">{article.description || article.summary}</p>
          )}
        </div>
      </article>

      {/*RELATED NEWS FOOTER */}
      <section className="bg-slate-50 py-16 md:py-32">
        <OtherNewsSection articles={otherArticles} />
      </section>
    </main>
  );
};

export default NewsDetail;