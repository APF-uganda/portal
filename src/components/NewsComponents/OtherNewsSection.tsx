import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { prefetchNewsArticle } from '../../hooks/useCMS';

interface OtherNewsProps {
  articles: any[];
  title?: string;
  showTopBorder?: boolean;
  embedded?: boolean;
}

const OtherNewsSection = ({
  articles,
  title = 'Our Other News',
  showTopBorder = true,
  embedded = false,
}: OtherNewsProps) => {
  const navigate = useNavigate();
  const FALLBACK_IMAGE = "/images/Hero.jpg";

  if (!articles || articles.length === 0) return null;

  const handleNavigation = (item: any) => {
   
    const targetId = item.documentId || item.id || item.slug;
    if (targetId) {
      void prefetchNewsArticle(targetId);
      navigate(`/news/${targetId}`);
    }
  };

  const sectionClass = embedded
    ? `${showTopBorder ? 'pt-10 border-t border-gray-100' : ''}`
    : `py-16 px-6 max-w-6xl mx-auto ${showTopBorder ? 'border-t border-gray-100' : ''}`;

  return (
    <section className={sectionClass}>
      <div className="flex flex-col items-center mb-12 text-center">
        <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tighter">
          {title}
        </h3>
        <div className="w-12 h-[2px] bg-black mt-2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((item) => (
          <article 
            key={item.documentId || item.id || item.slug || item.title} 
            onClick={() => handleNavigation(item)}
            onMouseEnter={() => void prefetchNewsArticle(item.documentId || item.id || item.slug)}
            className="group cursor-pointer flex flex-col bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300"
          >
            <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-5 bg-gray-50">
              <img 
                src={item.image || FALLBACK_IMAGE}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-3 left-3">
                <span className="bg-white/95 backdrop-blur-sm text-black px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-widest shadow-sm">
                  {item.displayCategory || item.category || 'General'}
                </span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col px-2 pb-2">
              <h3 className="text-lg font-black text-[#1A1A1A] leading-snug group-hover:text-[#5F1C9F] transition-colors mb-3">
                {item.title}
              </h3>
              
              <p className="text-black line-clamp-2 text-sm leading-relaxed  mb-4">
                {item.description || item.summary}
              </p>

              <div className="mt-auto">
                <div className="mb-4 flex items-center">
                  <span className="inline-flex items-center gap-1 text-black font-bold text-sm uppercase tracking-widest group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={15} />
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center gap-3 text-gray-400 text-[9px] tracking-wide font-normal uppercase">
                  <span>{item.publishDate || item.date}</span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                  <span>{item.readTime || '3'} MIN READ</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OtherNewsSection;
