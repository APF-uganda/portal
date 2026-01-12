import { useState, useRef } from 'react'
import { Box, Container, Typography, IconButton } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

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

  const handleReadMore = (newsTitle: string) => {
    console.log('Read more:', newsTitle)
  }

  const scrollToNext = () => {
    if (currentIndex < news.length - 3) {
      setCurrentIndex(currentIndex + 1)
      scrollToIndex(currentIndex + 1)
    }
  }

  const scrollToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      scrollToIndex(currentIndex - 1)
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.scrollWidth / news.length
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      })
    }
  }

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
          px: { xs: 6, md: 8 },
        }}
      >
        <IconButton
          onClick={scrollToPrev}
          disabled={currentIndex === 0}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            backgroundColor: 'white',
            width: 40,
            height: 40,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            opacity: currentIndex === 0 ? 0.3 : 1,
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            '&:hover:not(:disabled)': {
              backgroundColor: '#7c3aed',
              color: 'white',
              transform: 'translateY(-50%) scale(1.1)',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        
        <Box 
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: 4,
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
            p: 2,
          }}
        >
          {news.map((item, index) => (
            <Box 
              key={index}
              sx={{
                flexShrink: 0,
                flexGrow: 0,
                flexBasis: {
                  xs: '100%',
                  md: 'calc(50% - 16px)',
                  lg: 'calc(33.333% - 21.33px)',
                },
                minWidth: {
                  xs: '100%',
                  md: 'calc(50% - 16px)',
                  lg: 'calc(33.333% - 21.33px)',
                },
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
        
        <IconButton
          onClick={scrollToNext}
          disabled={currentIndex >= news.length - 3}
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            backgroundColor: 'white',
            width: 40,
            height: 40,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            opacity: currentIndex >= news.length - 3 ? 0.3 : 1,
            cursor: currentIndex >= news.length - 3 ? 'not-allowed' : 'pointer',
            '&:hover:not(:disabled)': {
              backgroundColor: '#7c3aed',
              color: 'white',
              transform: 'translateY(-50%) scale(1.1)',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Container>
    </Box>
  )
}

export default LatestNews
