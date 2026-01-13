import { Box, Typography } from '@mui/material'
import haloSection from '../../assets/images/contactUs-page/halo_section.png'

function ContactHero() {
  return (
    <Box
      sx={{
        height: { xs: '400px', md: '500px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '64px', // Account for navbar height
        marginTop: '-64px', // Pull up to extend behind navbar
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${haloSection})`,
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
      <Typography
        variant="h2"
        sx={{
          position: 'relative',
          zIndex: 1,
          color: 'white',
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          fontWeight: 700,
          textAlign: 'center',
          px: 2,
          animation: 'fadeInUp 1s ease-out',
        }}
      >
        Contact us
      </Typography>
    </Box>
  )
}

export default ContactHero
