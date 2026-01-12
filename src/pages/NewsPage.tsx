import { Box, Container, Typography, Card, CardContent, CardMedia, TextField, Button, Chip } from '@mui/material'
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
    <Box>
      <Navbar />
      
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(90deg, #7c3aed 0%, #6b21a8 100%)', 
        py: 10, 
        px: 4, 
        textAlign: 'center' 
      }}>
        <Typography variant="h2" sx={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
          News & Insights
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Top Pick Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ color: '#1e293b', fontSize: '1.875rem', fontWeight: 'bold', mb: 4 }}>
            Our Latest News: Top Pick
          </Typography>
          <Card sx={{ overflow: 'hidden', boxShadow: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' } }}>
              <Box>
                <CardContent sx={{ p: 4 }}>
                  <Chip 
                    label={featuredArticle.category}
                    sx={{ backgroundColor: '#e9d5ff', color: '#7c3aed', fontWeight: 600, mb: 2 }}
                  />
                  <Typography variant="h4" sx={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 'bold', mb: 1.5 }}>
                    {featuredArticle.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                    By {featuredArticle.author} • {featuredArticle.date}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.7, mb: 3 }}>
                    {featuredArticle.excerpt}
                  </Typography>
                  <Button 
                    variant="contained"
                    sx={{ 
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      px: 3,
                      py: 1,
                      borderRadius: '25px',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s',
                      '&:hover': { backgroundColor: '#6d28d9' }
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Box>
              <Box sx={{ 
                height: '100%', 
                minHeight: '300px', 
                backgroundImage: `url(${featuredArticle.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
            </Box>
          </Card>
        </Box>

        {/* Other News Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ color: '#1e293b', fontSize: '1.875rem', fontWeight: 'bold', mb: 4 }}>
            Our Other News
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
            gap: 4 
          }}>
            {newsArticles.map((article) => (
              <Card 
                key={article.id} 
                sx={{ 
                  height: '100%', 
                  boxShadow: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="div"
                  sx={{ 
                    height: 192, 
                    backgroundImage: `url(${article.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Chip 
                    label={article.category}
                    size="small"
                    sx={{ backgroundColor: '#e9d5ff', color: '#7c3aed', fontWeight: 600, mb: 1.5 }}
                  />
                  <Typography variant="h6" sx={{ color: '#1e293b', fontSize: '1.125rem', fontWeight: 600, mb: 1 }}>
                    {article.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1.5 }}>
                    By {article.author} • {article.date}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#374151', mb: 2 }}>
                    {article.excerpt}
                  </Typography>
                  <Button 
                    variant="text"
                    sx={{ 
                      color: '#7c3aed', 
                      fontWeight: 600, 
                      p: 0, 
                      textTransform: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Newsletter Section */}
        <Box sx={{ 
          py: 6, 
          px: 4, 
          borderRadius: '12px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #e9d5ff 0%, #f3e8ff 100%)'
        }}>
          <Typography variant="h4" sx={{ color: '#1e293b', fontSize: '1.875rem', fontWeight: 'bold', mb: 2 }}>
            Never Miss an Update
          </Typography>
          <Typography variant="body1" sx={{ color: '#374151', mb: 3, maxWidth: '672px', mx: 'auto' }}>
            Subscribe to our newsletter for the latest news, insights, and professional development opportunities.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            maxWidth: '576px', 
            mx: 'auto' 
          }}>
            <TextField
              type="email"
              placeholder="Enter your email address"
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  backgroundColor: 'white',
                }
              }}
            />
            <Button 
              variant="contained"
              sx={{ 
                backgroundColor: '#7c3aed',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                textTransform: 'none',
                transition: 'all 0.3s',
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
