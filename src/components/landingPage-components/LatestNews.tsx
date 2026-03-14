import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import NewsCard from '../cards/NewsCard'
import { useNews } from '../../hooks/useCMS'
import ErrorBoundary from '../common/ErrorBoundary'

const CARDS_PER_VIEW = 3
const AUTO_SCROLL_INTERVAL = 60_000

// Fallback data when CMS is unavailable
const fallbackNews = [
  {
    id: 'fallback-1',
    title: 'Welcome to APF News',
    description: 'Stay updated with the latest news and insights from the accounting profession.',
    image: '/images/Hero.jpg', // Use existing image
    tag: 'Announcement',
    readTime: '2 min read',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'fallback-2', 
    title: 'Professional Development Opportunities',
    description: 'Explore continuous learning opportunities to advance your accounting career.',
    image: '/images/events.jpg', // Use existing image
    tag: 'Professional Development',
    readTime: '3 min read',
    date: new Date().toISOString().split('T')[0]
  }
]

function LatestNews() {
  const { elementRef, isVisible } = useScrollAnimation()
  
  // Fetch news from CMS
  const { news, loading, error } = useNews()

  const [cardsVisible, setCardsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const autoScrollTimerRef =  useRef<ReturnType<typeof window.setInterval> | null>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Use the latest 6 news items and format them for the NewsCard component
  // Fall back to dummy data if CMS is unavailable
  const sourceNews = news.length > 0 ? news : fallbackNews;
  const displayNews = sourceNews.slice(0, 6).map((item, index) => ({
    ...item,
    // Better image fallback logic
    image: item.image && item.image !== '/images/placeholder.jpg' 
      ? item.image 
      : `/images/${['Hero.jpg', 'events.jpg', 'annual.png', 'Digital.jpg', 'Ethics.jpg', 'Tax.jpg'][index % 6]}`,
    tag: item.category || item.tag || 'News',
    // Ensure description is always a string, not an object
    description: typeof item.content === 'string' 
      ? item.content 
      : typeof item.description === 'string' 
        ? item.description 
        : Array.isArray(item.content) 
          ? item.content.map((block: any) => 
              typeof block === 'string' ? block : 
              block?.children?.map((child: any) => child?.text || '').join('') || ''
            ).join(' ') 
          : item.description || 'No description available',
    readTime: item.readTime || '5 min read'
  }))
  const maxIndex = Math.max(0, displayNews.length - CARDS_PER_VIEW)


  useEffect(() => {
    if (!isVisible) return
    const timeout = setTimeout(() => setCardsVisible(true), 200)
    return () => clearTimeout(timeout)
  }, [isVisible])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile auto-scroll
  useEffect(() => {
    if (!isMobile || displayNews.length === 0) return
    const interval = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % displayNews.length)
    }, AUTO_SCROLL_INTERVAL)
    return () => clearInterval(interval)
  }, [isMobile, displayNews.length])

  // Desktop auto-scroll
  useEffect(() => {
    if (isMobile) return
    startAutoScroll()
    return clearAutoScroll
  }, [isMobile, maxIndex])

 

  const clearAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
      autoScrollTimerRef.current = null
    }
  }

  const startAutoScroll = () => {
    clearAutoScroll()
    autoScrollTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, AUTO_SCROLL_INTERVAL)
  }

  const resetAutoScroll = () => {
    if (!isMobile) startAutoScroll()
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    resetAutoScroll()
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
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
    if (swipeDistance > 50) {
      setMobileIndex((prev) => Math.min(prev + 1, news.length - 1))
    } else if (swipeDistance < -50) {
      setMobileIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  return (
    <ErrorBoundary fallback={
      <section className="bg-purple-300 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-white text-3xl font-bold mb-8">Latest News & Insights</h2>
          <p className="text-white">News content is temporarily unavailable. Please check back later.</p>
        </div>
      </section>
    }>
      <section className="bg-purple-300 py-16">
      <div className="max-w-6xl mx-auto px-6 relative">
        <h2
          ref={elementRef}
          className={`text-center text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          Latest News & Insights
        </h2>

        {loading && (
          <div className="text-center py-8 text-white">
            Loading latest news...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-200">
            Failed to load news. Please try again later.
          </div>
        )}

        {!loading && !error && displayNews.length === 0 && (
          <div className="text-center py-8 text-white">
            No news articles available at the moment.
          </div>
        )}

        {!loading && !error && displayNews.length > 0 && (
          <>
            {/*  Mobile View  */}
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
                  {displayNews.map((item, index) => (
                    <div key={item.id || index} className="w-full flex-shrink-0 px-2">
                      <NewsCard {...item} delay={0} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setMobileIndex((p) => Math.max(p - 1, 0))}
                  className="bg-white w-10 h-10 rounded-full shadow flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() =>
                    setMobileIndex((p) => Math.min(p + 1, displayNews.length - 1))
                  }
                  className="bg-white w-10 h-10 rounded-full shadow flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/*  Desktop View  */}
            <div className="hidden sm:block relative">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute -left-12 top-1/2 -translate-y-1/2
                           bg-white w-11 h-11 rounded-full shadow
                           flex items-center justify-center
                           hover:scale-110 transition
                           disabled:opacity-40"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
                >
                  {displayNews.map((item, index) => (
                    <div key={item.id || index} className="w-1/3 flex-shrink-0 px-3">
                      <NewsCard
                        {...item}
                        delay={cardsVisible ? (index % 3) * 150 : 0}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute -right-12 top-1/2 -translate-y-1/2
                           bg-white w-11 h-11 rounded-full shadow
                           flex items-center justify-center
                           hover:scale-110 transition
                           disabled:opacity-40"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
    </ErrorBoundary>
  )
}

export default LatestNews
