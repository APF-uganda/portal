import { Box, Container, Typography, IconButton } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useState, useEffect, useRef } from 'react'
import EventCard from '../cards/EventCard'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
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

  useEffect(() => {
    const updateEventsPerPage = () => {
      if (window.innerWidth <= 768) {
        setEventsPerPage(1)
      } else if (window.innerWidth <= 1024) {
        setEventsPerPage(2)
      } else {
        setEventsPerPage(3)
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
  ]

  const totalPages = Math.ceil(events.length / eventsPerPage)

  const handleRegister = (eventTitle: string) => {
    console.log('Register for:', eventTitle)
  }

  const scrollToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex)
    setIsUserScrolling(true)
    
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current)
    }
    autoScrollTimerRef.current = window.setTimeout(() => {
      setIsUserScrolling(false)
    }, 1000)
  }

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
    const threshold = containerWidth * 0.3
    
    if (walk > threshold && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
      setStartX(pageX)
    } else if (walk < -threshold && currentPage > 0) {
      setCurrentPage(currentPage - 1)
      setStartX(pageX)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current)
    }
    autoScrollTimerRef.current = window.setTimeout(() => {
      setIsUserScrolling(false)
    }, 3000)
  }

  useEffect(() => {
    let intervalId: number

    if (!isUserScrolling) {
      intervalId = window.setInterval(() => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages)
      }, 10000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current)
    }
  }, [isUserScrolling, totalPages])

  return (
    <Box component="section" className="bg-gray-50 py-16 px-8">
      <Typography 
        ref={elementRef}
        variant="h4" 
        className={`text-center text-secondary text-3xl mb-12 font-bold animate-fade-in transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        Featured Events
      </Typography>
      <Container maxWidth="lg" className="relative overflow-hidden select-none">
        {currentPage > 0 && (
          <IconButton
            onClick={() => scrollToPage(currentPage - 1)}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-purple-900 text-white w-10 h-10 transition-all hover:bg-purple-800 hover:scale-110 hidden md:flex"
            sx={{ 
              backgroundColor: 'rgba(107, 33, 168, 0.9)',
              '&:hover': { backgroundColor: 'rgba(107, 33, 168, 1)' }
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        )}
        
        <Box 
          ref={containerRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          className="overflow-hidden"
          sx={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <Box 
            className="flex gap-8 transition-transform duration-500 pb-4"
            sx={{
              transform: `translateX(-${currentPage * (100 / eventsPerPage)}%)`,
              pointerEvents: isDragging ? 'none' : 'auto',
            }}
          >
            {events.map((event, index) => (
              <Box 
                key={index}
                sx={{
                  flex: `0 0 calc(${100 / eventsPerPage}% - ${(eventsPerPage - 1) * 32 / eventsPerPage}px)`,
                  minWidth: 0,
                }}
              >
                <EventCard
                  image={event.image}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  description={event.description}
                  onRegister={() => handleRegister(event.title)}
                />
              </Box>
            ))}
          </Box>
        </Box>
        
        {currentPage < totalPages - 1 && (
          <IconButton
            onClick={() => scrollToPage(currentPage + 1)}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-purple-900 text-white w-10 h-10 transition-all hover:bg-purple-800 hover:scale-110 hidden md:flex"
            sx={{ 
              backgroundColor: 'rgba(107, 33, 168, 0.9)',
              '&:hover': { backgroundColor: 'rgba(107, 33, 168, 1)' }
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        )}
      </Container>
      
      <Box className="flex justify-center items-center gap-3 mt-8 p-4">
        {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => {
          let dotIndex = i
          if (totalPages > 3) {
            let startIndex = Math.max(0, currentPage - 1)
            let endIndex = Math.min(totalPages - 1, startIndex + 2)
            if (endIndex === totalPages - 1) {
              startIndex = Math.max(0, endIndex - 2)
            }
            dotIndex = startIndex + i
          }
          
          return (
            <button
              key={dotIndex}
              onClick={() => scrollToPage(dotIndex)}
              className={`h-3 rounded-full border-none cursor-pointer transition-all hover:bg-gray-400 hover:scale-125 p-0
                ${currentPage === dotIndex ? 'w-8 bg-purple-900' : 'w-3 bg-gray-300'}`}
              aria-label={`Go to page ${dotIndex + 1}`}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default FeaturedEvents
