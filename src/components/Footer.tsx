import '../assets/css/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h3 className="footer-logo">APF</h3>
          <p className="footer-tagline">Uganda Accountancy Practitioners Forum</p>
          <p>Dedicated to fostering excellence and promoting the highest standards of integrity in the Ugandan accountancy profession.</p>
          <div className="social-icons">
            <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">f</a>
            <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">𝕏</a>
            <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer">in</a>
            <a href="https://youtube.com" className="social-icon" target="_blank" rel="noopener noreferrer">▶</a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/membership">Membership</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/publications">Publications</a></li>
            <li><a href="/annual-reports">Annual Reports</a></li>
            <li><a href="/faqs">FAQs</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Connect</h4>
          <ul>
            <li><a href="/member-directory">Member Directory</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/sponsorship">Sponsorship</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 APF Uganda. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
