import { Box, Container, Typography, IconButton } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'

function Footer() {
  return (
    <Box component="footer" className="bg-gray-50 py-12 px-8 animate-fade-in">
      <Container maxWidth="lg">
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <Box>
            <Typography 
              variant="h4" 
              className="text-primary font-bold mb-2 inline-block transition-transform hover:scale-110 cursor-pointer"
            >
              APF
            </Typography>
            <Typography variant="subtitle1" className="font-semibold mb-4 text-secondary">
              Uganda Accountancy Practitioners Forum
            </Typography>
            <Typography variant="body2" className="text-gray-600 leading-relaxed mb-6">
              Dedicated to fostering excellence and promoting the highest standards of integrity in the Ugandan accountancy profession.
            </Typography>
            <Box className="flex gap-4">
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
                  className="w-9 h-9 bg-blue-500 text-white transition-all hover:bg-primary hover:-translate-y-1 hover:rotate-[360deg] hover:shadow-lg"
                  sx={{ 
                    backgroundColor: '#3b82f6',
                    '&:hover': { backgroundColor: '#7c3aed' }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
          
          <Box>
            <Typography variant="h6" className="text-secondary mb-4 text-lg">
              Quick Links
            </Typography>
            <Box component="ul" className="list-none p-0">
              {['Membership', 'Events', 'Publications', 'Annual Reports', 'FAQs'].map((link) => (
                <Box component="li" key={link} className="mb-3">
                  <a 
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 no-underline transition-all hover:text-primary hover:pl-2 relative
                      before:content-['→'] before:opacity-0 before:mr-0 before:transition-all hover:before:opacity-100 hover:before:mr-2"
                  >
                    {link}
                  </a>
                </Box>
              ))}
            </Box>
          </Box>
          
          <Box>
            <Typography variant="h6" className="text-secondary mb-4 text-lg">
              Connect
            </Typography>
            <Box component="ul" className="list-none p-0">
              {['Member Directory', 'Contact', 'Sponsorship'].map((link) => (
                <Box component="li" key={link} className="mb-3">
                  <a 
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 no-underline transition-all hover:text-primary hover:pl-2 relative
                      before:content-['→'] before:opacity-0 before:mr-0 before:transition-all hover:before:opacity-100 hover:before:mr-2"
                  >
                    {link}
                  </a>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        
        <Box className="text-center pt-8 border-t border-gray-300">
          <Typography variant="body2" className="text-gray-500">
            © 2026 APF Uganda. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
