import { Box, Container, Typography } from '@mui/material'

function Timeline() {
  const timelineData = [
    {
      year: '2005',
      title: 'Inaugural Meeting and Formation',
      description: 'The Accountancy Practitioners Forum was officially established, bringing together accounting professionals to strengthen the profession in Uganda.'
    },
    {
      year: '2010',
      title: 'First Annual Conference',
      description: 'Hosted a landmark conference attracting professionals from across the region, discussing innovations in accounting and best practices for future growth.'
    },
    {
      year: '2015',
      title: 'Launch of CPD Accreditation',
      description: 'Introduced a structured Continuous Professional Development program, ensuring members maintain and enhance their skills and knowledge.'
    }
  ]

  return (
    <Box component="section" sx={{ backgroundColor: 'white', py: 6, px: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          gap: 4, 
          position: 'relative' 
        }}>
          <Box sx={{ 
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: '#7c3aed',
            zIndex: 0
          }} />
          {timelineData.map((item, index) => (
            <Box key={index} sx={{ flex: 1, position: 'relative', zIndex: 10 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  backgroundColor: '#7c3aed', 
                  border: '4px solid white', 
                  boxShadow: 3 
                }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: '#7c3aed', fontSize: '1.5rem', fontWeight: 'bold', mb: 1 }}>
                  {item.year}
                </Typography>
                <Typography variant="h6" sx={{ color: '#1e293b', fontSize: '1rem', fontWeight: 600, mb: 1.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default Timeline
