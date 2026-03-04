import React from 'react';
import { ArrowRight } from 'lucide-react';

interface OtherNewsProps {
  articles: any[];
}

const OtherNewsSection = ({ articles }: OtherNewsProps) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto border-t border-gray-100">
      {/* Centered Title Area */}
      <div className="flex flex-col items-center mb-12 text-center">
        <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tighter">
          Other News
        </h3>
        <div className="w-12 h-[2px] bg-[#5C32A3] mt-2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((item) => (
          <article 
            key={item.id} 
            className="group cursor-pointer flex flex-col bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300"
          >
            {/* Image Container inside the card */}
            <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-5 bg-gray-50">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-3 left-3">
                <span className="bg-white/95 backdrop-blur-sm text-[#5C32A3] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>
            
            {/* Content Area within the card padding */}
            <div className="flex-1 flex flex-col px-2 pb-2">
              <h3 className="text-lg font-black text-[#1A1A1A] leading-snug group-hover:text-[#5C32A3] transition-colors mb-3">
                {item.title}
              </h3>
              
              <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed font-normal mb-4">
                {item.summary}
              </p>

              <div className="mt-auto">
                {/* Read More Link */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 text-[#5C32A3] font-bold text-[10px] uppercase tracking-widest group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={12} />
                  </span>
                </div>

                {/* Metadata footer inside card */}
                <div className="pt-4 border-t border-gray-50 flex items-center gap-3 text-gray-400 text-[9px] tracking-wide font-normal uppercase">
                  <span>{item.date}</span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                  <span>{item.readTime}</span>
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