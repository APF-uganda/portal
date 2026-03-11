import { Calendar, Clock, MapPin, Tag, Award } from 'lucide-react';
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

  
  const paidStatus = useMemo(() => {
    const hasPrice = (nonMemberPrice && Number(nonMemberPrice) > 0) || (memberPrice && Number(memberPrice) > 0);
    return isPaid === true || isPaid === 'true' || hasPrice;
  }, [isPaid, nonMemberPrice, memberPrice]);

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
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return date; 
    }
  }, [date]);

  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-md group w-full h-full flex flex-col transition-all duration-500 border border-transparent hover:border-purple-200 ${isPast ? 'opacity-80' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image Section */}
      <div className="h-40 sm:h-48 overflow-hidden relative flex-shrink-0 bg-slate-100">
        <img 
          src={imageUrl} 
          alt={title} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isPast ? 'grayscale-[0.5]' : ''}`} 
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isPast ? (
            <span className="bg-gray-800/90 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm">
              Past Event
            </span>
          ) : (
            <>
              

              
            </>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-3 min-h-[3.5rem] line-clamp-2 group-hover:text-purple-700 transition-colors">
          {title}
        </h3>
        
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-gray-900">{displayDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mb-6 line-clamp-3 leading-relaxed">
          {description}
        </p>
        
        <div className="mt-auto">
          {!isPast && (
            <button 
              onClick={onRegister}
              className="w-full bg-purple-700 text-white py-2.5 rounded-full font-semibold hover:bg-purple-800 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Tag size={16} />
              Register Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}