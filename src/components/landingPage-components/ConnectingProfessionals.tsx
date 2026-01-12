import { Box, Container, Typography, Collapse } from '@mui/material'
import { useState } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import connectingImg from '../../assets/images/landingPage-image/connecting.jpeg'

function ConnectingProfessionals() {
  const { elementRef, isVisible } = useScrollAnimation()
  const [openSection, setOpenSection] = useState<string>('empowerment')

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section)
  }

  const sections = {
    empowerment: {
      title: 'Empowerment',
      content: 'Access shared resources, insights and opportunities that support continuous learning and professional growth.'
    },
    engagement: {
      title: 'Engagement',
      content: 'Participate in meaningful discussions, collaborative projects, and initiatives that drive the accounting profession forward.'
    },
    networking: {
      title: 'Networking',
      content: 'Build valuable connections with fellow professionals, mentors, and industry leaders to expand your professional network.'
    }
  }

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
            }}
          >
            Connecting Accounting Professionals
          </Typography>
          
          {Object.entries(sections).map(([key, section]) => (
            <Box 
              key={key}
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
                onClick={() => toggleSection(key)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: openSection === key ? '#7c3aed' : '#2c3e50',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#7c3aed',
                  },
                }}
              >
                {section.title} 
                <span style={{ 
                  transition: 'transform 0.3s ease',
                  display: 'inline-block'
                }}>
                  {openSection === key ? '▲' : '▼'}
                </span>
              </Typography>
              <Collapse in={openSection === key}>
                <Typography 
                  variant="body1" 
                  sx={{
                    mt: 2,
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  {section.content}
                </Typography>
              </Collapse>
            </Box>
          ))}
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
