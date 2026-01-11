import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../assets/css/NewsPage.css'

function NewsPage() {
  const newsArticles = [
    {
      id: 1,
      title: "The Future of Accounting: Embracing Digital Transformation",
      excerpt: "Explore how digital technologies are reshaping the accounting profession and what it means for practitioners.",
      category: "Technology",
      date: "Dec 15, 2023",
      author: "Sarah Johnson",
      image: "/public/news1.webp",
      featured: false
    },
    {
      id: 2,
      title: "Strengthening Ethical Frameworks in Public Practice",
      excerpt: "Understanding the importance of ethical standards and their implementation in modern accounting practices.",
      category: "Ethics",
      date: "Dec 12, 2023", 
      author: "Michael Chen",
      image: "/public/news2.webp",
      featured: false
    },
    {
      id: 3,
      title: "Highlights from the Annual CPD Conference 2023",
      excerpt: "Key takeaways and insights from our recent continuing professional development conference.",
      category: "Events",
      date: "Dec 10, 2023",
      author: "Emma Wilson",
      image: "/public/news3.png",
      featured: false
    },
    {
      id: 4,
      title: "Financial Strategies for Sustainable SME Growth in 2024",
      excerpt: "Practical financial planning approaches to help small and medium enterprises achieve sustainable growth.",
      category: "Business",
      date: "Dec 8, 2023",
      author: "David Rodriguez",
      image: "/public/event1.jpg",
      featured: false
    },
    {
      id: 5,
      title: "Understanding IFRS 16: Impact on Insurance Reporting",
      excerpt: "A comprehensive guide to the latest International Financial Reporting Standards and their implications.",
      category: "Standards",
      date: "Dec 5, 2023",
      author: "Lisa Thompson",
      image: "/public/event2.jpeg",
      featured: false
    },
    {
      id: 6,
      title: "Member Spotlight: Outstanding Professional Achievement Awards",
      excerpt: "Celebrating the exceptional contributions of our members to the accounting profession.",
      category: "Members",
      date: "Dec 3, 2023",
      author: "James Parker",
      image: "/public/event3.jpeg",
      featured: false
    }
  ];

  const featuredArticle = {
    id: 0,
    title: "Navigating the New Tax Regime: Key Considerations for Practitioners",
    excerpt: "The recent changes in tax legislation have introduced new complexities for accounting professionals. This comprehensive guide explores the key considerations, implementation strategies, and best practices for navigating the updated tax framework effectively.",
    category: "Tax Updates",
    date: "Dec 18, 2023",
    author: "Robert Anderson",
    image: "/public/news1.webp",
    featured: true
  };

  return (
    <div className="news-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="news-hero">
        <h1>News & Insights</h1>
      </section>

      {/* Main Content */}
      <main className="news-content">
        <div className="container">
          {/* Top Pick Section */}
          <section className="top-pick-section">
            <h2 className="section-title">Our Latest News: Top Pick</h2>
            <div className="top-pick-card">
              <div className="top-pick-content">
                <span className="category-tag">{featuredArticle.category}</span>
                <h2>{featuredArticle.title}</h2>
                <div className="article-meta">
                  By {featuredArticle.author} • {featuredArticle.date}
                </div>
                <p className="article-excerpt">{featuredArticle.excerpt}</p>
                <a href="#" className="read-more-btn">Read More</a>
              </div>
              <div className="top-pick-image"></div>
            </div>
          </section>

          {/* Other News Section */}
          <section className="other-news-section">
            <h2 className="section-title">Our Other News</h2>
            <div className="news-grid">
              {newsArticles.map((article) => (
                <article key={article.id} className="news-card">
                  <div 
                    className="news-card-image"
                    style={{ backgroundImage: `url(${article.image})` }}
                  ></div>
                  <div className="news-card-content">
                    <span className="category-tag">{article.category}</span>
                    <h3>{article.title}</h3>
                    <div className="article-meta">
                      By {article.author} • {article.date}
                    </div>
                    <p className="article-excerpt">{article.excerpt}</p>
                    <a href="#" className="read-more-btn">Read More</a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="newsletter-section">
            <div className="newsletter-content">
              <h2>Never Miss an Update</h2>
              <p>Subscribe to our newsletter for the latest news, insights, and professional development opportunities.</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe to Newsletter
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NewsPage
