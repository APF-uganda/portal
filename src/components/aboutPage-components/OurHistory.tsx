import { Box, Container, Typography } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

function OurHistory() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <Box component="section" className="bg-white py-16 px-8">
      <Container maxWidth="lg">
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Box className="md:col-span-2 animate-fade-in">
            <Box className="mb-4">
              <AccessTimeIcon sx={{ fontSize: 48, color: '#7c3aed' }} />
            </Box>
            <Typography 
              ref={elementRef}
              variant="h4" 
              className={`text-secondary text-3xl mb-6 font-bold transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Our History
            </Typography>
            <Typography variant="body1" className="leading-relaxed text-gray-700">
              The Accountancy Practitioners Forum (APF Uganda) is the leading professional 
              body dedicated to advancing the accountancy profession in Uganda. We uphold 
              ethical standards, foster professional development, and advocate for policies 
              that benefit our members and the nation's economic growth.
            </Typography>
          </Box>
          
          <Box className="border-l-4 border-primary pl-8">
            {[
              { icon: '👤', text: 'Become a Member' },
              { icon: '📅', text: 'Our Events' },
              { icon: '📰', text: 'News & Insights' },
              { icon: '💬', text: "Chairman's message" },
            ].map((link, index) => (
              <Box 
                key={index}
                className="flex items-center gap-3 py-4 cursor-pointer transition-all hover:text-primary hover:translate-x-2"
              >
                <Typography variant="h6" className="text-xl">{link.icon}</Typography>
                <Typography variant="body1" className="text-gray-800">{link.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default OurHistory
