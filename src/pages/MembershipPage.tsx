import { Box, Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ConstructionIcon from '@mui/icons-material/Construction'

function MembershipPage() {
  return (
    <Box>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#f9fafb', 
          py: 8, 
          px: 4 
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <ConstructionIcon sx={{ fontSize: 100, color: '#7c3aed', mb: 4 }} />
          <Typography variant="h2" sx={{ color: '#1e293b', fontSize: '2.25rem', fontWeight: 'bold', mb: 2 }}>
            Membership
          </Typography>
          <Typography variant="h5" sx={{ color: '#374151', mb: 1 }}>
            This page is currently under development
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280', mb: 4 }}>
            We're working hard to bring you this content soon!
          </Typography>
          <Button 
            component={Link}
            to="/"
            variant="contained"
            sx={{ 
              backgroundColor: '#7c3aed',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '25px',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s',
              '&:hover': { 
                backgroundColor: '#6d28d9',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Back to Home
          </Button>
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}

export default MembershipPage
