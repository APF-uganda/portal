import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import NewsCard from '../cards/NewsCard'
import news1Img from '../../assets/images/landingPage-image/news1.webp'
import news2Img from '../../assets/images/landingPage-image/news2.webp'
import news3Img from '../../assets/images/landingPage-image/news3.png'

interface NewsItem {
  image: string
  tag: string
  title: string
  description: string
  date: string
  readTime: string
}

function LatestNews() {
  const { elementRef, isVisible } = useScrollAnimation()
  const [cardsVisible, setCardsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const news: NewsItem[] = [
    {
      image: news1Img,
      tag: 'Thought Leadership',
      title: 'The Future of Accountancy: Embracing Digital Transformation',
      description: 'Digital tools are revolutionizing the accounting landscape. Explore how AI, blockchain, and cloud accounting practices are revolutionizing accounting practices and what it means for professionals.',
      date: 'October 18, 2024',
      readTime: '7 min read'
    },
    {
      image: news2Img,
      tag: 'Ethics & Governance',
      title: 'Strengthening Ethical Frameworks in Public Practice',
      description: 'A deep dive into the importance of ethical conduct in maintaining public trust and the role of APF in fostering integrity within the profession.',
      date: 'October 10, 2024',
      readTime: '5 min read'
    },
    {
      image: news3Img,
      tag: 'Announcements',
      title: 'Highlights from the Annual CPD Conference 2024',
      description: 'Recap of the key takeaways, insightful sessions, and networking opportunities from our recent successful CPD conference.',
      date: 'September 28, 2024',
      readTime: '5 min read'
    }
  ]

  const totalPages = news.length

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

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
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

    if (swipeDistance > minSwipeDistance && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    } else if (swipeDistance < -minSwipeDistance && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <section className="bg-purple-300 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <h2 
          ref={elementRef}
          className={`text-center text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 transform px-4 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          Latest News & Insights
        </h2>
        
        <div className="relative">
          {/* Desktop Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className={`hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 w-10 h-10 xl:w-12 xl:h-12 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 transition-all duration-300 items-center justify-center -ml-4 xl:-ml-6 active:scale-95 ${
              cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: cardsVisible ? '600ms' : '0ms' }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 xl:w-6 xl:h-6" />
          </button>

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
                {news.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <NewsCard
                      image={item.image}
                      tag={item.tag}
                      title={item.title}
                      description={item.description}
                      date={item.date}
                      readTime={item.readTime}
                      onReadMore={() => console.log('Read more:', item.title)}
                      delay={0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tablet & Desktop Grid View */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {news.map((item, index) => (
              <NewsCard
                key={index}
                image={item.image}
                tag={item.tag}
                title={item.title}
                description={item.description}
                date={item.date}
                readTime={item.readTime}
                onReadMore={() => console.log('Read more:', item.title)}
                delay={cardsVisible ? index * 150 : 0}
              />
            ))}
          </div>

          {/* Desktop Navigation Arrows */}
          <button
            onClick={handleNext}
            className={`hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 w-10 h-10 xl:w-12 xl:h-12 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 transition-all duration-300 items-center justify-center -mr-4 xl:-mr-6 active:scale-95 ${
              cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: cardsVisible ? '600ms' : '0ms' }}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 xl:w-6 xl:h-6" />
          </button>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex sm:hidden justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrevious}
            className="bg-white text-gray-700 w-10 h-10 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all duration-300 flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Pagination Dots for Mobile */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentPage === index 
                    ? 'w-6 bg-purple-700 shadow-md' 
                    : 'w-1.5 bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={handleNext}
            className="bg-white text-gray-700 w-10 h-10 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all duration-300 flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default LatestNews
