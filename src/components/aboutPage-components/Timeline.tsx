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
    <Box component="section" className="bg-white py-12 px-8">
      <Container maxWidth="lg">
        <Box className="flex flex-col md:flex-row justify-between gap-8 relative">
          <Box 
            className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-primary z-0"
          />
          {timelineData.map((item, index) => (
            <Box key={index} className="flex-1 relative z-10">
              <Box className="flex justify-center mb-6">
                <Box className="w-20 h-20 rounded-full bg-primary border-4 border-white shadow-lg" />
              </Box>
              <Box className="text-center">
                <Typography variant="h5" className="text-primary text-2xl font-bold mb-2">
                  {item.year}
                </Typography>
                <Typography variant="h6" className="text-secondary text-base font-semibold mb-3">
                  {item.title}
                </Typography>
                <Typography variant="body2" className="text-gray-600 text-sm leading-relaxed">
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
