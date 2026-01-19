import { Box, Typography } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

function Partners() {
  const { elementRef, isVisible } = useScrollAnimation()

  const partners = [
    'ICPAU',
    'ACCA',
    'CPA',
    'IFAC',
    'AAT',
    'CIMA',
    'IIA',
    'ISACA'
  ]

  return (
    <Box 
      component="section" 
      sx={{
        backgroundColor: 'white',
        py: 8,
        px: 4,
        overflow: 'hidden',
      }}
    >
      <Typography 
        ref={elementRef}
        variant="h4" 
        sx={{
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: '2rem',
          mb: 6,
          fontWeight: 'bold',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
          animation: isVisible ? 'fadeIn 0.8s ease-out' : 'none',
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
        }}
      >
        Our Partners
      </Typography>
      <Box 
        sx={{
          maxWidth: '100%',
          overflow: 'hidden',
          position: 'relative',
          py: 4,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            width: '150px',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          },
          '&::before': {
            left: 0,
            background: 'linear-gradient(to right, white, transparent)',
          },
          '&::after': {
            right: 0,
            background: 'linear-gradient(to left, white, transparent)',
          },
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            gap: 8,
            animation: 'scroll 30s linear infinite',
            width: 'fit-content',
            '&:hover': {
              animationPlayState: 'paused',
            },
            '@keyframes scroll': {
              '0%': {
                transform: 'translateX(0)',
              },
              '100%': {
                transform: 'translateX(-50%)',
              },
            },
          }}
        >
          {[...partners, ...partners].map((partner, index) => (
            <Typography
              key={index}
              variant="h3"
              sx={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#3b82f6',
                whiteSpace: 'nowrap',
                minWidth: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                  color: '#7c3aed',
                },
              }}
            >
              {partner}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default Partners
