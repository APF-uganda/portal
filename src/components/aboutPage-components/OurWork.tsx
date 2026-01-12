import { Box, Container, Typography } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import workImg from '../../assets/images/aboutPage-images/our_work1.png'

function OurWork() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <Box component="section" sx={{ backgroundColor: 'white', py: 8, px: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 6, 
          alignItems: 'center' 
        }}>
          <Box>
            <Typography 
              ref={elementRef}
              variant="h4" 
              sx={{ 
                color: '#1e293b', 
                fontSize: '1.875rem', 
                mb: 3, 
                fontWeight: 'bold',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
                transition: 'opacity 0.8s, transform 0.8s'
              }}
            >
              Our Work
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#374151' }}>
              APF supports its accounting professionals through advocacy, consultation, 
              and professional development. We promote ethical practice, influence policy, 
              shape standards and provide platforms that help practitioners thrive, 
              innovate and lead within the profession.
            </Typography>
          </Box>
          <Box 
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '12px',
              '&:hover img': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <img 
              src={workImg} 
              alt="APF Team Collaboration"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                transition: 'transform 0.3s'
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default OurWork
