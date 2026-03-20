import { useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import EventCard from "../common/EventCard"
import { useEvents } from "../../hooks/useCMS"
import ErrorBoundary from "../common/ErrorBoundary"


const formatNormalDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; 
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const FeaturedEvents = () => {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { events, error } = useEvents()
  
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sourceEvents = events && events.length > 0 ? events : [];
    
    return sourceEvents
      .filter(event => {
       
        const dateToCheck = event.startDate || event.date;
        return dateToCheck && new Date(dateToCheck) >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.startDate || a.date).getTime();
        const dateB = new Date(b.startDate || b.date).getTime();
        return dateA - dateB;
      })
      .slice(0, 6);
  }, [events])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }

  const handleRegister = (event: any) => {
    const start = formatNormalDate(event.startDate || event.date);
    const end = formatNormalDate(event.endDate);
    
   
    const displayDate = end && end !== start ? `${start} - ${end}` : start;

    navigate('/event-registration', {
      state: {
        eventId: event.id || event.documentId,
        eventTitle: event.title,
        location: event.location,
        image: event.image,
        // Pass the raw dates AND the pretty display version
        startDate: event.startDate || event.date,
        endDate: event.endDate,
        displayDate: displayDate,
        // Ensure numbers are passed correctly
        cpdPoints: Number(event.cpdPoints || 0),
        memberPrice: Number(event.memberPrice || 0),
        nonMemberPrice: Number(event.nonMemberPrice || 0),
        isPaid: event.isPaid || (Number(event.nonMemberPrice) > 0),
        description: event.description
      }
    })
  }

  return (
    <ErrorBoundary fallback={<div className="py-16 text-center">Events unavailable.</div>}>
      <section className="bg-white py-16 font-montserrat overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative">
          <h2 className="text-center text-gray-800 text-2xl sm:text-3xl md:text-4xl font-bold mb-12">
            Featured Events
          </h2>

          <div className="group relative">
            {/* Desktop Navigation Arrows */}
            <button 
              onClick={() => scroll('left')}
              className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 bg-[#7E49B3] text-white w-11 h-11 rounded-full items-center justify-center z-10 shadow-lg hover:scale-110 transition disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Responsive Slider  */}
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {upcomingEvents.map((event: any) => (
                <div 
                  key={event.id || event.documentId || event.title} 
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] snap-center"
                >
                  <EventCard
                    {...event}
                  
                    date={formatNormalDate(event.startDate || event.date)}
                    onRegister={() => handleRegister(event)}
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={() => scroll('right')}
              className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 bg-[#7E49B3] text-white w-11 h-11 rounded-full items-center justify-center z-10 shadow-lg hover:scale-110 transition disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-4 md:hidden animate-pulse">
            Swipe to explore events
          </p>
        </div>
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </ErrorBoundary>
  )
}

export default FeaturedEvents;