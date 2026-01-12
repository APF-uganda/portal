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
    <Box component="section" className="bg-gray-50 py-16 px-8">
      <Container maxWidth="lg">
        <Typography 
          ref={elementRef}
          variant="h3" 
          className={`text-center text-secondary text-4xl mb-4 font-bold transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          Our Governance
        </Typography>
        <Typography variant="body1" className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Meet the dedicated leaders who steer APF Uganda towards its vision of 
          professional excellence and integrity.
        </Typography>
        
        <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <Card key={index} className="text-center p-8 rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <CardContent>
                <Avatar
                  src={leader.image}
                  alt={leader.name}
                  className="mx-auto mb-6"
                  sx={{ 
                    width: 150, 
                    height: 150,
                    border: '4px solid #7c3aed',
                  }}
                />
                <Typography variant="h6" className="text-secondary text-lg font-semibold mb-2">
                  {leader.name}
                </Typography>
                <Typography variant="body2" className="text-gray-600 text-sm">
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
