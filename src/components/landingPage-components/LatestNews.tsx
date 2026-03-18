import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom' // 1. Import Link for routing
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import NewsCard from '../cards/NewsCard'
import { useNews } from '../../hooks/useCMS'
import ErrorBoundary from '../common/ErrorBoundary'

const CARDS_PER_VIEW = 3
const AUTO_SCROLL_INTERVAL = 60_000

// Fallback data
const fallbackNews = [
  {
    id: 'fallback-1',
    documentId: 'fallback-1',
    title: 'Welcome to APF News',
    description: 'Stay updated with the latest news and insights from the accounting profession.',
    image: '/images/Hero.jpg',
    tag: 'Announcement',
    readTime: '2 min read',
    date: new Date().toISOString().split('T')[0]
  }
]

function LatestNews() {
  const { elementRef, isVisible } = useScrollAnimation()
  const { news, loading, error } = useNews()

  const [cardsVisible, setCardsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const autoScrollTimerRef = useRef<ReturnType<typeof window.setInterval> | null>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const sourceNews = news.length > 0 ? news : fallbackNews;
  
  const displayNews = sourceNews.slice(0, 6).map((item, index) => ({
    ...item,
    image: item.image && item.image !== '/images/placeholder.jpg' 
      ? item.image 
      : `/images/${['Hero.jpg', 'events.jpg', 'annual.png', 'Digital.jpg', 'Ethics.jpg', 'Tax.jpg'][index % 6]}`,
    tag: item.category || item.tag || 'News',
   
    description: typeof item.description === 'string' 
      ? item.description 
      : Array.isArray(item.content) 
        ? item.content[0]?.children?.[0]?.text || 'Read more...'
        : 'Read the latest updates from APF Uganda.',
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

  const startAutoScroll = () => {
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current)
    // Only auto-scroll if we have more than 4 news items
    if (displayNews.length > 4) {
      autoScrollTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
      }, AUTO_SCROLL_INTERVAL)
    }
  }

  useEffect(() => {
    if (!isMobile) startAutoScroll()
    return () => { if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current) }
  }, [isMobile, maxIndex, displayNews.length])

  const handleTouchEnd = () => {
    if (!isMobile) return
    const swipeDistance = touchStartX.current - touchEndX.current
    if (swipeDistance > 50) setMobileIndex((prev) => Math.min(prev + 1, displayNews.length - 1))
    else if (swipeDistance < -50) setMobileIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <ErrorBoundary fallback={<div className="p-10 text-center">News Unavailable</div>}>
     
      <section className="bg-purple-300 py-16 font-montserrat">
        <div className="max-w-6xl mx-auto px-6 relative">
          <h2 ref={elementRef} className={`text-center text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
            Latest News & Insights
          </h2>

          {!loading && !error && displayNews.length > 0 && (
            <>
              {/* Mobile View */}
              <div className="sm:hidden">
                {displayNews.length > 1 ? (
                  <div className="overflow-hidden" onTouchStart={(e) => touchStartX.current = e.touches[0].clientX} onTouchMove={(e) => touchEndX.current = e.touches[0].clientX} onTouchEnd={handleTouchEnd}>
                    <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${mobileIndex * 100}%)` }}>
                      {displayNews.map((item, index) => (
                        <div key={item.documentId || index} className="w-full flex-shrink-0 px-2">
                          <Link to={`/news/${item.documentId || item.id}`}>
                            <NewsCard {...item} delay={0} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Single card - no scrolling needed
                  <div className="px-2">
                    {displayNews.map((item, index) => (
                      <div key={item.documentId || index}>
                        <Link to={`/news/${item.documentId || item.id}`}>
                          <NewsCard {...item} delay={0} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block relative">
                {/* Left Arrow - Show only if more than 4 news items */}
                {displayNews.length > 4 && (
                  <button 
                    onClick={() => setCurrentIndex(p => Math.max(p - 1, 0))} 
                    disabled={currentIndex === 0} 
                    className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white w-11 h-11 rounded-full shadow flex items-center justify-center hover:scale-110 transition disabled:opacity-40 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                <div className="overflow-hidden">
                  <div 
                    className={`flex transition-transform duration-500 ease-out ${
                      displayNews.length <= 4 ? 'justify-start gap-6' : ''
                    }`} 
                    style={displayNews.length > 4 ? { transform: `translateX(-${currentIndex * (100 / 3)}%)` } : {}}
                  >
                    {displayNews.map((item, index) => (
                      <div 
                        key={item.documentId || index} 
                        className={displayNews.length <= 4 ? 'flex-shrink-0 w-full max-w-[300px]' : 'w-1/3 flex-shrink-0 px-3'}
                      >
                        <Link to={`/news/${item.documentId || item.id}`} className="block h-full">
                          <NewsCard {...item} delay={cardsVisible ? (index % 3) * 150 : 0} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Arrow - Show only if more than 4 news items */}
                {displayNews.length > 4 && (
                  <button 
                    onClick={() => setCurrentIndex(p => Math.min(p + 1, maxIndex))} 
                    disabled={currentIndex >= maxIndex} 
                    className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white w-11 h-11 rounded-full shadow flex items-center justify-center hover:scale-110 transition disabled:opacity-40 z-10"
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

export default LatestNews