import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/Navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">APF</Link>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About APF</Link></li>
          <li><Link to="/membership" onClick={() => setIsMenuOpen(false)}>Membership</Link></li>
          <li><Link to="/events" onClick={() => setIsMenuOpen(false)}>Events</Link></li>
          <li><Link to="/news" onClick={() => setIsMenuOpen(false)}>News & Insights</Link></li>
          <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact & Enquiries</Link></li>
          <li className="mobile-only">
            <button className="btn-outline-mobile">Join APF</button>
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
