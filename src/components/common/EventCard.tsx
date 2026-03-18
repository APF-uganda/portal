import { useState } from "react";
import { Calendar, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";

interface EventCardProps {
  image: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  onRegister?: () => void;
}

function EventCard({
  image,
  title,
  date,
  time,
  location,
  description,
  onRegister,
}: EventCardProps) {
  
  const FALLBACK_IMAGE = "/images/annual.png"; // Use local fallback
  const DESCRIPTION_LIMIT = 100; // Character limit for description
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Event image failed to load:', image);
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  const shouldShowReadMore = description && description.length > DESCRIPTION_LIMIT;
  const displayDescription = shouldShowReadMore && !isExpanded 
    ? description.substring(0, DESCRIPTION_LIMIT) + "..."
    : description;

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out animate-fade-in-up h-full flex flex-col hover:-translate-y-2.5 hover:shadow-[0_8px_25px_rgba(124,58,237,0.2)] group">
      {/* Image - Same height as NewsCard */}
      <div className="h-56 overflow-hidden flex-shrink-0">
        <img
          src={image || FALLBACK_IMAGE}
          alt={title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title with hover color change */}
        <h6
          className="text-secondary text-[1.1rem] mb-2 leading-[1.3] font-semibold 
                     transition-colors duration-300 group-hover:text-purple-600 line-clamp-2"
        >
          {title}
        </h6>

        {/* Icons instead of emojis */}
        <p className="text-[#666] text-[0.9rem] py-1 flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> 
          <span className="truncate">{date}</span>
        </p>
        <p className="text-[#666] text-[0.9rem] py-1 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> 
          <span className="truncate">{time}</span>
        </p>
        <p className="text-[#666] text-[0.9rem] py-1 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> 
          <span className="truncate">{location}</span>
        </p>

        {/* Description with Read More */}
        <div className="py-1 pb-4 flex-grow">
          <p className="text-[#666] text-[0.9rem] leading-relaxed">
            {displayDescription}
          </p>
          
          {shouldShowReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center text-[#7E49B3] hover:text-[#3C096C] text-xs font-medium transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Read Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Read More
                </>
              )}
            </button>
          )}
        </div>

        {/* Register Button */}
        <div className="mt-1">
          <button
            onClick={onRegister}
            className="w-full bg-[#5F1C9F] text-white rounded-[25px] py-3 font-semibold transition-all duration-300 ease-in-out mt-auto hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(124,58,237,0.4)]"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;