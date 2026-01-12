import { Box, Container, Typography, Button } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import chairmanImg from '../../assets/images/landingPage-image/chairman.jpg'

function ChairMessage() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <Box className="bg-purple-100 py-16 px-8">
      <Container maxWidth="lg" className="flex flex-col md:flex-row gap-12 items-center animate-fade-in">
        <Box 
          className="relative overflow-hidden rounded-lg min-w-[300px] min-h-[350px] flex items-center justify-center"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), transparent)',
              zIndex: 1,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            },
            '&:hover::before': {
              opacity: 0,
            },
            '&:hover img': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <img 
            src={chairmanImg} 
            alt="CPA Ronald Mukumba - Chairperson APF Uganda"
            className="w-[300px] h-[350px] object-cover rounded-lg transition-transform duration-300"
            onError={(e) => {
              console.error('Image failed to load:', chairmanImg)
              e.currentTarget.style.display = 'none'
            }}
          />
        </Box>
        
        <Box className="animate-slide-in-right">
          <Typography 
            ref={elementRef}
            variant="h4" 
            className={`text-secondary text-3xl mb-6 font-bold relative inline-block transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}
              after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[60px] after:h-[3px] after:bg-primary`}
          >
            Message from the Director
          </Typography>
          <Typography variant="body1" className="leading-relaxed text-gray-800 mb-4">
            It is with immense pleasure that I welcome you to the Accountancy Practitioners Forum (APF Uganda). Our mission is clear: to champion advocacy, integrity, and innovation within the accounting profession across Uganda. We are committed to fostering a culture of excellence where continuous learning is paramount, and where the collective voice of our members drives meaningful change. Together, we build a stronger, more credible profession for a prosperous future.
          </Typography>
          <Typography variant="body1" className="font-bold mt-6">
            <strong>CPA Ronald Mutumba</strong>
          </Typography>
          <Typography variant="body2" className="text-gray-600 text-sm">
            Director - APF Uganda
          </Typography>
          <Button 
            className="text-primary font-semibold mt-4 transition-all hover:underline hover:translate-x-2 normal-case p-0"
            onClick={() => console.log('Navigate to full message')}
          >
            Read Full Message →
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default ChairMessage
