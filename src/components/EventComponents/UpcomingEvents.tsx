import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import EventCard from "../common/EventCard";
import { useEvents } from "../../hooks/useCMS";

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Get live events from Strapi
  const { events, loading } = useEvents();

 
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate >= today;
  });

  useEffect(() => {
    if (upcomingEvents.length === 0) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const cardWidth = scrollRef.current.offsetWidth;
        const nextIndex = (activeIndex + 1) % upcomingEvents.length;
        const scrollAmount = (scrollRef.current.children[nextIndex] as HTMLElement)?.offsetLeft ?? nextIndex * cardWidth;
        scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
        setActiveIndex(nextIndex);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [activeIndex, upcomingEvents.length]);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-purple-600" />
    </div>
  );

  return (
    <section className="bg-white py-12 -mx-[50vw] px-[50vw] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 uppercase tracking-tighter">
          Upcoming Events
        </h2>

        {/* Only show the carousel if there are actually events */}
        {upcomingEvents.length > 0 ? (
          <div className="flex items-center gap-4">
            <button onClick={scrollLeft} className="hidden md:flex bg-[#7E49B3] text-white rounded-full p-3 hover:bg-[#3C096C] flex-shrink-0">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden flex-grow">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="w-full snap-start flex-shrink-0 px-2 md:min-w-[250px] md:max-w-[360px]">
                  <EventCard
                    {...event}
                    onRegister={() => navigate('/event-registration', { 
                      state: { eventTitle: event.title, eventId: event.id || event.documentId } 
                    })}
                  />
                </div>
              ))}
            </div>

            <button onClick={scrollRight} className="hidden md:flex bg-[#7E49B3] text-white rounded-full p-3 hover:bg-[#3C096C] flex-shrink-0">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
         
          <div className="text-center py-12 text-gray-400 font-bold uppercase text-xs tracking-widest">
            No upcoming events at the moment.
          </div>
        )}

  
        {upcomingEvents.length > 1 && (
          <div className="flex justify-center mt-6 gap-2 md:hidden">
            {upcomingEvents.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-[#7E49B3] w-6" : "bg-gray-300"}`} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;