import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [cardsVisible, setCardsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
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
    },
    {
      image: event1Img,
      title: 'Professional Development Workshop',
      date: 'March 20, 2026',
      time: '2:00 PM - 6:00 PM',
      location: 'Kampala Serena Hotel, Kampala',
      description: 'Enhance your professional skills with expert-led training sessions.'
    },
    {
      image: event2Img,
      title: 'Financial Reporting Standards Update',
      date: 'April 8, 2026',
      time: '10:00 AM - 4:00 PM',
      location: 'Sheraton Kampala Hotel, Kampala',
      description: 'Learn about the latest changes in financial reporting standards.'
    },
    {
      image: event3Img,
      title: 'Networking Evening for Members',
      date: 'May 15, 2026',
      time: '6:00 PM - 9:00 PM',
      location: 'Golf Course Hotel, Kampala',
      description: 'Connect with fellow professionals in a relaxed evening setting.'
    }
  ]

  const cardsPerView = 3
  const maxIndex = Math.max(0, events.length - cardsPerView)

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

  // Auto-scroll for mobile (one card at a time)
  useEffect(() => {
    if (!isMobile) return
    const interval = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % events.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [events.length, isMobile])

  // Auto-scroll for desktop (3 cards at a time)
  const startAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
    }
    autoScrollTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 5000)
  }

  const resetAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
    }
    startAutoScroll()
  }

  useEffect(() => {
    if (isMobile) return
    startAutoScroll()
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [maxIndex, isMobile])

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
    resetAutoScroll()
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
    resetAutoScroll()
  }

  const handleScroll = () => {
    resetAutoScroll()
  }

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

    if (swipeDistance > minSwipeDistance && mobileIndex < events.length - 1) {
      setMobileIndex(mobileIndex + 1)
    } else if (swipeDistance < -minSwipeDistance && mobileIndex > 0) {
      setMobileIndex(mobileIndex - 1)
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
        
        {/* Mobile Carousel View - One card at a time */}
        <div className="sm:hidden">
          <div 
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
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
          
          {/* Mobile Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: events.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => setMobileIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-500 transform hover:scale-125 active:scale-110 ${
                  mobileIndex === index 
                    ? 'w-6 bg-purple-700 shadow-md' 
                    : 'w-1.5 bg-gray-400 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Carousel View - Three cards at a time */}
        <div className="hidden sm:block relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 w-10 h-10 xl:w-12 xl:h-12 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 transition-all duration-300 flex items-center justify-center -ml-4 xl:-ml-6 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: cardsVisible ? '600ms' : '0ms' }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 xl:w-6 xl:h-6" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-hidden"
            onScroll={handleScroll}
          >
            <div 
              className="flex transition-transform duration-700 ease-out gap-4 sm:gap-5 md:gap-6"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {events.map((event, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0"
                  style={{ width: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})` }}
                >
                  <EventCard
                    image={event.image}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    description={event.description}
                    onRegister={() => console.log('Register for:', event.title)}
                    delay={cardsVisible ? (index % cardsPerView) * 150 : 0}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 w-10 h-10 xl:w-12 xl:h-12 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 transition-all duration-300 flex items-center justify-center -mr-4 xl:-mr-6 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: cardsVisible ? '600ms' : '0ms' }}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 xl:w-6 xl:h-6" />
          </button>
          
          {/* Desktop Pagination Dots */}
          <div className={`flex justify-center items-center gap-2 sm:gap-2.5 mt-6 sm:mt-8 transition-all duration-1000 px-4 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  resetAutoScroll()
                }}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 transform hover:scale-125 active:scale-110 ${
                  currentIndex === index 
                    ? 'w-6 sm:w-8 bg-purple-700 shadow-md' 
                    : 'w-1.5 sm:w-2 bg-gray-400 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedEvents
