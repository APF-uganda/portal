import { useEffect, useState, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import EventCard from "../common/EventCard"
import type { EventCardProps } from "../../components/cards/EventCard"
import { useEvents } from "../../hooks/useCMS"
import ErrorBoundary from "../common/ErrorBoundary"

const FeaturedEvents = () => {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { events, error } = useEvents()
  
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    
    const sourceEvents = events && events.length > 0 ? events : [];
    
    return sourceEvents
      .filter(event => event.date && new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
    // Explicitly mapping all fields to ensure they reach the state
    navigate('/event-registration', {
      state: {
        eventId: event.id || event.documentId,
        eventTitle: event.title,
        date: event.date,
        location: event.location,
        image: event.image,
        cpdPoints: event.cpdPoints,
        memberPrice: event.memberPrice,
        nonMemberPrice: event.nonMemberPrice,
        isPaid: event.isPaid || (event.nonMemberPrice > 0),
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
            
            <button 
              onClick={() => scroll('left')}
              className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 bg-[#7E49B3] text-white w-11 h-11 rounded-full items-center justify-center z-10 shadow-lg hover:scale-110 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {upcomingEvents.map((event: any) => (
                <div 
                  key={event.id || event.documentId} 
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] snap-center"
                >
                  <EventCard
                    {...event} 
                    onRegister={() => handleRegister(event)}
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={() => scroll('right')}
              className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 bg-[#7E49B3] text-white w-11 h-11 rounded-full items-center justify-center z-10 shadow-lg hover:scale-110 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
         
          <p className="text-center text-sm text-gray-400 mt-4 md:hidden">Swipe to see more</p>
        </div>
      </section>

     
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </ErrorBoundary>
  )
}

export default FeaturedEvents;