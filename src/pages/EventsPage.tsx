import { Box, Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ConstructionIcon from '@mui/icons-material/Construction'

function EventsPage() {
  return (
    <Box>
      <Navbar />
      <Box component="main" className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-8">
        <Container maxWidth="md" className="text-center">
          <ConstructionIcon sx={{ fontSize: 100, color: '#7c3aed', mb: 4 }} />
          <Typography variant="h2" className="text-secondary text-4xl font-bold mb-4">
            Events
          </Typography>
          <Typography variant="h5" className="text-gray-700 mb-2">
            This page is currently under development
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-8">
            We're working hard to bring you this content soon!
          </Typography>
          <Button 
            component={Link}
            to="/"
            variant="contained"
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-primary-dark hover:-translate-y-0.5 normal-case"
            sx={{ 
              backgroundColor: '#7c3aed',
              '&:hover': { backgroundColor: '#6d28d9' }
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

export default EventsPage
