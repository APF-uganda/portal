import { Box, Container, Typography, Button } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import chairmanImg from '../../assets/images/landingPage-image/chairman.jpg'

function ChairMessage() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <Box 
      sx={{
        backgroundColor: '#e9d5ff',
        py: 8,
        px: 4,
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 6,
          alignItems: 'center',
          animation: 'fadeIn 1s ease-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
        }}
      >
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            minWidth: '300px',
            minHeight: '350px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
          <Box
            component="img"
            src={chairmanImg}
            alt="CPA Ronald Mukumba - Chairperson APF Uganda"
            sx={{
              width: '300px',
              height: '350px',
              objectFit: 'cover',
              borderRadius: '8px',
              transition: 'transform 0.3s ease',
              display: 'block',
              position: 'relative',
              zIndex: 0,
            }}
            onError={(e) => {
              console.error('Image failed to load:', chairmanImg)
              e.currentTarget.style.display = 'none'
            }}
          />
        </Box>
        
        <Box 
          sx={{
            animation: 'slideInRight 1s ease-out',
            '@keyframes slideInRight': {
              '0%': { opacity: 0, transform: 'translateX(50px)' },
              '100%': { opacity: 1, transform: 'translateX(0)' },
            },
          }}
        >
          <Typography 
            ref={elementRef}
            variant="h4" 
            sx={{
              color: '#2c3e50',
              fontSize: '2rem',
              mb: 3,
              fontWeight: 'bold',
              position: 'relative',
              display: 'inline-block',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            Message from the Director
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              lineHeight: 1.8,
              color: '#333',
              mb: 2,
            }}
          >
            It is with immense pleasure that I welcome you to the Accountancy Practitioners Forum (APF Uganda). Our mission is clear: to champion advocacy, integrity, and innovation within the accounting profession across Uganda. We are committed to fostering a culture of excellence where continuous learning is paramount, and where the collective voice of our members drives meaningful change. Together, we build a stronger, more credible profession for a prosperous future.
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              fontWeight: 'bold',
              mt: 3,
            }}
          >
            CPA Ronald Mutumba
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              color: '#666',
              fontSize: '0.9rem',
            }}
          >
            Director - APF Uganda
          </Typography>
          <Button 
            onClick={() => console.log('Navigate to full message')}
            sx={{
              color: '#7c3aed',
              fontWeight: 600,
              mt: 2,
              p: 0,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                textDecoration: 'underline',
                transform: 'translateX(5px)',
                backgroundColor: 'transparent',
              },
            }}
          >
            Read Full Message →
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default ChairMessage
