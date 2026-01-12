import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material'

interface EventCardProps {
  image: string
  title: string
  date: string
  time: string
  location: string
  description: string
  onRegister?: () => void
}

function EventCard({ image, title, date, time, location, description, onRegister }: EventCardProps) {
  return (
    <Card 
      sx={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.8s ease-out',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 8px 25px rgba(124, 58, 237, 0.2)',
        },
        '&:hover img': {
          transform: 'scale(1.1)',
        },
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{
          height: '200px',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{
            color: '#2c3e50',
            fontSize: '1.1rem',
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#666',
            fontSize: '0.9rem',
            py: 0.5,
          }}
        >
          📅 {date}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#666',
            fontSize: '0.9rem',
            py: 0.5,
          }}
        >
          🕐 {time}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#666',
            fontSize: '0.9rem',
            py: 0.5,
          }}
        >
          📍 {location}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#666',
            fontSize: '0.9rem',
            py: 0.5,
            pb: 2,
          }}
        >
          {description}
        </Typography>
        <Button 
          variant="contained"
          fullWidth
          onClick={onRegister}
          sx={{ 
            backgroundColor: '#7c3aed',
            color: 'white',
            borderRadius: '25px',
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#6d28d9',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
            }
          }}
        >
          Register
        </Button>
      </CardContent>
    </Card>
  )
}

export default EventCard
