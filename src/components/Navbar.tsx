import { useState } from 'react'
import '../assets/css/Navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">APF</div>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About APF</a></li>
          <li><a href="#membership" onClick={() => setIsMenuOpen(false)}>Membership</a></li>
          <li><a href="#events" onClick={() => setIsMenuOpen(false)}>Events</a></li>
          <li><a href="#news" onClick={() => setIsMenuOpen(false)}>News & Insights</a></li>
          <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact & Enquiries</a></li>
          <li className="mobile-only">
            <button className="btn-outline-mobile">Quick Links</button>
          </li>
          <li className="mobile-only">
            <button className="btn-primary-mobile">Members Login</button>
          </li>
        </ul>
        
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
