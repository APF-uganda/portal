import { Calendar, Clock, MapPin } from 'lucide-react';
import { useMemo } from 'react';

export interface EventCardProps {
  image?: any;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
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
  onRegister,
  delay = 0,
  isPast = false 
}: EventCardProps) {

  const STRAPI_URL = "http://localhost:1337";
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800";

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

  const imageUrl = useMemo(() => {
   
    const imgData = image?.data?.attributes?.url || image?.url || image?.data?.url;
    if (!imgData) return DEFAULT_IMAGE;
    return imgData.startsWith('http') ? imgData : `${STRAPI_URL}${imgData}`;
  }, [image, STRAPI_URL]);

  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-md group w-full h-full flex flex-col transition-all duration-500 ${isPast ? 'opacity-80' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image Section  */}
      <div className="h-40 sm:h-48 overflow-hidden relative flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isPast ? 'grayscale-[0.5]' : ''}`} 
        />
        {isPast && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Past Event</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-3 min-h-[3.5rem] line-clamp-2 group-hover:text-purple-700 transition-colors">
          {title}
        </h3>
        
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-gray-900">{displayDate}</span>
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
        
        <p className="text-xs text-gray-500 mb-6 line-clamp-3 italic">
          {description}
        </p>
        
       
        <div className="mt-auto">
          {!isPast ? (
            <button 
              onClick={onRegister}
              className="w-full bg-purple-700 text-white py-2.5 rounded-full font-semibold hover:bg-purple-800 transition-all transform active:scale-95"
            >
              Register Now
            </button>
          ) : (
            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Registration Closed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}