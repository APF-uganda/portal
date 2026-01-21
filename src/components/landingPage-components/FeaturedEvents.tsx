import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
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
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 5000)
    return () => clearInterval(interval)
  }, [totalPages])

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 
          ref={elementRef}
          className={`text-center text-gray-900 text-4xl font-bold mb-12 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          Featured Events
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event, index) => (
            <div 
              key={index}
              className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform ${
                cardsVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              } hover:-translate-y-2 group`}
              style={{ 
                transitionDelay: cardsVisible ? `${index * 150}ms` : '0ms'
              }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 min-h-[3.5rem] transition-colors duration-300 group-hover:text-purple-700">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-start gap-2 transition-transform duration-300 group-hover:translate-x-1">
                    <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-start gap-2 transition-transform duration-300 group-hover:translate-x-1">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-2 transition-transform duration-300 group-hover:translate-x-1">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6 min-h-[3rem]">
                  {event.description}
                </p>
                
                <button className="w-full bg-purple-700 text-white py-3 rounded-full font-semibold hover:bg-purple-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`flex justify-center items-center gap-2 transition-all duration-1000 ${
          cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-2 rounded-full transition-all duration-500 transform hover:scale-125 ${
                currentPage === index 
                  ? 'w-8 bg-purple-700 shadow-md' 
                  : 'w-2 bg-gray-400 hover:bg-gray-500'
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
