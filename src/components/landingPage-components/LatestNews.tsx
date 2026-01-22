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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollTimerRef = useRef<number | null>(null)
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
    },
    {
      image: news1Img,
      tag: 'Industry Insights',
      title: 'Navigating Tax Compliance in 2026',
      description: 'Expert insights on the latest tax regulations and how they impact accounting professionals and their clients.',
      date: 'September 15, 2024',
      readTime: '6 min read'
    },
    {
      image: news2Img,
      tag: 'Member Spotlight',
      title: 'Success Stories from Our Community',
      description: 'Celebrating the achievements of our members and their contributions to the accounting profession.',
      date: 'September 5, 2024',
      readTime: '4 min read'
    },
    {
      image: news3Img,
      tag: 'Professional Development',
      title: 'Continuous Learning: The Key to Career Growth',
      description: 'Discover how ongoing professional development can enhance your career prospects and expertise.',
      date: 'August 28, 2024',
      readTime: '5 min read'
    }
  ]

  const cardsPerView = 3
  const maxIndex = Math.max(0, news.length - cardsPerView)

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
      setMobileIndex((prev) => (prev + 1) % news.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [news.length, isMobile])

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

    if (swipeDistance > minSwipeDistance && mobileIndex < news.length - 1) {
      setMobileIndex(mobileIndex + 1)
    } else if (swipeDistance < -minSwipeDistance && mobileIndex > 0) {
      setMobileIndex(mobileIndex - 1)
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
          
          {/* Mobile Navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setMobileIndex((prev) => Math.max(0, prev - 1))}
              className="bg-white text-gray-700 w-10 h-10 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all duration-300 flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Pagination Dots for Mobile */}
            <div className="flex items-center gap-2">
              {Array.from({ length: news.length }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setMobileIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    mobileIndex === index 
                      ? 'w-6 bg-purple-700 shadow-md' 
                      : 'w-1.5 bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setMobileIndex((prev) => Math.min(news.length - 1, prev + 1))}
              className="bg-white text-gray-700 w-10 h-10 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all duration-300 flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
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
              {news.map((item, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0"
                  style={{ width: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})` }}
                >
                  <NewsCard
                    image={item.image}
                    tag={item.tag}
                    title={item.title}
                    description={item.description}
                    date={item.date}
                    readTime={item.readTime}
                    onReadMore={() => console.log('Read more:', item.title)}
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
                    : 'w-1.5 sm:w-2 bg-white/60 hover:bg-white/80'
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

export default LatestNews
