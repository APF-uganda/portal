import { Box, Container, Typography, Card, CardContent } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EventIcon from '@mui/icons-material/Event'

function VisionMission() {
  const objectives = [
    { icon: '🎯', text: 'Advocacy & Representation' },
    { icon: '🤝', text: 'Networking & Collaboration' },
    { icon: '📋', text: 'Policy Engagement' },
    { icon: '🎓', text: 'Learning Community' },
    { icon: '👁️', text: 'Public Awareness' },
    { icon: '📚', text: 'Knowledge Hub' },
    { icon: '💼', text: 'Innovation & Talent' },
    { icon: '⚖️', text: 'Practice Enablers' }
  ]

  return (
    <Box component="section" sx={{ backgroundColor: '#f9fafb', py: 8, px: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <Card 
            sx={{
              height: '100%',
              p: 5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              color: 'white',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <VisibilityIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontSize: '1.875rem', mb: 2, fontWeight: 'bold' }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, opacity: 0.95 }}>
                To be the leading voice in uplifting standards advancing a strong, 
                ethical and globally competitive accountancy profession in Uganda and beyond.
              </Typography>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              height: '100%',
              p: 5,
              borderRadius: '12px',
              background: 'white',
              border: '2px solid #e5e7eb',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <EventIcon sx={{ fontSize: 40, color: '#7c3aed' }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#1e293b', fontSize: '1.875rem', mb: 2, fontWeight: 'bold' }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.7 }}>
                To empower accounting professionals through collaborative, continuous 
                learning, ethical engagement, and advocacy, strengthening the 
                accountancy profession in Uganda.
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
            <Card sx={{ p: 5, borderRadius: '12px', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#1e293b', fontSize: '1.875rem', mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
                  Our Objectives
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                  gap: 3 
                }}>
                  {objectives.map((obj, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5, 
                        p: 1.5,
                        transition: 'all 0.3s',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: '#f3f4f6'
                        }
                      }}
                    >
                      <Typography variant="h5" sx={{ fontSize: '1.5rem' }}>
                        {obj.icon}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontSize: '0.875rem' }}>
                        {obj.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default VisionMission
