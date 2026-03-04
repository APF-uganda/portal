import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TopPickProps {
  article?: any;
}

const TopPickSection = ({ article }: TopPickProps) => {
  if (!article) return null;

  return (
    <section className="py-10 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 rounded-[2rem] p-6 md:p-10 border border-gray-100">
        {/* Image Container  */}
        <div className="w-full md:w-5/12">
          <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-7/12 space-y-4">
          <div className="flex items-center gap-2 text-[#5C32A3] font-bold text-[10px] uppercase tracking-widest">
            <span className="w-6 h-[1.5px] bg-[#5C32A3]"></span>
            Featured Story
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] leading-tight tracking-tight">
            {article.title}
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-3">
            {article.summary}
          </p>
          <button className="flex items-center gap-2 text-[#5C32A3] font-black text-xs uppercase tracking-widest group pt-2">
            Read Full Story 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopPickSection;