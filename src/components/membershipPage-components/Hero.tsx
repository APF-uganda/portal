import { Box, Container, Typography, Button } from '@mui/material'
import heroImg from '../../assets/images/membershipPage-images/meb.png'

function Hero() {
  return (
    <Box
      sx={{
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: { xs: '56px', sm: '64px' },
        marginTop: { xs: '-56px', sm: '-64px' },
        backgroundImage: `url(${heroImg})`,
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
          MEMBERSHIP
        </Typography>

        <Button
  variant="outlined"
  sx={{
    color: 'white',
    borderColor: 'white',
    backgroundColor: 'transparent',
    px: 4,
    py: 1.5,
    fontSize: '1rem',
    borderRadius: '30px',
    fontWeight: 600,
    textTransform: 'none',
    animation: 'fadeInUp 1s ease-out 0.6s both',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)', // Subtle transparent hover
      borderColor: 'white',
      color: 'white',
      transform: 'translateY(-3px)',
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
