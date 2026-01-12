import { Box, Container, Typography, Button } from '@mui/material'
import heroImg from '../../assets/images/landingPage-image/landing_halo-section.jpg'

function Hero() {
  return (
    <Box 
      sx={{
        height: '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '64px', // Account for navbar height
        marginTop: '-64px', // Pull up to extend behind navbar
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.2))',
          animation: 'gradientShift 8s ease infinite',
        },
        '@keyframes gradientShift': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.6 },
        },
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          textAlign: 'center',
          color: 'white',
          p: 4,
          position: 'relative',
          zIndex: 1,
          animation: 'fadeInUp 1s ease-out',
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 3,
            fontWeight: 700,
            animation: 'fadeInUp 1s ease-out 0.2s both',
          }}
        >
          Advancing Accountancy<br />Excellence in Uganda
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: { xs: '1rem', md: '1.1rem' },
            mb: 4,
            lineHeight: 1.6,
            animation: 'fadeInUp 1s ease-out 0.4s both',
          }}
        >
          The Accountancy Practitioners Forum (APF Uganda) is the leading voice for ethical practice, professional development, and policy advocacy in the Ugandan accountancy sector.
        </Typography>
        <Button 
          variant="contained"
          sx={{ 
            backgroundColor: 'white',
            color: '#2c3e50',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            borderRadius: '30px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            animation: 'fadeInUp 1s ease-out 0.6s both',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#7c3aed',
              color: 'white',
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.4)',
            }
          }}
        >
          Become a Member
        </Button>
      </Container>
    </Box>
  )
}

export default Hero
