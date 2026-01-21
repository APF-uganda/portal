import { useState, useEffect, useRef } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
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
  const [cardsVisible, setCardsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const events: Event[] = [
    {
      image: event1Img,
      title: 'Annual APF Conference 2026: Digital Transformation',
      date: 'October 15, 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'Sheraton Kampala Hotel, Kampala',
      description: 'Join us for our flagship annual event featuring keynote speakers, interactive sessions, and many more.'
    },
    {
      image: event2Img,
      title: 'Tax Updates Workshop 2026',
      date: 'February 12, 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'Sheraton Kampala Hotel, Kampala',
      description: 'Stay ahead with the latest tax regulations and compliance requirements for 2026.'
    },
    {
      image: event3Img,
      title: 'Annual Digital Transformation Forum',
      date: 'October 15, 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'Sheraton Kampala Hotel, Kampala',
      description: 'Discover how technology is reshaping the future of accounting and finance.'
    }
  ]

  const totalPages = events.length

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setCardsVisible(true), 200)
    }
  }, [isVisible])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 5000)
    return () => clearInterval(interval)
  }, [totalPages, isMobile])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!isMobile) return
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (swipeDistance > minSwipeDistance && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    } else if (swipeDistance < -minSwipeDistance && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <section className="bg-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 
          ref={elementRef}
          className={`text-center text-gray-900 text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 transform px-4 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          Featured Events
        </h2>
        
        {/* Mobile Carousel View */}
        <div className="sm:hidden">
          <div 
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {events.map((event, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <EventCard
                    image={event.image}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    description={event.description}
                    onRegister={() => console.log('Register for:', event.title)}
                    delay={0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet & Desktop Grid View */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
          {events.map((event, index) => (
            <EventCard
              key={index}
              image={event.image}
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
              description={event.description}
              onRegister={() => console.log('Register for:', event.title)}
              delay={cardsVisible ? index * 150 : 0}
            />
          ))}
        </div>
        
        {/* Pagination Dots */}
        <div className={`flex justify-center items-center gap-2 sm:gap-2.5 mt-6 sm:mt-0 transition-all duration-1000 px-4 ${
          cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 transform hover:scale-125 active:scale-110 ${
                currentPage === index 
                  ? 'w-6 sm:w-8 bg-purple-700 shadow-md' 
                  : 'w-1.5 sm:w-2 bg-gray-400 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedEvents
