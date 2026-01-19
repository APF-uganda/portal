import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import NewsCard from '../common/NewsCard'
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
  const [currentPage, setCurrentPage] = useState(0)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const autoScrollTimerRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [newsPerPage, setNewsPerPage] = useState(3)

  useEffect(() => {
    const updateNewsPerPage = () => {
      if (window.innerWidth <= 768) {
        setNewsPerPage(1)
      } else if (window.innerWidth <= 1024) {
        setNewsPerPage(2)
      } else {
        setNewsPerPage(3)
      }
    }

    updateNewsPerPage()
    window.addEventListener('resize', updateNewsPerPage)
    
    return () => window.removeEventListener('resize', updateNewsPerPage)
  }, [])

  const news: NewsItem[] = [
    {
      image: news1Img,
      tag: 'Thought Leadership',
      title: 'The Future of Accountancy: Embracing Digital Transformation',
      description: 'Explore how digital tools are revolutionizing the profession from AI-based audits and blockchain to cloud accounting.',
      date: 'October 18, 2024',
      readTime: '5 min read'
    },
    {
      image: news2Img,
      tag: 'Ethics & Governance',
      title: 'Strengthening Ethical Frameworks in Public Practice',
      description: 'Learn about new strategies and best practices for upholding public trust and the pillars of a strong ethical foundation.',
      date: 'October 10, 2024',
      readTime: '6 min read'
    },
    {
      image: news3Img,
      tag: 'Announcements',
      title: 'Highlights from the Annual Conference 2024',
      description: 'Exciting discussions, inspiring speakers, and networking opportunities that shaped the future of our profession.',
      date: 'September 28, 2024',
      readTime: '4 min read'
    },
    {
      image: news1Img,
      tag: 'Professional Development',
      title: 'New CPD Requirements for 2026: What You Need to Know',
      description: 'Stay compliant with the latest continuing professional development requirements and enhance your career prospects.',
      date: 'September 15, 2024',
      readTime: '7 min read'
    },
    {
      image: news2Img,
      tag: 'Industry Insights',
      title: 'Navigating Tax Reforms in Uganda: A Comprehensive Guide',
      description: 'Understanding the recent tax policy changes and their implications for accounting professionals and businesses.',
      date: 'August 30, 2024',
      readTime: '8 min read'
    },
    {
      image: news3Img,
      tag: 'Technology',
      title: 'AI in Accounting: Opportunities and Challenges',
      description: 'Discover how artificial intelligence is transforming audit processes, financial reporting, and client advisory services.',
      date: 'August 20, 2024',
      readTime: '6 min read'
    },
  ]

  const totalPages = Math.ceil(news.length / newsPerPage)

  const handleReadMore = (newsTitle: string) => {
    console.log('Read more:', newsTitle)
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

    if (!isUserScrolling && newsPerPage === 1) {
      intervalId = window.setInterval(() => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages)
      }, 10000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current)
    }
  }, [isUserScrolling, totalPages, newsPerPage])

  return (
    <section className="bg-[#e9d5ff] py-12 sm:py-16 px-4">
      <h4 
        ref={elementRef}
        className={`text-center text-secondary text-[1.75rem] sm:text-[2rem] mb-8 sm:mb-12 font-bold transition-opacity duration-800 ${
          isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'
        }`}
      >
        Latest News & Insights
      </h4>
      <div className="max-w-7xl mx-auto relative overflow-hidden select-none px-2 md:px-6">
        {currentPage > 0 && (
          <button
            onClick={() => scrollToPage(currentPage - 1)}
            className="absolute left-[2%] md:left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white text-primary w-10 h-10 md:w-[50px] md:h-[50px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-300 flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 hover:shadow-[0_4px_12px_rgba(124,58,237,0.4)]"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        <div 
          ref={containerRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          className={`overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          <div 
            className="flex gap-4 md:gap-8 transition-transform duration-500 ease-in-out pb-4"
            style={{
              transform: newsPerPage === 1 ? `translateX(-${currentPage * 100}%)` : 'translateX(0)',
              pointerEvents: isDragging ? 'none' : 'auto',
            }}
          >
            {news.map((item, index) => (
              <div 
                key={index}
                className="flex-shrink-0 min-w-0"
                style={{
                  flexBasis: newsPerPage === 1 
                    ? '100%' 
                    : `calc(${100 / newsPerPage}% - ${(newsPerPage - 1) * 32 / newsPerPage}px)`
                }}
              >
                <NewsCard
                  image={item.image}
                  tag={item.tag}
                  title={item.title}
                  description={item.description}
                  date={item.date}
                  readTime={item.readTime}
                  onReadMore={() => handleReadMore(item.title)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {currentPage < totalPages - 1 && (
          <button
            onClick={() => scrollToPage(currentPage + 1)}
            className="absolute right-[2%] md:right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white text-primary w-10 h-10 md:w-[50px] md:h-[50px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-300 flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 hover:shadow-[0_4px_12px_rgba(124,58,237,0.4)]"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
      
      <div className="flex md:hidden justify-center items-center gap-3 mt-8 p-4">
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
              className={`h-3 border-none cursor-pointer transition-all duration-300 p-0 rounded-full hover:bg-[#94a3b8] hover:scale-120 ${
                currentPage === dotIndex 
                  ? 'w-8 bg-[#6b21a8] rounded-md' 
                  : 'w-3 bg-[#cbd5e1]'
              }`}
              aria-label={`Go to page ${dotIndex + 1}`}
            />
          )
        })}
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  )
}

export default LatestNews
