import { Box, Container, Typography, Card, CardContent, CardMedia, TextField, Button, Chip } from '@mui/material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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
    <Box>
      <Navbar />
      
      {/* Hero Section */}
      <Box className="bg-gradient-to-r from-purple-600 to-purple-800 py-20 px-8 text-center">
        <Typography variant="h2" className="text-white text-5xl font-bold">
          News & Insights
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" className="py-16">
        {/* Top Pick Section */}
        <Box className="mb-16">
          <Typography variant="h4" className="text-secondary text-3xl font-bold mb-8">
            Our Latest News: Top Pick
          </Typography>
          <Card className="overflow-hidden shadow-lg">
            <Box className="grid grid-cols-1 md:grid-cols-12">
              <Box className="md:col-span-7">
                <CardContent className="p-8">
                  <Chip 
                    label={featuredArticle.category}
                    className="bg-purple-100 text-primary font-semibold mb-4"
                    sx={{ backgroundColor: '#e9d5ff', color: '#7c3aed' }}
                  />
                  <Typography variant="h4" className="text-secondary text-2xl font-bold mb-3">
                    {featuredArticle.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-4">
                    By {featuredArticle.author} • {featuredArticle.date}
                  </Typography>
                  <Typography variant="body1" className="text-gray-700 leading-relaxed mb-6">
                    {featuredArticle.excerpt}
                  </Typography>
                  <Button 
                    variant="contained"
                    className="bg-primary text-white px-6 py-2 rounded-full font-semibold transition-all hover:bg-primary-dark normal-case"
                    sx={{ 
                      backgroundColor: '#7c3aed',
                      '&:hover': { backgroundColor: '#6d28d9' }
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Box>
              <Box className="md:col-span-5">
                <Box 
                  className="h-full min-h-[300px] bg-cover bg-center"
                  sx={{ backgroundImage: `url(${featuredArticle.image})` }}
                />
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Other News Section */}
        <Box className="mb-16">
          <Typography variant="h4" className="text-secondary text-3xl font-bold mb-8">
            Our Other News
          </Typography>
          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {newsArticles.map((article) => (
              <Card key={article.id} className="h-full shadow-md transition-all hover:-translate-y-2 hover:shadow-xl">
                <CardMedia
                  component="div"
                  className="h-48 bg-cover bg-center"
                  sx={{ backgroundImage: `url(${article.image})` }}
                />
                <CardContent className="p-6">
                  <Chip 
                    label={article.category}
                    size="small"
                    className="bg-purple-100 text-primary font-semibold mb-3"
                    sx={{ backgroundColor: '#e9d5ff', color: '#7c3aed' }}
                  />
                  <Typography variant="h6" className="text-secondary text-lg font-semibold mb-2">
                    {article.title}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 block mb-3">
                    By {article.author} • {article.date}
                  </Typography>
                  <Typography variant="body2" className="text-gray-700 mb-4">
                    {article.excerpt}
                  </Typography>
                  <Button 
                    variant="text"
                    className="text-primary font-semibold p-0 normal-case hover:underline"
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Newsletter Section */}
        <Box 
          className="py-12 px-8 rounded-xl text-center"
          sx={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #f3e8ff 100%)' }}
        >
          <Typography variant="h4" className="text-secondary text-3xl font-bold mb-4">
            Never Miss an Update
          </Typography>
          <Typography variant="body1" className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest news, insights, and professional development opportunities.
          </Typography>
          <Box className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <TextField
              type="email"
              placeholder="Enter your email address"
              variant="outlined"
              fullWidth
              className="bg-white rounded-full"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  backgroundColor: 'white',
                }
              }}
            />
            <Button 
              variant="contained"
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold whitespace-nowrap transition-all hover:bg-primary-dark normal-case"
              sx={{ 
                backgroundColor: '#7c3aed',
                '&:hover': { backgroundColor: '#6d28d9' }
              }}
            >
              Subscribe to Newsletter
            </Button>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default NewsPage
