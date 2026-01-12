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
      className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-in-up"
      sx={{
        '&:hover': {
          boxShadow: '0 8px 25px rgba(124, 58, 237, 0.2)',
        },
        '&:hover img': {
          transform: 'scale(1.05)',
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
        <Chip 
          label={tag}
          className="bg-purple-100 text-primary font-semibold text-xs mb-2"
          sx={{ backgroundColor: '#e9d5ff', color: '#7c3aed' }}
        />
        <Typography variant="h6" className="text-secondary text-lg my-2">
          {title}
        </Typography>
        <Typography variant="body2" className="text-gray-600 text-sm leading-relaxed my-2">
          {description}
        </Typography>
        <Typography variant="caption" className="text-gray-400 text-xs">
          {date} • {readTime}
        </Typography>
        <Button 
          onClick={onReadMore}
          className="text-primary font-semibold mt-2 transition-all hover:underline hover:translate-x-2 normal-case p-0"
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  )
}

export default NewsCard
