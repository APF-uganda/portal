import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
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

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setCardsVisible(true), 200)
    }
  }, [isVisible])

  const handlePrevious = () => {
    console.log('Previous clicked')
  }

  const handleNext = () => {
    console.log('Next clicked')
  }

  return (
    <section className="bg-purple-300 py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <h2 
          ref={elementRef}
          className={`text-center text-white text-4xl font-bold mb-12 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          Latest News & Insights
        </h2>
        
        <div className="relative">
          <button
            onClick={handlePrevious}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 w-12 h-12 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 transition-all duration-300 flex items-center justify-center -ml-6 active:scale-95 ${
              cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: cardsVisible ? '600ms' : '0ms' }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
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
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded mb-3 transition-all duration-300 group-hover:bg-purple-100 group-hover:text-purple-700">
                    {item.tag}
                  </span>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 min-h-[3.5rem] transition-colors duration-300 group-hover:text-purple-700">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 min-h-[4.5rem]">
                    {item.description}
                  </p>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    {item.date} • {item.readTime}
                  </div>
                  
                  <button className="text-purple-700 font-semibold text-sm hover:underline transition-all duration-300 hover:translate-x-2 inline-flex items-center group/btn">
                    Read More
                    <span className="ml-1 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 w-12 h-12 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 transition-all duration-300 flex items-center justify-center -mr-6 active:scale-95 ${
              cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: cardsVisible ? '600ms' : '0ms' }}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default LatestNews
