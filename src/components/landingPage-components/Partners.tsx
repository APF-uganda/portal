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
    <Box component="section" className="bg-white py-16 px-8 overflow-hidden">
      <Typography 
        ref={elementRef}
        variant="h4" 
        className={`text-center text-secondary text-3xl mb-12 font-bold animate-fade-in transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        Our Partners
      </Typography>
      <Box 
        className="max-w-full overflow-hidden relative py-8"
        sx={{
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
          className="flex gap-16 animate-scroll w-fit"
          sx={{
            '&:hover': {
              animationPlayState: 'paused',
            },
          }}
        >
          {[...partners, ...partners].map((partner, index) => (
            <Typography
              key={index}
              variant="h3"
              className="text-blue-500 font-bold text-4xl whitespace-nowrap min-w-[150px] flex items-center justify-center cursor-pointer transition-all hover:scale-125 hover:text-primary"
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
