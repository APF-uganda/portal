import { useEffect, useState, useRef } from 'react'
import { Box, Container, Typography } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import EventIcon from '@mui/icons-material/Event'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'

interface StatItemProps {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
}

function StatItem({ icon, value, suffix, label }: StatItemProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      setCount(0)
      const duration = 2000
      const steps = 60
      const increment = value / steps
      const stepDuration = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        if (currentStep <= steps) {
          setCount(Math.min(Math.floor(increment * currentStep), value))
        } else {
          clearInterval(timer)
          setCount(value)
        }
      }, stepDuration)

      return () => clearInterval(timer)
    } else {
      setCount(0)
    }
  }, [isVisible, value])

  return (
    <Box 
      ref={elementRef} 
      sx={{
        textAlign: 'center',
        animation: 'fadeInUp 0.8s ease-out',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-10px)',
        },
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box 
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#ede9fe',
          mb: 2,
          animation: 'bounce 2s ease-in-out infinite',
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
        }}
      >
        {icon}
      </Box>
      <Typography 
        variant="h3" 
        sx={{
          fontSize: '2.5rem',
          color: '#2c3e50',
          mb: 1,
          fontWeight: 'bold',
        }}
      >
        {count}{suffix}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{
          color: '#666',
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

function Stats() {
  return (
    <Box 
      component="section" 
      sx={{
        backgroundColor: 'white',
        py: 6,
        px: 4,
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-around',
          gap: 4,
        }}
      >
        <StatItem 
          icon={<GroupsIcon sx={{ fontSize: 40, color: '#7c3aed' }} />} 
          value={1000} 
          suffix="+" 
          label="Active Members" 
        />
        <StatItem 
          icon={<EventIcon sx={{ fontSize: 40, color: '#7c3aed' }} />} 
          value={10} 
          suffix="+" 
          label="Annual Events" 
        />
        <StatItem 
          icon={<LibraryBooksIcon sx={{ fontSize: 40, color: '#7c3aed' }} />} 
          value={100} 
          suffix="+" 
          label="Resources Shared" 
        />
      </Container>
    </Box>
  )
}

export default Stats
