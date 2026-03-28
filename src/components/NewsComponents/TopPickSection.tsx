import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { prefetchNewsArticle } from '../../hooks/useCMS';

interface TopPickProps {
  article?: any;
}

const TopPickSection = ({ article }: TopPickProps) => {
  const navigate = useNavigate();
  const FALLBACK_IMAGE = "/images/Hero.jpg";

  if (!article) return null;

  const displaySummary = article.description || article.summary || "";
  const displayImage = article.featuredImage || article.image || FALLBACK_IMAGE;

  const handleReadMore = () => {
    const targetId = article.documentId || article.id;
    if (targetId) {
      void prefetchNewsArticle(targetId);
      navigate(`/news/${targetId}`);
    }
  };

  return (
   
    <section className="py-12 px-4 md:px-6 max-w-5xl mx-auto w-full flex flex-col items-center">
      
    
      <div className="flex items-center gap-3 mb-8 w-full">
        <div className="h-[1px] flex-1 bg-gray-100"></div>
        <h3 className="text-lg md:text-xl text-[#1A1A1A] uppercase tracking-tighter whitespace-nowrap px-4">
          Our Latest News: <span className="text-[#5F1C9F]">Top Pick</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        
       
        <div className="w-full md:w-[240px] flex-shrink-0">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg bg-gray-100">
            <img 
              src={displayImage}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
            />
          </div>
        </div>

        {/* Content side */}
        <div className="flex flex-col space-y-4 text-center md:text-left max-w-[450px]">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#5F1C9F] font-bold text-[10px] uppercase tracking-[0.2em]">
            <span className="w-6 h-[2px] bg-[#5F1C9F]"></span>
            Featured Story
          </div>
          
          <h2 className="text-2xl md:text-3xl text-[#1A1A1A] leading-tight tracking-tight">
            {article.title}
          </h2>
          
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {displaySummary}
          </p>
          
          <div className="pt-2 flex justify-center md:justify-start">
            <button 
              onClick={handleReadMore}
              className="flex items-center gap-3 px-8 py-4 bg-[#5F1C9F] text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#4a1480] transition-all shadow-lg shadow-purple-100 active:scale-95"
            >
              Read Full Story 
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopPickSection;