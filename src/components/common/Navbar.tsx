import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import logoBlue from '../../assets/logo_blue.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About APF' },
    { path: '/membership', label: 'Membership' },
    { path: '/events', label: 'Events' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact & Enquiries' },
  ]

  return (
    <AppBar 
      position="fixed" 
      elevation={isScrolled ? 1 : 0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar 
        sx={{ 
          maxWidth: '1400px', 
          width: '100%', 
          mx: 'auto', 
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: { xs: '56px', sm: '64px' },
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <Box
            component="img"
            src={logoBlue}
            alt="APF Logo"
            sx={{
              height: { xs: 35, sm: 40, md: 50 },
              width: 'auto',
              transition: 'all 0.3s ease',
            }}
          />
        </Link>
        
        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: { md: 3, lg: 4 } }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: isActive(link.path) ? '#7c3aed' : '#2c3e50',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive(link.path) ? 600 : 500,
                position: 'relative',
                transition: 'color 0.3s ease',
                paddingBottom: '5px',
                borderBottom: isActive(link.path) ? '2px solid #7c3aed' : 'none',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#7c3aed'
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.path)) {
                  e.currentTarget.style.color = '#2c3e50'
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>

        {/* Desktop Buttons */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 2 }}>
          <Button 
            variant="outlined"
            sx={{ 
              borderColor: '#2c3e50',
              color: '#2c3e50',
              borderRadius: '25px',
              px: { md: 2, lg: 3 },
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { md: '0.85rem', lg: '0.9rem' },
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: '#2c3e50',
                color: 'white',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Join APF
          </Button>
          <Button 
            variant="contained"
            sx={{ 
              backgroundColor: '#7c3aed',
              borderRadius: '25px',
              px: { md: 2, lg: 3 },
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { md: '0.85rem', lg: '0.9rem' },
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: '#6d28d9',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.5)',
              },
            }}
          >
            Members Login
          </Button>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          sx={{ 
            display: { xs: 'block', lg: 'none' },
            color: '#2c3e50',
            p: 1,
            transition: 'color 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(124, 58, 237, 0.08)',
            },
          }}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <MenuIcon sx={{ fontSize: { xs: 26, sm: 28 } }} />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={isMenuOpen}
          onClose={toggleMenu}
          sx={{
            '& .MuiDrawer-paper': {
              width: { xs: '85%', sm: '320px', md: '350px' },
              maxWidth: '400px',
              backgroundColor: 'white',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Mobile Menu Header */}
            <Box sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
              >
                <Box
                  component="img"
                  src={logoBlue}
                  alt="APF Logo"
                  sx={{
                    height: { xs: 35, sm: 40 },
                    width: 'auto',
                  }}
                />
              </Link>
              <IconButton 
                onClick={toggleMenu}
                sx={{ color: '#2c3e50' }}
                aria-label="Close menu"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Mobile Menu Links */}
            <List sx={{ flex: 1, pt: 2, px: 2 }}>
              {navLinks.map((link, index) => (
                <ListItem 
                  key={link.path} 
                  sx={{ 
                    py: 0,
                    mb: 1,
                    animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    '@keyframes slideIn': {
                      '0%': { opacity: 0, transform: 'translateX(20px)' },
                      '100%': { opacity: 1, transform: 'translateX(0)' },
                    },
                  }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      color: isActive(link.path) ? '#7c3aed' : '#2c3e50',
                      fontWeight: isActive(link.path) ? 600 : 500,
                      backgroundColor: isActive(link.path) ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                      borderRadius: '8px',
                      display: 'block',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </ListItem>
              ))}
            </List>

            {/* Mobile Menu Buttons */}
            <Box sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Button 
                variant="outlined"
                fullWidth
                sx={{ 
                  borderColor: '#2c3e50',
                  color: '#2c3e50',
                  borderRadius: '25px',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#2c3e50',
                    color: 'white',
                  },
                }}
              >
                Join APF
              </Button>
              <Button 
                variant="contained"
                fullWidth
                sx={{ 
                  backgroundColor: '#7c3aed',
                  borderRadius: '25px',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
                  '&:hover': {
                    backgroundColor: '#6d28d9',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.5)',
                  },
                }}
              >
                Members Login
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
