import { ArrowRight } from 'lucide-react';

interface NewsCardProps {
  image: string;
  tag: string;
  title: string;
  description: string;
  date: string;
  readTime: string | number; 
  onReadMore?: () => void;
  delay?: number;
}

function NewsCard({ 
  image, 
  tag, 
  title, 
  description, 
  date, 
  readTime, 
  onReadMore,
  delay = 0 
}: NewsCardProps) {
  
  const imageUrl = image || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div 
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group w-full"
      style={{ 
        animationDelay: `${delay}ms`,
        
      }}
    >
      {/* Image Container */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
            {tag}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          <span>{date}</span>
          <span>•</span>
          <span>{readTime} Min Read</span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight transition-colors duration-300 group-hover:text-purple-700">
          {title}
        </h3>
        
        <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed">
          {description}
        </p>
        
        <button 
          onClick={onReadMore}
          className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:gap-4 group/btn"
        >
          Read Article
          <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

export default NewsCard;