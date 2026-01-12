import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

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
      position="sticky" 
      elevation={1}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        animation: 'slideDown 0.5s ease-out',
        '@keyframes slideDown': {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      }}
    >
      <Toolbar sx={{ maxWidth: '1400px', width: '100%', mx: 'auto', px: 4 }}>
        <Link 
          to="/" 
          style={{
            color: '#2c3e50',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.color = '#7c3aed'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.color = '#2c3e50'
          }}
        >
          APF
        </Link>
        
        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'center', gap: 4 }}>
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
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button 
            variant="outlined"
            sx={{ 
              borderColor: '#2c3e50',
              color: '#2c3e50',
              borderRadius: '25px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#2c3e50',
                color: 'white',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Join APF
          </Button>
          <Button 
            variant="contained"
            sx={{ 
              backgroundColor: '#7c3aed',
              borderRadius: '25px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
              '&:hover': {
                backgroundColor: '#6d28d9',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Members Login
          </Button>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto', color: '#2c3e50' }}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={isMenuOpen}
          onClose={toggleMenu}
        >
          <List sx={{ width: 250, pt: 2 }}>
            {navLinks.map((link) => (
              <ListItem key={link.path} sx={{ py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <Link
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    color: isActive(link.path) ? '#7c3aed' : '#2c3e50',
                    fontWeight: isActive(link.path) ? 600 : 400,
                  }}
                >
                  {link.label}
                </Link>
              </ListItem>
            ))}
            <ListItem sx={{ flexDirection: 'column', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined"
                fullWidth
                sx={{ 
                  borderColor: '#2c3e50',
                  color: '#2c3e50',
                  borderRadius: '25px',
                  py: 1.5,
                  textTransform: 'none',
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
                }}
              >
                Members Login
              </Button>
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
