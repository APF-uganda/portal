import { useEffect, useState, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import EventCard from "../common/EventCard"
import { useEvents } from "../../hooks/useCMS"
import ErrorBoundary from "../common/ErrorBoundary"

// Fallback data when CMS is unavailable
const fallbackEvents = [
  {
    id: 'fallback-1',
    title: 'Welcome to APF Events',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    time: '9:00 AM - 5:00 PM',
    location: 'Kampala, Uganda',
    description: 'Stay tuned for upcoming professional development events and conferences.',
    image: '/images/annual.png', // Use existing image
    isFeatured: true
  }
]

const FeaturedEvents = () => {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  
  // Fetch events from CMS
  const { events, error } = useEvents()
  
  // Smart filtering for featured events with fallback logic
  const featuredEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
    
    // Use CMS events if available, otherwise fallback
    const sourceEvents = events.length > 0 ? events : fallbackEvents
    
    // Filter for upcoming events only
    const upcomingEvents = sourceEvents.filter(event => {
      if (!event.date) return false
      const eventDate = new Date(event.date)
      return eventDate >= today
    })
    
    // Sort by date (earliest first) and prioritize featured events
    const sortedEvents = upcomingEvents.sort((a, b) => {
      // First, prioritize featured events
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      
      // Then sort by date
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })
    
    // Return exactly 6 events (or fewer if not enough available)
    return sortedEvents.slice(0, 6)
  }, [events])
  
  // Use featuredEvents instead of upcomingEvents
  const upcomingEvents = featuredEvents
  const maxIndex = Math.max(0, upcomingEvents.length - 3)

  // Auto-scroll: only if we have more than 4 events
  useEffect(() => {
    if (upcomingEvents.length <= 4) return
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [upcomingEvents.length, maxIndex])

  // Reset active index when events change
  useEffect(() => {
    setActiveIndex(0)
  }, [upcomingEvents.length])

  const scrollLeft = () => {
    if (upcomingEvents.length > 4) {
      setActiveIndex(prev => Math.max(prev - 1, 0))
    }
  }

  const scrollRight = () => {
    if (upcomingEvents.length > 4) {
      setActiveIndex(prev => Math.min(prev + 1, maxIndex))
    }
  }

  const handleRegister = (event: any) => {
    navigate('/event-registration', {
      state: {
        eventTitle: event.title,
        eventId: event.id
      }
    })
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    if (swipeDistance > 50) {
      setActiveIndex((prev) => Math.min(prev + 1, upcomingEvents.length - 1))
    } else if (swipeDistance < -50) {
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  return (
    <ErrorBoundary fallback={
      <section className="bg-white py-16 font-montserrat">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-center text-gray-800 text-2xl sm:text-3xl md:text-4xl font-bold mb-8">Featured Events</h2>
          <p className="text-gray-600">Events content is temporarily unavailable. Please check back later.</p>
        </div>
      </section>
    }>
      <section className="bg-white py-16 font-montserrat">
        <div className="max-w-6xl mx-auto px-6 relative">
        <h2 className="text-center text-gray-800 text-2xl sm:text-3xl md:text-4xl font-bold mb-12">
          Featured Events
        </h2>
        
        {error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Events</h3>
              <p className="text-gray-600 mb-4">
                We're having trouble loading the latest events. Please try refreshing the page.
              </p>
              <button
                onClick={() => navigate('/events')}
                className="px-4 py-2 bg-[#7E49B3] text-white rounded-lg hover:bg-[#3C096C] transition-colors"
              >
                View All Events
              </button>
            </div>
          </div>
        )}

        {!error && upcomingEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
              <p className="text-gray-600 mb-4">
                We're currently planning exciting new events. Check back soon or visit our events page for more information.
              </p>
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center px-4 py-2 bg-[#7E49B3] text-white rounded-lg hover:bg-[#3C096C] transition-colors"
              >
                View All Events
              </button>
            </div>
          </div>
        )}

        {!error && upcomingEvents.length > 0 && (
          <>
            {/* Mobile View */}
            <div className="sm:hidden">
              {upcomingEvents.length > 1 ? (
                <>
                  <div
                    className="overflow-hidden"
                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
                    onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX }}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                      {upcomingEvents.map((event) => (
                        <div key={event.id || event.documentId || `event-${event.title}`} className="w-full flex-shrink-0 px-2">
                          <EventCard
                            image={event.image}
                            title={event.title}
                            date={event.date}
                            time={event.time}
                            location={event.location}
                            description={event.description}
                            onRegister={() => handleRegister(event)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                      disabled={activeIndex === 0}
                      className="bg-[#7E49B3] text-white w-10 h-10 rounded-full shadow flex items-center justify-center disabled:opacity-40"
                      aria-label="Previous event card"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-[#7E49B3] text-xs font-semibold tracking-wide">
                      {activeIndex + 1} / {upcomingEvents.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => Math.min(prev + 1, upcomingEvents.length - 1))}
                      disabled={activeIndex >= upcomingEvents.length - 1}
                      className="bg-[#7E49B3] text-white w-10 h-10 rounded-full shadow flex items-center justify-center disabled:opacity-40"
                      aria-label="Next event card"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-2">
                  {upcomingEvents.map((event) => (
                    <div key={event.id || event.documentId || `event-${event.title}`}>
                      <EventCard
                        image={event.image}
                        title={event.title}
                        date={event.date}
                        time={event.time}
                        location={event.location}
                        description={event.description}
                        onRegister={() => handleRegister(event)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block relative">
              {/* Left Arrow - Show only if more than 4 events */}
              {upcomingEvents.length > 4 && (
                <button
                  onClick={scrollLeft}
                  disabled={activeIndex === 0}
                  className="absolute -left-12 top-1/2 -translate-y-1/2 bg-[#7E49B3] text-white w-11 h-11 rounded-full shadow flex items-center justify-center hover:scale-110 transition disabled:opacity-40 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <div className="overflow-hidden">
                <div 
                  className={`flex transition-transform duration-500 ease-out ${
                    upcomingEvents.length <= 4 ? 'justify-start gap-6' : ''
                  }`} 
                  style={upcomingEvents.length > 4 ? { transform: `translateX(-${activeIndex * (100 / 3)}%)` } : {}}
                >
                  {upcomingEvents.map((event) => (
                    <div 
                      key={event.id || event.documentId || `event-${event.title}`} 
                      className={upcomingEvents.length <= 4 ? 'flex-shrink-0 w-full max-w-[300px]' : 'w-1/3 flex-shrink-0 px-3'}
                    >
                      <EventCard
                        image={event.image}
                        title={event.title}
                        date={event.date}
                        time={event.time}
                        location={event.location}
                        description={event.description}
                        onRegister={() => handleRegister(event)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Arrow - Show only if more than 4 events */}
              {upcomingEvents.length > 4 && (
                <button
                  onClick={scrollRight}
                  disabled={activeIndex >= Math.max(0, upcomingEvents.length - 3)}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 bg-[#7E49B3] text-white w-11 h-11 rounded-full shadow flex items-center justify-center hover:scale-110 transition disabled:opacity-40 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
    </ErrorBoundary>
  )
}

export default FeaturedEvents;
