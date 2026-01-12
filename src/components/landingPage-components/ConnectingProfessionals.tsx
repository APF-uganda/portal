import { Box, Container, Typography } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import connectingImg from '../../assets/images/landingPage-image/connecting.jpeg'

function ConnectingProfessionals() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <Box 
      component="section" 
      sx={{
        backgroundColor: 'white',
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
            flex: 1,
            animation: 'slideInLeft 1s ease-out',
            '@keyframes slideInLeft': {
              '0%': { opacity: 0, transform: 'translateX(-50px)' },
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
              mb: 4,
              fontWeight: 'bold',
              position: 'relative',
              display: 'inline-block',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
              transition: 'all 0.8s ease-out',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: 0,
                width: '60px',
                height: '3px',
                backgroundColor: '#7c3aed',
              },
            }}
          >
            Connecting Accounting Professionals
          </Typography>
          
          <Box 
            sx={{
              borderBottom: '1px solid #ddd',
              py: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                paddingLeft: '10px',
                borderLeft: '3px solid #7c3aed',
              },
            }}
          >
            <Typography 
              variant="h6" 
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#2c3e50',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#7c3aed',
                },
              }}
            >
              Empowerment <span>▲</span>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                mt: 2,
                color: '#666',
                lineHeight: 1.6,
                animation: 'fadeIn 0.5s ease-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 },
                },
              }}
            >
              Access shared resources, insights and opportunities that support continuous learning and professional growth.
            </Typography>
          </Box>
          
          <Box 
            sx={{
              borderBottom: '1px solid #ddd',
              py: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                paddingLeft: '10px',
                borderLeft: '3px solid #7c3aed',
              },
            }}
          >
            <Typography 
              variant="h6" 
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#2c3e50',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#7c3aed',
                },
              }}
            >
              Engagement <span>▼</span>
            </Typography>
          </Box>
          
          <Box 
            sx={{
              borderBottom: '1px solid #ddd',
              py: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                paddingLeft: '10px',
                borderLeft: '3px solid #7c3aed',
              },
            }}
          >
            <Typography 
              variant="h6" 
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#2c3e50',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#7c3aed',
                },
              }}
            >
              Networking <span>▼</span>
            </Typography>
          </Box>
        </Box>
        
        <Box 
          sx={{
            position: 'relative',
            animation: 'slideInRight 1s ease-out',
            '@keyframes slideInRight': {
              '0%': { opacity: 0, transform: 'translateX(50px)' },
              '100%': { opacity: 1, transform: 'translateX(0)' },
            },
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
          <Box
            component="img"
            src={connectingImg}
            alt="Connecting Professionals"
            sx={{
              width: { xs: '100%', md: '500px' },
              height: { xs: 'auto', md: '350px' },
              objectFit: 'cover',
              borderRadius: '8px',
              transition: 'transform 0.3s ease',
            }}
          />
        </Box>
      </Container>
    </Box>
  )
}

export default ConnectingProfessionals
