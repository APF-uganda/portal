import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

function NewsPage() {
  const newsArticles = [
    {
      id: 1,
      title: "The Future of Accounting: Embracing Digital Transformation",
      excerpt: "Explore how digital technologies are reshaping the accounting profession and what it means for practitioners.",
      category: "Technology",
      date: "Dec 15, 2023",
      author: "Sarah Johnson",
      image: "/news1.webp",
      featured: false
    },
    {
      id: 2,
      title: "Strengthening Ethical Frameworks in Public Practice",
      excerpt: "Understanding the importance of ethical standards and their implementation in modern accounting practices.",
      category: "Ethics",
      date: "Dec 12, 2023", 
      author: "Michael Chen",
      image: "/news2.webp",
      featured: false
    },
    {
      id: 3,
      title: "Highlights from the Annual CPD Conference 2023",
      excerpt: "Key takeaways and insights from our recent continuing professional development conference.",
      category: "Events",
      date: "Dec 10, 2023",
      author: "Emma Wilson",
      image: "/news3.png",
      featured: false
    },
    {
      id: 4,
      title: "Financial Strategies for Sustainable SME Growth in 2024",
      excerpt: "Practical financial planning approaches to help small and medium enterprises achieve sustainable growth.",
      category: "Business",
      date: "Dec 8, 2023",
      author: "David Rodriguez",
      image: "/event1.jpg",
      featured: false
    },
    {
      id: 5,
      title: "Understanding IFRS 16: Impact on Insurance Reporting",
      excerpt: "A comprehensive guide to the latest International Financial Reporting Standards and their implications.",
      category: "Standards",
      date: "Dec 5, 2023",
      author: "Lisa Thompson",
      image: "/event2.jpeg",
      featured: false
    },
    {
      id: 6,
      title: "Member Spotlight: Outstanding Professional Achievement Awards",
      excerpt: "Celebrating the exceptional contributions of our members to the accounting profession.",
      category: "Members",
      date: "Dec 3, 2023",
      author: "James Parker",
      image: "/event3.jpeg",
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
    image: "/news1.webp",
    featured: true
  };

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-[#6b21a8] py-20 px-4 text-center">
        <h2 className="text-white text-5xl font-bold">
          News & Insights
        </h2>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        {/* Top Pick Section */}
        <div className="mb-16">
          <h4 className="text-[#1e293b] text-[1.875rem] font-bold mb-8">
            Our Latest News: Top Pick
          </h4>
          <div className="overflow-hidden shadow-lg rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr]">
              <div className="p-8">
                <span className="inline-block bg-[#e9d5ff] text-primary font-semibold px-3 py-1 rounded-full text-sm mb-4">
                  {featuredArticle.category}
                </span>
                <h4 className="text-[#1e293b] text-2xl font-bold mb-3">
                  {featuredArticle.title}
                </h4>
                <p className="text-[#6b7280] text-sm mb-4">
                  By {featuredArticle.author} • {featuredArticle.date}
                </p>
                <p className="text-[#374151] leading-[1.7] mb-6">
                  {featuredArticle.excerpt}
                </p>
                <button className="bg-primary text-white px-6 py-2 rounded-[25px] font-semibold transition-all duration-300 hover:bg-primary-dark">
                  Read More
                </button>
              </div>
              <div 
                className="h-full min-h-[300px] bg-cover bg-center"
                style={{ backgroundImage: `url(${featuredArticle.image})` }}
              />
            </div>
          </div>
        </div>

        {/* Other News Section */}
        <div className="mb-16">
          <h4 className="text-[#1e293b] text-[1.875rem] font-bold mb-8">
            Our Other News
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {newsArticles.map((article) => (
              <div 
                key={article.id} 
                className="h-full shadow-md rounded-lg bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div 
                  className="h-48 bg-cover bg-center rounded-t-lg"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
                <div className="p-6">
                  <span className="inline-block bg-[#e9d5ff] text-primary font-semibold px-3 py-1 rounded-full text-xs mb-3">
                    {article.category}
                  </span>
                  <h6 className="text-[#1e293b] text-lg font-semibold mb-2">
                    {article.title}
                  </h6>
                  <p className="text-[#6b7280] text-xs block mb-3">
                    By {article.author} • {article.date}
                  </p>
                  <p className="text-[#374151] text-sm mb-4">
                    {article.excerpt}
                  </p>
                  <button className="text-primary font-semibold p-0 hover:underline">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 px-8 rounded-xl text-center bg-gradient-to-br from-[#e9d5ff] to-[#f3e8ff]">
          <h4 className="text-[#1e293b] text-[1.875rem] font-bold mb-4">
            Never Miss an Update
          </h4>
          <p className="text-[#374151] mb-6 max-w-[672px] mx-auto">
            Subscribe to our newsletter for the latest news, insights, and professional development opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-[576px] mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-[25px] bg-white border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-8 py-3 rounded-[25px] font-semibold whitespace-nowrap transition-all duration-300 hover:bg-primary-dark">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default NewsPage
