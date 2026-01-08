import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">APF</div>
        <ul className="nav-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About APF</a></li>
          <li><a href="#membership">Membership</a></li>
          <li><a href="#events">Events & CPD</a></li>
          <li><a href="#news">News & Insights</a></li>
          <li><a href="#contact">Contact & Enquiries</a></li>
        </ul>
        <div className="nav-buttons">
          <button className="btn-outline">Quick Links</button>
          <button className="btn-primary">Members Login</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
