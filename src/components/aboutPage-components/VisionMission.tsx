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
    <Box component="section" className="bg-gray-50 py-16 px-8">
      <Container maxWidth="lg">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card 
            className="h-full p-10 rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl"
            sx={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box className="mb-6">
                <VisibilityIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" className="text-3xl mb-4 font-bold">
                Our Vision
              </Typography>
              <Typography variant="body1" className="leading-relaxed text-white opacity-95">
                To be the leading voice in uplifting standards advancing a strong, 
                ethical and globally competitive accountancy profession in Uganda and beyond.
              </Typography>
            </CardContent>
          </Card>

          <Card 
            className="h-full p-10 rounded-xl border-2 border-gray-200 transition-all hover:-translate-y-1 hover:shadow-xl"
            sx={{ background: 'white' }}
          >
            <CardContent>
              <Box className="mb-6">
                <EventIcon sx={{ fontSize: 40, color: '#7c3aed' }} />
              </Box>
              <Typography variant="h4" className="text-secondary text-3xl mb-4 font-bold">
                Our Mission
              </Typography>
              <Typography variant="body1" className="text-gray-700 leading-relaxed">
                To empower accounting professionals through collaborative, continuous 
                learning, ethical engagement, and advocacy, strengthening the 
                accountancy profession in Uganda.
              </Typography>
            </CardContent>
          </Card>

          <Box className="col-span-1 md:col-span-2">
            <Card className="p-10 rounded-xl shadow-md">
              <CardContent>
                <Typography variant="h4" className="text-secondary text-3xl mb-8 font-bold text-center">
                  Our Objectives
                </Typography>
                <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {objectives.map((obj, index) => (
                    <Box key={index} className="flex items-center gap-3 p-3 transition-all hover:bg-gray-100 rounded-lg">
                      <Typography variant="h5" className="text-2xl">
                        {obj.icon}
                      </Typography>
                      <Typography variant="body2" className="text-gray-800 text-sm">
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
