import './LatestNews.css'
import news1Img from '../assets/news1.webp'
import news2Img from '../assets/news2.webp'
import news3Img from '../assets/news3.png'

interface NewsItem {
  image: string
  tag: string
  title: string
  description: string
  date: string
  readTime: string
}

function LatestNews() {
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
    }
  ]

  return (
    <section className="news">
      <h2>Latest News & Insights</h2>
      <div className="news-slider">
        <button className="slider-btn prev">‹</button>
        <div className="news-grid">
          {news.map((item, index) => (
            <div key={index} className="news-card">
              <img src={item.image} alt={item.title} />
              <span className="news-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="news-date">{item.date} • {item.readTime}</p>
              <button className="read-more" onClick={() => console.log('Navigate to article')}>Read More</button>
            </div>
          ))}
        </div>
        <button className="slider-btn next">›</button>
      </div>
    </section>
  )
}

export default LatestNews
