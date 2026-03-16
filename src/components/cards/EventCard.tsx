import { Calendar, Clock, MapPin, Award } from 'lucide-react';
import { useMemo } from 'react';
import { CMS_BASE_URL } from '../../config/api'; 

export interface EventCardProps {
  image?: any;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  isPaid?: boolean | string;           
  memberPrice?: number | string;
  nonMemberPrice?: number | string; 
  cpdPoints?: number | string; 
  onRegister?: () => void;
  delay?: number;
  isPast?: boolean; 
}

export default function EventCard({ 
  image, 
  title, 
  date, 
  time, 
  location, 
  description, 
  memberPrice,
  nonMemberPrice,
  cpdPoints,
  onRegister,
  delay = 0,
  isPast = false 
}: EventCardProps) {

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800";

  const imageUrl = useMemo(() => {
    const imgPath = image?.data?.attributes?.url || image?.url || image?.attributes?.url || (typeof image === 'string' ? image : null);
    if (!imgPath) return DEFAULT_IMAGE;
    return imgPath.startsWith('http') ? imgPath : `${CMS_BASE_URL}${imgPath}`;
  }, [image]);

  const displayDate = useMemo(() => {
    if (!date) return "Date TBD";
    try {
      const datePart = date.split('T')[0]; 
      const [year, month, day] = datePart.split('-');
      const eventDate = new Date(Number(year), Number(month) - 1, Number(day));
      
      return eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return date; 
    }
  }, [date]);

  return (
    <div 
      className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm group w-full h-full flex flex-col transition-all duration-500 border border-slate-100 hover:border-purple-200 hover:shadow-2xl hover:-translate-y-2 font-montserrat ${isPast ? 'opacity-75 grayscale-[0.3]' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image Section */}
      <div className="h-52 overflow-hidden relative flex-shrink-0 bg-slate-100">
        <img 
          src={imageUrl} 
          alt={title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        
        
        {cpdPoints && Number(cpdPoints) > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-purple-100 flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
            <Award size={14} className="text-purple-600" fill="currentColor" />
            <span className="text-[10px] font-black text-purple-900 uppercase tracking-tighter">
              {cpdPoints} CPD Units
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-slate-700 mb-4 leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors uppercase tracking-tight">
          {title}
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-black">
            <Calendar size={14} strokeWidth={3} className="text-purple-600" />
            <span className="text-sm font-semibold">{displayDate}</span>
          </div>
          
          <div className="flex items-center gap-3 text-black">
            <Clock size={14} strokeWidth={3} className="text-purple-600" />
            <span className="text-sm font-semibold">{time}</span>
          </div>

          <div className="flex items-center gap-3 text-black">
            <MapPin size={14} strokeWidth={3} className="text-purple-600" />
            <span className="text-sm font-semibold truncate">{location}</span>
          </div>

          {/* Pricing Section */}
          {(memberPrice || nonMemberPrice) && (
            <div className="pt-2 border-t border-slate-100 mt-2 flex flex-col gap-1">
              {memberPrice && (
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Member: <span className="text-purple-700">UGX {Number(memberPrice).toLocaleString()}</span>
                </div>
              )}
              {nonMemberPrice && (
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Non-Member: <span className="text-purple-700">UGX {Number(nonMemberPrice).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-sm text-black mb-8 line-clamp-3 leading-relaxed font-medium">
          {description}
        </p>
        
        {!isPast && (
          <div className="mt-auto">
            <button 
              onClick={onRegister}
              className="w-full bg-[#5F1C9F] text-white py-4 rounded-full text-sm font-bold hover:bg-purple-700 transition-all transform active:scale-95 flex items-center justify-center shadow-xl"
            >
              Register Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}