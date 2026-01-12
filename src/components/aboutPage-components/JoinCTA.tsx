import { Box, Container, Typography, Button } from '@mui/material'

function JoinCTA() {
  return (
    <Box 
      component="section" 
      className="py-16 px-8"
      sx={{
        background: 'linear-gradient(135deg, #e9d5ff 0%, #f3e8ff 100%)',
      }}
    >
      <Container maxWidth="md" className="text-center">
        <Typography variant="h4" className="text-secondary text-3xl mb-4 font-bold">
          Join the Future of Accountancy in Uganda
        </Typography>
        <Typography variant="body1" className="text-gray-700 mb-2">
          Explore our membership benefits or contact us for more information
        </Typography>
        <Typography variant="body2" className="text-gray-600 text-sm mb-8">
          Join how to become a part of APF Uganda
        </Typography>
        <Button 
          variant="contained"
          className="bg-primary text-white px-10 py-4 text-base font-semibold rounded-full transition-all hover:bg-primary-dark hover:-translate-y-0.5 shadow-lg normal-case"
          sx={{ 
            backgroundColor: '#7c3aed',
            '&:hover': {
              backgroundColor: '#6d28d9',
              boxShadow: '0 6px 12px rgba(124, 58, 237, 0.4)',
            }
          }}
        >
          Learn About Membership
        </Button>
      </Container>
    </Box>
  )
}

export default JoinCTA
