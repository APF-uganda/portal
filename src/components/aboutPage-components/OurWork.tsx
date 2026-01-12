import { Box, Container, Typography } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import workImg from '../../assets/images/aboutPage-images/our_work1.png'

function OurWork() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <Box component="section" className="bg-white py-16 px-8">
      <Container maxWidth="lg" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <Box>
          <Typography 
            ref={elementRef}
            variant="h4" 
            className={`text-secondary text-3xl mb-6 font-bold transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            Our Work
          </Typography>
          <Typography variant="body1" className="leading-relaxed text-gray-700">
            APF supports its accounting professionals through advocacy, consultation, 
            and professional development. We promote ethical practice, influence policy, 
            shape standards and provide platforms that help practitioners thrive, 
            innovate and lead within the profession.
          </Typography>
        </Box>
        <Box 
          className="relative overflow-hidden rounded-xl"
          sx={{
            '&:hover img': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <img 
            src={workImg} 
            alt="APF Team Collaboration"
            className="w-full h-auto rounded-xl transition-transform duration-300"
          />
        </Box>
      </Container>
    </Box>
  )
}

export default OurWork
