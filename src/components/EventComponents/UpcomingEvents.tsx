import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import EventCard from "../common/EventCard";
import { useEvents } from "../../hooks/useCMS";

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { events, loading } = useEvents();

  // 1. TEMPORARY: Show ALL events (No Filter) to verify connection
  const upcomingEvents = useMemo(() => {
    console.log("RAW EVENTS FROM HOOK:", events);
    return events; 
  }, [events]);

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
    <div className="flex justify-center py-20 bg-white">
      <Loader2 className="animate-spin text-purple-600" size={40} />
    </div>
  );

  return (
    <section className="bg-white py-12 -mx-[50vw] px-[50vw] relative border-t border-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter text-center mb-10">
          Upcoming Events
        </h2>

        {upcomingEvents.length > 0 ? (
          <div className="flex items-center gap-4">
            <button onClick={scrollLeft} className="hidden md:flex bg-[#7E49B3] text-white rounded-full p-3 hover:bg-[#3C096C] shadow-lg transition-all flex-shrink-0">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden flex-grow gap-6">
              {upcomingEvents.map((event, idx) => (
                <div 
                  key={event.documentId || event.id || idx} 
                  className="w-[85vw] md:w-[350px] snap-start flex-shrink-0"
                >
                  <EventCard
                    {...event}
                    onRegister={() => navigate('/event-registration', { 
                      state: { eventTitle: event.title, eventId: event.documentId || event.id } 
                    })}
                  />
                </div>
              ))}
            </div>

            <button onClick={scrollRight} className="hidden md:flex bg-[#7E49B3] text-white rounded-full p-3 hover:bg-[#3C096C] shadow-lg transition-all flex-shrink-0">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">
              The API is connected, but the Events list is empty.
            </p>
            <p className="text-[10px] text-slate-300 mt-2">
              Double check your Strapi Content Manager for published entries.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;