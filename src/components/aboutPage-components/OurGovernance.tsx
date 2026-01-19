import { Box, Container, Typography, Card, CardContent, Avatar } from '@mui/material'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import ronaldImg from '../../assets/images/aboutPage-images/CPA Ronald Katumba.jpg'
import sarahImg from '../../assets/images/aboutPage-images/CPA Sarah Nejesa.webp'
import michaelImg from '../../assets/images/aboutPage-images/CPA Michael Tugyetwena.png'
import johnImg from '../../assets/images/aboutPage-images/CPA John kato.webp'
import arindaImg from '../../assets/images/aboutPage-images/CPA Arinda Jolus.jpg'
import patienceImg from '../../assets/images/aboutPage-images/CPA Patience Atuhaire.jpg'

function OurGovernance() {
  const { elementRef, isVisible } = useScrollAnimation()

  const leaders = [
    { name: 'CPA Ronald Katumba', role: 'Chairperson', image: ronaldImg },
    { name: 'CPA Sarah Nejesa', role: 'Vice Chairperson', image: sarahImg },
    { name: 'CPA Michael Tugyetwena', role: 'Director', image: michaelImg },
    { name: 'CPA John Kato', role: 'Secretary', image: johnImg },
    { name: 'CPA Arinda Jolus', role: 'Technical lead', image: arindaImg },
    { name: 'CPA Patience Atuhaire', role: 'Chief Accountant', image: patienceImg }
  ]

  return (
    <Box 
      component="section" 
      sx={{
        backgroundColor: '#f8f9fa',
        py: 8,
        px: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          ref={elementRef}
          variant="h3" 
          sx={{
            textAlign: 'center',
            color: '#2c3e50',
            fontSize: '2.5rem',
            mb: 2,
            fontWeight: 'bold',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          Our Governance
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            textAlign: 'center',
            color: '#666',
            mb: 6,
            maxWidth: '700px',
            mx: 'auto',
          }}
        >
          Meet the dedicated leaders who steer APF Uganda towards its vision of 
          professional excellence and integrity.
        </Typography>
        
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          {leaders.map((leader, index) => (
            <Card 
              key={index} 
              sx={{
                textAlign: 'center',
                p: 4,
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardContent>
                <Avatar
                  src={leader.image}
                  alt={leader.name}
                  sx={{ 
                    width: 150, 
                    height: 150,
                    border: '4px solid #7c3aed',
                    mx: 'auto',
                    mb: 3,
                  }}
                />
                <Typography 
                  variant="h6" 
                  sx={{
                    color: '#2c3e50',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  {leader.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#666',
                    fontSize: '0.9rem',
                  }}
                >
                  {leader.role}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default OurGovernance
