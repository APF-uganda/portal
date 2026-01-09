import '../../assets/css/FeaturedEvents.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useState, useEffect, useRef } from 'react'
import EventCard from '../cards/EventCard'
import event1Img from '../../assets/images/landingPage-image/event1.jpg'
import event2Img from '../../assets/images/landingPage-image/event2.jpeg'
import event3Img from '../../assets/images/landingPage-image/event3.jpeg'

interface Event {
  image: string
  title: string
  date: string
  time: string
  location: string
  description: string
}

function FeaturedEvents() {
  const { elementRef, isVisible } = useScrollAnimation()
  const [currentPage, setCurrentPage] = useState(0)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const autoScrollTimerRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [eventsPerPage, setEventsPerPage] = useState(3)

  // Update events per page based on screen size
  useEffect(() => {
    const updateEventsPerPage = () => {
      if (window.innerWidth <= 768) {
        setEventsPerPage(1) // Mobile: 1 event
      } else if (window.innerWidth <= 1024) {
        setEventsPerPage(2) // Tablet: 2 events
      } else {
        setEventsPerPage(3) // Desktop: 3 events
      }
    }

    updateEventsPerPage()
    window.addEventListener('resize', updateEventsPerPage)
    
    return () => window.removeEventListener('resize', updateEventsPerPage)
  }, [])

  const events: Event[] = [
    {
      image: event1Img,
      title: 'Annual APF Conference 2026: Digital Transformation',
      date: 'January 15, 2026',
      time: '8:00 AM - 5:00 PM',
      location: 'Kampala Serena Hotel, Kampala',
      description: 'Join us for our flagship annual event featuring keynote speakers, interactive sessions, and networking opportunities.'
    },
    {
      image: event2Img,
      title: 'Tax Updates Workshop 2026',
      date: 'February 10, 2026',
      time: '9:00 AM - 4:00 PM',
      location: 'Sheraton Hotel, Kampala',
      description: 'Stay ahead with the latest tax regulations and compliance requirements.'
    },
    {
      image: event3Img,
      title: 'Annual Digital Transformation Forum',
      date: 'March 20, 2026',
      time: '9:00 AM - 4:00 PM',
      location: 'Kampala Serena Hotel, Kampala',
      description: 'Discover how technology is reshaping the accounting profession.'
    },
    {
      image: event1Img,
      title: 'Financial Reporting Standards Update',
      date: 'April 5, 2026',
      time: '10:00 AM - 3:00 PM',
      location: 'Sheraton Hotel, Kampala',
      description: 'Learn about the latest changes in financial reporting standards and their impact on your practice.'
    },
    {
      image: event2Img,
      title: 'Ethics and Professional Conduct Seminar',
      date: 'May 18, 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'Kampala Serena Hotel, Kampala',
      description: 'Explore ethical challenges in modern accounting and strengthen your professional integrity.'
    },
    {
      image: event3Img,
      title: 'Audit Quality and Risk Management',
      date: 'June 22, 2026',
      time: '8:30 AM - 4:30 PM',
      location: 'Sheraton Hotel, Kampala',
      description: 'Enhance your audit skills with best practices in quality control and risk assessment.'
    },
    {
      image: event1Img,
      title: 'Young Professionals Networking Event',
      date: 'July 10, 2026',
      time: '6:00 PM - 9:00 PM',
      location: 'Kampala Serena Hotel, Kampala',
      description: 'Connect with fellow young professionals and build lasting relationships in the accounting community.'
    },
    {
      image: event2Img,
      title: 'Cybersecurity for Accountants',
      date: 'August 14, 2026',
      time: '9:00 AM - 4:00 PM',
      location: 'Sheraton Hotel, Kampala',
      description: 'Protect your clients and firm from cyber threats with essential security practices.'
    },
    {
      image: event3Img,
      title: 'Leadership Development Workshop',
      date: 'September 25, 2026',
      time: '8:00 AM - 5:00 PM',
      location: 'Kampala Serena Hotel, Kampala',
      description: 'Develop leadership skills to advance your career and lead successful teams.'
    }
  ]

  const totalPages = Math.ceil(events.length / eventsPerPage)

  const handleRegister = (eventTitle: string) => {
    console.log('Register for:', eventTitle)
    // Add registration logic here
  }

  const scrollToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex)
    setIsUserScrolling(true)
    
    // Reset user scrolling flag after interaction
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current)
    }
    autoScrollTimerRef.current = window.setTimeout(() => {
      setIsUserScrolling(false)
    }, 1000)
  }

  // Mouse/Touch drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    setIsUserScrolling(true)
    
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
    setStartX(pageX)
    
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current)
    }
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
    const walk = startX - pageX
    const containerWidth = containerRef.current?.offsetWidth || 1200
    
    // Calculate threshold for page change (30% of container width)
    const threshold = containerWidth * 0.3
    
    if (walk > threshold && currentPage < totalPages - 1) {
      // Swipe left - go to next page
      setCurrentPage(currentPage + 1)
      setStartX(pageX) // Reset start position
    } else if (walk < -threshold && currentPage > 0) {
      // Swipe right - go to previous page
      setCurrentPage(currentPage - 1)
      setStartX(pageX) // Reset start position
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    
    // Reset user scrolling flag after interaction
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current)
    }
    autoScrollTimerRef.current = window.setTimeout(() => {
      setIsUserScrolling(false)
    }, 3000)
  }

  // Wheel scroll handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setIsUserScrolling(true)
    
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current)
    }
    
    // Determine scroll direction
    if (e.deltaX > 30 || e.deltaY > 30) {
      // Scroll right/down
      if (currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1)
      }
    } else if (e.deltaX < -30 || e.deltaY < -30) {
      // Scroll left/up
      if (currentPage > 0) {
        setCurrentPage(prev => prev - 1)
      }
    }
    
    autoScrollTimerRef.current = window.setTimeout(() => {
      setIsUserScrolling(false)
    }, 3000)
  }

  // Auto-scroll functionality
  useEffect(() => {
    let intervalId: number

    if (!isUserScrolling) {
      intervalId = window.setInterval(() => {
        setCurrentPage((prevPage) => {
          const nextPage = (prevPage + 1) % totalPages
          return nextPage
        })
      }, 10000) // Auto-scroll every 10 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current)
    }
  }, [isUserScrolling, totalPages])

  return (
    <section className="events">
      <h2 
        ref={elementRef}
        className={`scroll-animate-heading ${isVisible ? 'visible' : ''}`}
      >
        Featured Events
      </h2>
      <div 
        className="events-scroll-container"
        ref={containerRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Navigation Arrows for Mobile */}
        {currentPage > 0 && (
          <button 
            className="nav-arrow nav-arrow-left"
            onClick={() => scrollToPage(currentPage - 1)}
            aria-label="Previous events"
          >
            ‹
          </button>
        )}
        
        <div 
          className="events-grid"
          style={{
            transform: `translateX(-${currentPage * (100 / eventsPerPage)}%)`,
            pointerEvents: isDragging ? 'none' : 'auto'
          }}
        >
          {events.map((event, index) => (
            <EventCard
              key={index}
              image={event.image}
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
              description={event.description}
              onRegister={() => handleRegister(event.title)}
            />
          ))}
        </div>
        
        {currentPage < totalPages - 1 && (
          <button 
            className="nav-arrow nav-arrow-right"
            onClick={() => scrollToPage(currentPage + 1)}
            aria-label="Next events"
          >
            ›
          </button>
        )}
      </div>
      
      {/* Pagination Dots */}
      <div className="pagination-dots">
        {(() => {
          const dots = [];
          const maxVisibleDots = 3;
          
          if (totalPages <= maxVisibleDots) {
            // Show all dots if total is 3 or less
            for (let i = 0; i < totalPages; i++) {
              dots.push(
                <button
                  key={i}
                  className={`dot ${currentPage === i ? 'active' : ''}`}
                  onClick={() => scrollToPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                />
              );
            }
          } else {
            // Show 3 dots with smart positioning
            let startIndex = Math.max(0, currentPage - 1);
            let endIndex = Math.min(totalPages - 1, startIndex + 2);
            
            // Adjust if we're near the end
            if (endIndex === totalPages - 1) {
              startIndex = Math.max(0, endIndex - 2);
            }
            
            for (let i = startIndex; i <= endIndex; i++) {
              dots.push(
                <button
                  key={i}
                  className={`dot ${currentPage === i ? 'active' : ''}`}
                  onClick={() => scrollToPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                />
              );
            }
          }
          
          return dots;
        })()}
      </div>
    </section>
  )
}

export default FeaturedEvents
