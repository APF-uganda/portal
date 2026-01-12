import { Box, Typography } from '@mui/material'
import heroImg from '../../assets/images/aboutPage-images/haro_section.jpg'

function Hero() {
  return (
    <Box 
      sx={{
        position: 'relative',
        height: '300px',
        overflow: 'hidden',
        '& img': {
          filter: 'brightness(0.6)',
        },
      }}
    >
      <Box
        component="img"
        src={heroImg}
        alt="APF Uganda Team"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography 
          variant="h2" 
          sx={{
            color: 'white',
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          About APF Uganda
        </Typography>
      </Box>
    </Box>
  )
}

export default Hero
