import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TopPickProps {
  article?: any;
}

const TopPickSection = ({ article }: TopPickProps) => {
  if (!article) return null;

  return (
    <section className="py-6 px-6 max-w-5xl mx-auto">
     
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-black text-[#1A1A1A] center uppercase tracking-tighter">
          Our Latest News: Top Pick
        </h3>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center bg-gray-50 rounded-[1.5rem] p-4 md:p-6 border border-gray-100 min-h-[300px]">
        
        {/* Image Container */}
        <div className="w-full md:w-5/12 flex justify-center">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* Content Area - Vertically Centered */}
        <div className="w-full md:w-6/12 flex flex-col justify-center space-y-3">
          <div className="flex items-center gap-2 text-[#5C32A3] font-bold text-[9px] uppercase tracking-widest">
            <span className="w-5 h-[1.5px] bg-[#ffffff]"></span>
            Featured Story
          </div>
          
          <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight tracking-tight">
            {article.title}
          </h2>
          
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2">
            {article.summary}
          </p>
          
          <div className="pt-2">
            <button className="flex items-center gap-2 text-[#5C32A3] font-black text-[10px] uppercase tracking-widest group">
              Read Full Story 
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopPickSection;