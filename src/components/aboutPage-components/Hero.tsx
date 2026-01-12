import { Box, Typography } from '@mui/material'
import heroImg from '../../assets/images/aboutPage-images/haro_section.jpg'

function Hero() {
  return (
    <Box 
      className="relative h-[300px] overflow-hidden"
      sx={{
        '& img': {
          filter: 'brightness(0.6)',
        },
      }}
    >
      <img src={heroImg} alt="APF Uganda Team" className="w-full h-full object-cover" />
      <Box className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-30">
        <Typography 
          variant="h2" 
          className="text-white text-5xl font-bold text-center"
          sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
        >
          About APF Uganda
        </Typography>
      </Box>
    </Box>
  )
}

export default Hero
