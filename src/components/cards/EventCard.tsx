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
      className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-in-up"
      sx={{
        '&:hover': {
          boxShadow: '0 8px 25px rgba(124, 58, 237, 0.2)',
        },
        '&:hover img': {
          transform: 'scale(1.1)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        className="h-[200px] object-cover transition-transform duration-300"
      />
      <CardContent className="p-6">
        <Typography variant="h6" className="text-secondary text-lg mb-2">
          {title}
        </Typography>
        <Typography variant="body2" className="text-gray-600 text-sm py-1">
          📅 {date}
        </Typography>
        <Typography variant="body2" className="text-gray-600 text-sm py-1">
          🕐 {time}
        </Typography>
        <Typography variant="body2" className="text-gray-600 text-sm py-1">
          📍 {location}
        </Typography>
        <Typography variant="body2" className="text-gray-600 text-sm py-1 pb-4">
          {description}
        </Typography>
        <Button 
          variant="contained"
          fullWidth
          onClick={onRegister}
          className="bg-primary text-white rounded-full py-3 font-semibold transition-all hover:bg-primary-dark hover:-translate-y-0.5 normal-case"
          sx={{ 
            backgroundColor: '#7c3aed',
            '&:hover': {
              backgroundColor: '#6d28d9',
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
