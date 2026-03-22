import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "../../components/cards/EventCard";
import { useEvents } from "../../hooks/useCMS";
import { CMS_BASE_URL } from "../../config/api";

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { events } = useEvents();

  const formatReadableDate = (dateStr: string) => {
    if (!dateStr) return "Date TBA";
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); 
    
    return events
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  useEffect(() => {
    if (upcomingEvents.length === 0) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (activeIndex + 1) % upcomingEvents.length;
        scrollRef.current.scrollTo({ left: nextIndex * 350, behavior: "smooth" });
        setActiveIndex(nextIndex);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [activeIndex, upcomingEvents.length]);

  const scroll = (direction: 'left' | 'right') => {
    const distance = direction === 'left' ? -350 : 350;
    scrollRef.current?.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-8 -mx-[50vw] px-[50vw] relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Upcoming Events
        </h2>

        {upcomingEvents.length > 0 ? (
          <div className="flex items-center gap-4">
            {upcomingEvents.length > 4 && (
              <button 
                onClick={() => scroll('left')} 
                className="hidden md:flex bg-[#7E49B3] text-white rounded-full p-3 hover:bg-[#3C096C] shadow-md transition-all flex-shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
           
            <div 
              ref={scrollRef} 
              className="flex overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden flex-grow gap-6 items-stretch"
            >
              {upcomingEvents.map((event, idx) => {
                const rawImage = event.image?.data?.attributes?.url || event.image?.url || event.image;
                const finalImageUrl = rawImage 
                  ? (rawImage.startsWith('http') ? rawImage : `${CMS_BASE_URL}${rawImage}`) 
                  : null; 

                return (
                  <div 
                    key={event.id || idx} 
                    className="w-[85vw] md:w-[350px] snap-start flex-shrink-0 flex"
                  >
                    <EventCard
                      image={finalImageUrl} 
                      title={event.title}
                      date={event.date}
                      time={event.time}
                      location={event.location || "Location TBD"}
                      description={event.description}
                      isPast={false}
                      onRegister={() => navigate('/event-registration', { 
                        state: { 
                          eventTitle: event.title, 
                          eventId: event.documentId || event.id,
                          location: event.location || "Location TBD",
                          
                          startDate: event.date, 
                          displayDate: formatReadableDate(event.date), 
                          time: event.time,
                          image: finalImageUrl,
                          isPaid: event.isPaid,
                          memberPrice: event.memberPrice,
                          nonMemberPrice: event.nonMemberPrice,
                          cpdPoints: event.cpdPoints,
                          description: event.description
                        } 
                      })}
                    />
                  </div>
                );
              })}
            </div>

            {upcomingEvents.length > 4 && (
              <button 
                onClick={() => scroll('right')} 
                className="hidden md:flex bg-[#7E49B3] text-white rounded-full p-3 hover:bg-[#3C096C] shadow-md transition-all flex-shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-500 font-medium text-sm">No upcoming events scheduled</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;