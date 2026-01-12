import { Box, Container, Typography, Button } from '@mui/material'

function JoinCTA() {
  return (
    <Box 
      component="section" 
      sx={{
        py: 8,
        px: 4,
        background: 'linear-gradient(135deg, #e9d5ff 0%, #f3e8ff 100%)',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{
            color: '#2c3e50',
            fontSize: '2rem',
            mb: 2,
            fontWeight: 700,
          }}
        >
          Join the Future of Accountancy in Uganda
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            color: '#555',
            mb: 1,
          }}
        >
          Explore our membership benefits or contact us for more information
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#666',
            fontSize: '0.9rem',
            mb: 4,
          }}
        >
          Join how to become a part of APF Uganda
        </Typography>
        <Button 
          variant="contained"
          sx={{ 
            backgroundColor: '#7c3aed',
            color: 'white',
            px: 5,
            py: 2,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '25px',
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(124, 58, 237, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#6d28d9',
              transform: 'translateY(-2px)',
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
