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
      
      const eventDate = new Date(date);
      
      // Check if date is valid
      if (isNaN(eventDate.getTime())) {
          return date; 
      }

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
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-purple-100 flex items-center gap-1.5">
            <Award size={14} className="text-purple-600" fill="currentColor" />
            <span className="text-[10px] font-bold text-purple-900 uppercase tracking-tighter">
              {cpdPoints} CPD Units
            </span>
          </div>
        )}
      </div>

     
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2 transition-colors uppercase tracking-tight">
          {title}
        </h3>
        
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center text-gray-600 font-medium text-sm">
            <Calendar size={16} className="mr-2.5 text-purple-500 flex-shrink-0" />
            <span className="truncate">{displayDate}</span>
          </div>
          
          <div className="flex items-center text-gray-600 font-medium text-sm">
            <Clock size={16} className="mr-2.5 text-purple-500 flex-shrink-0" />
            <span className="truncate">{time || "Time TBD"}</span>
          </div>

          <div className="flex items-center text-gray-600 font-medium text-sm">
            <MapPin size={16} className="mr-2.5 text-purple-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Pricing Section */}
          {(memberPrice || nonMemberPrice) && (
            <div className="pt-2 border-t border-slate-100 mt-2 flex flex-col gap-1">
              {memberPrice && (
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Member: <span className="text-purple-700">UGX {Number(memberPrice).toLocaleString()}</span>
                </div>
              )}
              {nonMemberPrice && (
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Non-Member: <span className="text-purple-700">UGX {Number(nonMemberPrice).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
          {description}
        </p>
        
        {!isPast && (
          <div className="mt-auto">
            <button 
              onClick={onRegister}
              className="w-full bg-[#7E49B3] text-white py-3.5 rounded-full text-sm font-semibold hover:bg-[#3C096C] transition-all shadow-md active:scale-95"
            >
              Register Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}