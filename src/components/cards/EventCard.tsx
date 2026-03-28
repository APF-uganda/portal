import { Calendar, Clock, MapPin, Award } from 'lucide-react';
import { useMemo } from 'react';
import { CMS_BASE_URL } from '../../config/api'; 

export interface EventCardProps {
  id?: string; 
  image?: any;
  title: string;
  date: string;
  endDate?: string; 
  time: string;
  location: string;
  description: string;
  isPaid?: boolean | string;           
  memberPrice?: number | string;
  nonMemberPrice?: number | string; 
  cpdPoints?: number | string; 
  onRegister?: (data?: any) => void;
  delay?: number;
  isPast?: boolean; 
}

export default function EventCard({ 
  id,
  image, 
  title, 
  date, 
  endDate,
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
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) return date; 
      return eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { return date; }
  }, [date]);

  return (
    <div 
      className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm group w-full h-full flex flex-col transition-all duration-500 border border-slate-100 hover:border-purple-200 hover:shadow-2xl hover:-translate-y-2 font-montserrat ${isPast ? 'opacity-75 grayscale-[0.3]' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-52 overflow-hidden relative flex-shrink-0 bg-slate-100">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        {cpdPoints && Number(cpdPoints) > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-purple-100 flex items-center gap-1.5">
            <Award size={14} className="text-purple-600" fill="currentColor" />
            <span className="text-[10px] font-bold text-purple-900 uppercase tracking-tighter">{cpdPoints} CPD Units</span>
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2 uppercase tracking-tight">{title}</h3>
        
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center text-gray-600 font-medium text-sm">
            <Calendar size={16} className="mr-2.5 text-purple-500" />
            <span>{displayDate}</span>
          </div>
          <div className="flex items-center text-gray-600 font-medium text-sm">
            <Clock size={16} className="mr-2.5 text-purple-500" />
            <span>{time || "Time TBD"}</span>
          </div>
          <div className="flex items-center text-gray-600 font-medium text-sm">
            <MapPin size={16} className="mr-2.5 text-purple-500" />
            <span>{location}</span>
          </div>

          {(memberPrice || nonMemberPrice) && (
            <div className="pt-2 border-t border-slate-100 mt-2 flex flex-col gap-1">
              {memberPrice && (
                <div className="text-[11px] font-bold text-gray-500 uppercase">
                  Member: <span className="text-purple-700 ">UGX {Number(memberPrice).toLocaleString()}</span>
                </div>
              )}
              {nonMemberPrice && (
                <div className="text-[11px] font-bold text-gray-500 uppercase">
                  Non-Member: <span className="text-purple-700 ">UGX {Number(nonMemberPrice).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-8 line-clamp-3 font-medium">{description}</p>
        
        {!isPast && (
          <div className="mt-auto">
            <button 
              onClick={() => onRegister?.({
                eventId: id || title,
                eventTitle: title,
                startDate: date,
                endDate: endDate,
                startTime: time,
                location: location,
                image: imageUrl,
                isPaid: isPaid,
                memberPrice: memberPrice,
                nonMemberPrice: nonMemberPrice,
                cpdPoints: cpdPoints
              })}
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