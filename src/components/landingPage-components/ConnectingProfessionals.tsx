import { Box, Container, Typography } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import connectingImg from '../../assets/images/landingPage-image/connecting.jpeg'

function ConnectingProfessionals() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <Box component="section" className="bg-white py-16 px-8">
      <Container maxWidth="lg" className="flex flex-col md:flex-row gap-12 items-center animate-fade-in">
        <Box className="flex-1 animate-slide-in-left">
          <Typography 
            ref={elementRef}
            variant="h4" 
            className={`text-secondary text-3xl mb-8 font-bold relative inline-block transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}
              after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[60px] after:h-[3px] after:bg-primary`}
          >
            Connecting Accounting Professionals
          </Typography>
          
          <Box className="border-b border-gray-300 py-6 transition-all hover:pl-2 hover:border-l-4 hover:border-l-primary">
            <Typography variant="h6" className="flex justify-between text-secondary text-xl cursor-pointer transition-colors hover:text-primary">
              Empowerment <span>▲</span>
            </Typography>
            <Typography variant="body1" className="mt-4 text-gray-600 leading-relaxed animate-fade-in">
              Access shared resources, insights and opportunities that support continuous learning and professional growth.
            </Typography>
          </Box>
          
          <Box className="border-b border-gray-300 py-6 transition-all hover:pl-2 hover:border-l-4 hover:border-l-primary">
            <Typography variant="h6" className="flex justify-between text-secondary text-xl cursor-pointer transition-colors hover:text-primary">
              Engagement <span>▼</span>
            </Typography>
          </Box>
          
          <Box className="border-b border-gray-300 py-6 transition-all hover:pl-2 hover:border-l-4 hover:border-l-primary">
            <Typography variant="h6" className="flex justify-between text-secondary text-xl cursor-pointer transition-colors hover:text-primary">
              Networking <span>▼</span>
            </Typography>
          </Box>
        </Box>
        
        <Box 
          className="relative animate-slide-in-right"
          sx={{
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              right: '10px',
              bottom: '10px',
              border: '3px solid #7c3aed',
              borderRadius: '8px',
              zIndex: -1,
            },
            '&:hover img': {
              transform: 'scale(1.02)',
            },
          }}
        >
          <img 
            src={connectingImg} 
            alt="Connecting Professionals"
            className="w-full md:w-[500px] h-auto md:h-[350px] object-cover rounded-lg transition-transform duration-300"
          />
        </Box>
      </Container>
    </Box>
  )
}

export default ConnectingProfessionals
