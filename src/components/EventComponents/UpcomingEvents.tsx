import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "../common/EventCard";
import { baseEvents } from "./eventsData";
// 1. Import your Registration Form component
import { EventRegistrationForm } from "..//../pages/eventRegistration"; 

const UpcomingEvents = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // 2. State to track which event is currently being registered for
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const today = new Date();
  const upcomingEvents = baseEvents.filter(
    (event) => new Date(event.date) >= today
  );

  // Auto-scroll logic (Keeping your existing logic)
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !selectedEvent) { // Pause scroll if modal is open
        const cardWidth = scrollRef.current.offsetWidth;
        const nextIndex = (activeIndex + 1) % upcomingEvents.length;
        const scrollAmount =
          (scrollRef.current.children[nextIndex] as HTMLElement)?.offsetLeft ??
          nextIndex * cardWidth;
        scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
        setActiveIndex(nextIndex);
      }
    }, window.innerWidth < 768 ? 30000 : 60000);

    return () => clearInterval(interval);
  }, [activeIndex, upcomingEvents.length, selectedEvent]);

  // Track scroll position for dots
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const cardWidth = scrollRef.current.offsetWidth;
        const index = Math.round(scrollLeft / cardWidth);
        setActiveIndex(index);
      }
    };

    const ref = scrollRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-12 -mx-[50vw] px-[50vw] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Upcoming Events
        </h2>

        <div className="flex items-center gap-4">
          <button onClick={scrollLeft} className="hidden md:flex bg-[#7E49B3] text-white rounded-full shadow p-3 hover:bg-[#3C096C] transition-colors flex-shrink-0">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex-grow">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="w-full snap-start flex-shrink-0 px-2 md:min-w-[250px] md:max-w-[360px]">
                <EventCard
                  {...event}
                  // 3. Connect the Register button to set the selected event
                  onRegister={() => setSelectedEvent(event)}
                />
              </div>
            ))}
          </div>

          <button onClick={scrollRight} className="hidden md:flex bg-[#7E49B3] text-white rounded-full shadow p-3 hover:bg-[#3C096C] transition-colors flex-shrink-0">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* 4. MODAL OVERLAY: Shows the form when an event is selected */}
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg relative animate-in zoom-in-95 duration-200">
              <EventRegistrationForm 
                eventTitle={selectedEvent.title} 
                eventId={selectedEvent.id} 
                onClose={() => setSelectedEvent(null)} 
              />
            </div>
          </div>
        )}

        {/* Mobile Progress Dots */}
        <div className="flex justify-center mt-6 gap-2 md:hidden">
          {upcomingEvents.map((_, index) => (
            <div key={index} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-[#7E49B3]" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;