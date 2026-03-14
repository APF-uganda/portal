import { Calendar, Clock, MapPin,  Award, ArrowRight } from 'lucide-react';
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
  isPaid,
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
      className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm group w-full h-full flex flex-col transition-all duration-500 border border-slate-100 hover:border-purple-200 hover:shadow-2xl hover:-translate-y-2 ${isPast ? 'opacity-75 grayscale-[0.3]' : ''}`}
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
        
        
       
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors uppercase tracking-tight">
          {title}
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-black">
            <div className="p-2  rounded-lg group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
              <Calendar size={14} strokeWidth={3} />
            </div>
            <span className="text-sm font-semibold text-black">{displayDate}</span>
          </div>
          
          <div className="flex items-center gap-3 text-black">
            <div className="p-2  rounded-lg group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
              <Clock size={14} strokeWidth={3} />
            </div>
            <span className="text-sm font-semibold text-black">{time}</span>
          </div>

          <div className="flex items-center gap-3 text-black">
            <div className="p-2  rounded-lg group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
              <MapPin size={14} strokeWidth={3} />
            </div>
            <span className="text-sm font-semibold text-black truncate">{location}</span>
          </div>
        </div>
        
        <p className="text-sm text-black mb-8 line-clamp-3 leading-relaxed font-medium">
          {description}
        </p>
        
        {!isPast && (
          <div className="mt-auto">
            <button 
              onClick={onRegister}
              className="w-full bg-[#5F1C9F] text-white py-4 rounded-full text-sm font-semibold hover:bg-purple-700 transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-xl group/btn"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}