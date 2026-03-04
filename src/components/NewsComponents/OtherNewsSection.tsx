import React from 'react';

interface OtherNewsProps {
  articles: any[];
}

const OtherNewsSection = ({ articles }: OtherNewsProps) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-100">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black text-[#1A1A1A]">Latest Stories</h2>
          <p className="text-gray-400 font-medium mt-2">Discover more news and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {articles.map((item) => (
          <article key={item.id} className="group cursor-pointer">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-gray-100">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-[#5C32A3] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <span>{item.date}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{item.readTime}</span>
              </div>
              <h3 className="text-xl font-black text-[#1A1A1A] leading-snug group-hover:text-[#5C32A3] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed font-medium">
                {item.summary}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OtherNewsSection;