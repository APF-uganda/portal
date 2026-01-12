import { Box, Container, Typography, IconButton } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{
        backgroundColor: '#f9fafb',
        py: 6,
        px: 4,
        animation: 'fadeIn 1s ease-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
            gap: 6,
            mb: 4,
          }}
        >
          {/* About Section */}
          <Box>
            <Typography 
              variant="h4" 
              sx={{
                color: '#7c3aed',
                fontWeight: 'bold',
                mb: 1,
                display: 'inline-block',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              APF
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#2c3e50',
              }}
            >
              Uganda Accountancy Practitioners Forum
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: '#666',
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              Dedicated to fostering excellence and promoting the highest standards of integrity in the Ugandan accountancy profession.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[
                { icon: <FacebookIcon />, url: 'https://facebook.com' },
                { icon: <TwitterIcon />, url: 'https://twitter.com' },
                { icon: <LinkedInIcon />, url: 'https://linkedin.com' },
                { icon: <YouTubeIcon />, url: 'https://youtube.com' },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    width: 35,
                    height: 35,
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#7c3aed',
                      transform: 'translateY(-5px) rotate(360deg)',
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
          
          {/* Quick Links */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{
                color: '#2c3e50',
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {['Membership', 'Events', 'Publications', 'Annual Reports', 'FAQs'].map((link) => (
                <Box component="li" key={link} sx={{ mb: 1.5 }}>
                  <Box
                    component="a"
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      display: 'inline-block',
                      '&:hover': {
                        color: '#7c3aed',
                        paddingLeft: '15px',
                      },
                      '&::before': {
                        content: '"→ "',
                        opacity: 0,
                        marginRight: 0,
                        transition: 'all 0.3s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                        marginRight: '5px',
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
                color: '#2c3e50',
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Connect
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {['Member Directory', 'Contact', 'Sponsorship'].map((link) => (
                <Box component="li" key={link} sx={{ mb: 1.5 }}>
                  <Box
                    component="a"
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      display: 'inline-block',
                      '&:hover': {
                        color: '#7c3aed',
                        paddingLeft: '15px',
                      },
                      '&::before': {
                        content: '"→ "',
                        opacity: 0,
                        marginRight: 0,
                        transition: 'all 0.3s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                        marginRight: '5px',
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
            pt: 4,
            borderTop: '1px solid #ddd',
          }}
        >
          <Typography 
            variant="body2" 
            sx={{
              color: '#999',
              fontSize: '0.9rem',
            }}
          >
            © 2026 APF Uganda. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
