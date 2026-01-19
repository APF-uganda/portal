import { Box, Container, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import XIcon from '@mui/icons-material/X'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'
import logoBlue from '../../assets/logo_blue.png'

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
            gap: 8,
            py: 6,
          }}
        >
          {/* Logo and Description Section */}
          <Box>
            <Box
              component="img"
              src={logoBlue}
              alt="APF Logo"
              sx={{
                height: 60,
                mb: 3,
              }}
            />
            <Typography 
              variant="body2" 
              sx={{
                color: '#9ca3af',
                lineHeight: 1.8,
                mb: 3,
                maxWidth: '400px',
              }}
            >
              The Accountancy Practitioners Forum (APF Uganda) is dedicated to fostering excellence and promoting the highest standards in the accountancy profession in Uganda.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1877F2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 119, 242, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
              </Box>
              
              <Box
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <XIcon sx={{ fontSize: 18 }} />
              </Box>
              
              <Box
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#0A66C2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 102, 194, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <LinkedInIcon sx={{ fontSize: 18 }} />
              </Box>
              
              <Box
                component="a"
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FF0000',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <YouTubeIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
          </Box>
          
          {/* Quick Links */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{
                color: '#1f2937',
                mb: 3,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {['Membership', 'Governance', 'Policy Documents', 'Annual Reports', 'FAQs'].map((link) => (
                <Box component="li" key={link} sx={{ mb: 2 }}>
                  <Box
                    component="a"
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    sx={{
                      color: '#9ca3af',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#7c3aed',
                      },
                    }}
                  >
                    {link}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* Connect */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{
                color: '#1f2937',
                mb: 3,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Connect
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {['Member Directory', 'Partners', 'Sponsorship'].map((link) => (
                <Box component="li" key={link} sx={{ mb: 2 }}>
                  <Box
                    component="a"
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    sx={{
                      color: '#9ca3af',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#7c3aed',
                      },
                    }}
                  >
                    {link}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        
        <Box 
          sx={{
            textAlign: 'center',
            py: 4,
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <Typography 
            variant="body2" 
            sx={{
              color: '#9ca3af',
              fontSize: '0.875rem',
            }}
          >
            © 2025 APF Uganda. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
