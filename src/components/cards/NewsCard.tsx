import { Card, CardMedia, CardContent, Typography, Chip, Button } from '@mui/material'

interface NewsCardProps {
  image: string
  tag: string
  title: string
  description: string
  date: string
  readTime: string
  onReadMore?: () => void
}

function NewsCard({ image, tag, title, description, date, readTime, onReadMore }: NewsCardProps) {
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
          transform: 'scale(1.05)',
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
        <Chip 
          label={tag}
          size="small"
          sx={{ 
            backgroundColor: '#e9d5ff',
            color: '#7c3aed',
            fontWeight: 600,
            fontSize: '0.75rem',
            mb: 1,
          }}
        />
        <Typography 
          variant="h6" 
          sx={{
            color: '#2c3e50',
            fontSize: '1.1rem',
            my: 1,
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#666',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            my: 1,
          }}
        >
          {description}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{
            color: '#999',
            fontSize: '0.8rem',
            display: 'block',
            mt: 1,
          }}
        >
          {date} • {readTime}
        </Typography>
        <Button 
          onClick={onReadMore}
          sx={{
            color: '#7c3aed',
            fontWeight: 600,
            mt: 1,
            p: 0,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              textDecoration: 'underline',
              transform: 'translateX(5px)',
              backgroundColor: 'transparent',
            },
          }}
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  )
}

export default NewsCard
