import { useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import EventCard from "../../components/cards/EventCard";
import { useEvents } from "../../hooks/useCMS";

const PreviousEvents = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { events, loading } = useEvents();

 
  const previousEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => {
        if (!event.date) return false;
        return new Date(event.date) < now;
      })
    
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events]);

  const scroll = (direction: 'left' | 'right') => {
    const distance = direction === 'left' ? -350 : 350;
    scrollRef.current?.scrollBy({ left: distance, behavior: "smooth" });
  };

  if (loading) return (
    <div className="flex justify-center py-20 bg-[#F5EFFB]">
      <Loader2 className="animate-spin text-purple-600" size={40} />
    </div>
  );

  if (previousEvents.length === 0) return null;

  return (
    <section className="bg-[#F5EFFB] py-16 -mx-[50vw] px-[50vw] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter text-center mb-10">
          Previous Events
        </h2>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => scroll('left')} 
            className="hidden md:flex bg-white text-purple-600 border border-purple-100 rounded-full p-3 hover:bg-purple-600 hover:text-white transition-all shadow-sm flex-shrink-0"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            ref={scrollRef} 
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden flex-grow"
          >
         
{previousEvents.map((event, idx) => (
  <div key={event.id || idx} className="w-[85vw] md:w-[350px] snap-start flex-shrink-0">
    <EventCard 
      image={event.image}
      title={event.title}
      date={event.date}
      time={event.time}
      location={event.location}
      description={event.description}
      isPast={true}
    />
  </div>
))}
          </div>

          <button 
            onClick={() => scroll('right')} 
            className="hidden md:flex bg-white text-purple-600 border border-purple-100 rounded-full p-3 hover:bg-purple-600 hover:text-white transition-all shadow-sm flex-shrink-0"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PreviousEvents;