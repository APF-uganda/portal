import { ArrowRight, Clock, Calendar } from 'lucide-react';

interface NewsCardProps {
  image: string | null; 
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
  
  const FALLBACK_IMAGE = "/images/Hero.jpg"; // Use local fallback
  const imageUrl = image || FALLBACK_IMAGE;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image failed to load:', imageUrl);
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <div 
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group w-full flex flex-col h-full"
      style={{ 
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Image Container */}
      <div className="h-56 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        {/* Category Tag */}
        <div className="absolute top-5 left-5">
          <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[9px] font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-[0.15em] border border-white/20">
            {tag}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-purple-500" /> {date}
          </span>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-purple-500" /> {readTime} Min Read
          </span>
        </div>
        
        <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 leading-[1.2] transition-colors duration-300 group-hover:text-purple-700 uppercase tracking-tight">
          {title}
        </h3>
        
        <p className="text-sm text-slate-500 mb-8 line-clamp-3 leading-relaxed font-medium">
          {description}
        </p>
        
        
        <div className="mt-auto">
          <button 
            onClick={onReadMore}
            className="flex items-center gap-2 text-purple-700 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:gap-4 group/btn"
          >
            Read Article
            <div className="p-2 bg-purple-50 rounded-lg group-hover/btn:bg-purple-700 group-hover/btn:text-white transition-colors">
              <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;