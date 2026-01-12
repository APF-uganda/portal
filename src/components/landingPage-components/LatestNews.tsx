import { useState, useRef, useEffect } from 'react'
import { Box, Container, Typography, IconButton } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
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
    <Box 
      component="section" 
      sx={{
        backgroundColor: '#e9d5ff',
        py: 8,
        px: 4,
      }}
    >
      <Typography 
        ref={elementRef}
        variant="h4" 
        sx={{
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: '2rem',
          mb: 6,
          fontWeight: 'bold',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
          animation: isVisible ? 'fadeIn 0.8s ease-out' : 'none',
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
        }}
      >
        Latest News & Insights
      </Typography>
      <Container 
        maxWidth="lg" 
        sx={{
          position: 'relative',
          overflow: 'hidden',
          userSelect: 'none',
          px: { xs: 2, md: 3 },
        }}
      >
        {currentPage > 0 && (
          <IconButton
            onClick={() => scrollToPage(currentPage - 1)}
            sx={{
              position: 'absolute',
              left: { xs: '2%', md: '-20px' },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'white',
              color: '#7c3aed',
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#7c3aed',
                color: 'white',
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
              },
            }}
          >
            <ArrowBackIosNewIcon fontSize="medium" />
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
          sx={{
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <Box 
            sx={{
              display: 'flex',
              gap: { xs: 2, md: 4 },
              transition: 'transform 0.5s ease-in-out',
              pb: 2,
              transform: { xs: `translateX(-${currentPage * 100}%)`, md: 'translateX(0)' },
              pointerEvents: isDragging ? 'none' : 'auto',
            }}
          >
            {news.map((item, index) => (
              <Box 
                key={index}
                sx={{
                  flex: { xs: '0 0 100%', md: `0 0 calc(${100 / newsPerPage}% - ${(newsPerPage - 1) * 32 / newsPerPage}px)` },
                  minWidth: 0,
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
              </Box>
            ))}
          </Box>
        </Box>
        
        {currentPage < totalPages - 1 && (
          <IconButton
            onClick={() => scrollToPage(currentPage + 1)}
            sx={{
              position: 'absolute',
              right: { xs: '2%', md: '-20px' },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'white',
              color: '#7c3aed',
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#7c3aed',
                color: 'white',
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
              },
            }}
          >
            <ArrowForwardIosIcon fontSize="medium" />
          </IconButton>
        )}
      </Container>
      
      <Box 
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
          mt: 4,
          p: 2,
        }}
      >
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
            <Box
              key={dotIndex}
              component="button"
              onClick={() => scrollToPage(dotIndex)}
              sx={{
                height: 12,
                width: currentPage === dotIndex ? 32 : 12,
                borderRadius: currentPage === dotIndex ? '6px' : '50%',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                p: 0,
                backgroundColor: currentPage === dotIndex ? '#6b21a8' : '#cbd5e1',
                '&:hover': {
                  backgroundColor: '#94a3b8',
                  transform: 'scale(1.2)',
                },
              }}
              aria-label={`Go to page ${dotIndex + 1}`}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default LatestNews
