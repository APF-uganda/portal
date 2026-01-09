import { useState, useRef } from 'react'
import '../../assets/css/LatestNews.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import NewsCard from '../cards/NewsCard'
import news1Img from '../../assets/images/news1.webp'
import news2Img from '../../assets/images/news2.webp'
import news3Img from '../../assets/images/news3.png'

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
    {
      image: news1Img,
      tag: 'Sustainability',
      title: 'ESG Reporting: The New Frontier for Accountants',
      description: 'Learn about environmental, social, and governance reporting standards and how they impact the accounting profession.',
      date: 'August 5, 2024',
      readTime: '5 min read'
    },
    {
      image: news2Img,
      tag: 'Career Development',
      title: 'Building a Successful Career in Public Practice',
      description: 'Expert advice on career progression, skill development, and networking strategies for accounting professionals.',
      date: 'July 25, 2024',
      readTime: '6 min read'
    }
  ]

  const handleReadMore = (newsTitle: string) => {
    console.log('Read more:', newsTitle)
    // Add navigation logic here
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
    <section className="news">
      <h2 
        ref={elementRef}
        className={`scroll-animate-heading ${isVisible ? 'visible' : ''}`}
      >
        Latest News & Insights
      </h2>
      <div className="news-slider">
        <button 
          className={`slider-btn prev ${currentIndex === 0 ? 'disabled' : ''}`}
          onClick={scrollToPrev}
          disabled={currentIndex === 0}
          aria-label="Previous news"
        >
          ‹
        </button>
        <div className="news-grid" ref={scrollContainerRef}>
          {news.map((item, index) => (
            <NewsCard
              key={index}
              image={item.image}
              tag={item.tag}
              title={item.title}
              description={item.description}
              date={item.date}
              readTime={item.readTime}
              onReadMore={() => handleReadMore(item.title)}
            />
          ))}
        </div>
        <button 
          className={`slider-btn next ${currentIndex >= news.length - 3 ? 'disabled' : ''}`}
          onClick={scrollToNext}
          disabled={currentIndex >= news.length - 3}
          aria-label="Next news"
        >
          ›
        </button>
      </div>
    </section>
  )
}

export default LatestNews
