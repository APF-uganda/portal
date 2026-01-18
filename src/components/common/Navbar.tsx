import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoPurple from '../../assets/logo_purple.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const shouldBeScrolled = scrollPosition > 500
      
      // Only update if the state actually changes
      setIsScrolled(shouldBeScrolled)
    }

    // Set initial state
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Reset scroll state when page changes
  useEffect(() => {
    window.scrollTo(0, 0)
    setIsScrolled(false)
  }, [location.pathname])

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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20' 
          : 'bg-white/15 backdrop-blur-md'
      }`}
    >
      <nav className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 min-h-[56px] sm:min-h-[64px] flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center no-underline transition-transform duration-300 hover:scale-105"
        >
          <img
            src={logoPurple}
            alt="APF Logo"
            className="h-[35px] sm:h-[40px] md:h-[50px] w-auto transition-all duration-300"
          />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative pb-1 text-[0.9rem] font-medium transition-colors duration-300 whitespace-nowrap hover:text-primary ${
                isActive(link.path)
                  ? isScrolled 
                    ? 'text-primary font-semibold border-b-2 border-primary' 
                    : 'text-white font-semibold border-b-2 border-white'
                  : isScrolled 
                    ? 'text-secondary' 
                    : 'text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-4">
          <button 
            className={`rounded-full px-6 lg:px-8 py-2 text-[0.85rem] lg:text-[0.9rem] font-medium transition-all duration-300 whitespace-nowrap hover:-translate-y-0.5 ${
              isScrolled
                ? 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white'
                : 'border-2 border-white text-white hover:bg-white hover:text-secondary'
            }`}
          >
            Join APF
          </button>
          <button 
            className="bg-primary rounded-full px-6 lg:px-8 py-2 text-[0.85rem] lg:text-[0.9rem] font-medium text-white shadow-[0_2px_8px_rgba(124,58,237,0.3)] transition-all duration-300 whitespace-nowrap hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(124,58,237,0.5)]"
          >
            Members Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden p-2 transition-colors duration-300 rounded-lg ${
            isScrolled 
              ? 'text-secondary hover:bg-primary/8' 
              : 'text-white hover:bg-white/10'
          }`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Mobile Drawer */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMenu}
            />
            
            {/* Drawer */}
            <div className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-[320px] md:w-[350px] max-w-[400px] bg-white/98 backdrop-blur-sm shadow-[-4px_0_20px_rgba(0,0,0,0.15)] z-50 flex flex-col">
              {/* Mobile Menu Header */}
              <div className="p-4 sm:p-6 border-b border-black/10 flex justify-between items-center bg-white/95">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center no-underline"
                >
                  <img
                    src={logoPurple}
                    alt="APF Logo"
                    className="h-[35px] sm:h-[40px] w-auto"
                  />
                </Link>
                <button 
                  onClick={toggleMenu}
                  className="text-secondary p-2 hover:bg-black/5 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <ul className="flex-1 pt-4 px-4 list-none bg-white/95">
                {navLinks.map((link, index) => (
                  <li 
                    key={link.path} 
                    className="mb-2"
                    style={{
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 no-underline ${
                        isActive(link.path)
                          ? 'text-primary font-semibold bg-primary/10'
                          : 'text-secondary hover:bg-black/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile Menu Buttons */}
              <div className="p-4 sm:p-6 border-t border-black/10 flex flex-col gap-4 bg-white/95">
                <button 
                  className="w-full border-2 border-secondary text-secondary rounded-full py-3 font-medium transition-all duration-300 hover:bg-secondary hover:text-white"
                >
                  Join APF
                </button>
                <button 
                  className="w-full bg-primary text-white rounded-full py-3 font-medium shadow-[0_2px_8px_rgba(124,58,237,0.3)] transition-all duration-300 hover:bg-primary-dark hover:shadow-[0_4px_12px_rgba(124,58,237,0.5)]"
                >
                  Members Login
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Keyframes for mobile menu animation */}
      <style>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar
