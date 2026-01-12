import { Box, Container, Typography } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

function OurHistory() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <Box component="section" sx={{ backgroundColor: 'white', py: 8, px: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 6 }}>
          <Box>
            <Box sx={{ mb: 2 }}>
              <AccessTimeIcon sx={{ fontSize: 48, color: '#7c3aed' }} />
            </Box>
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
              Our History
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#374151' }}>
              The Accountancy Practitioners Forum (APF Uganda) is the leading professional 
              body dedicated to advancing the accountancy profession in Uganda. We uphold 
              ethical standards, foster professional development, and advocate for policies 
              that benefit our members and the nation's economic growth.
            </Typography>
          </Box>
          
          <Box sx={{ borderLeft: '4px solid #7c3aed', pl: 4 }}>
            {[
              { icon: '👤', text: 'Become a Member' },
              { icon: '📅', text: 'Our Events' },
              { icon: '📰', text: 'News & Insights' },
              { icon: '💬', text: "Chairman's message" },
            ].map((link, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  py: 2, 
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    color: '#7c3aed',
                    transform: 'translateX(8px)'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontSize: '1.25rem' }}>{link.icon}</Typography>
                <Typography variant="body1" sx={{ color: '#1f2937' }}>{link.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default OurHistory
