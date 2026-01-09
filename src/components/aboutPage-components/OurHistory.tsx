import '../../assets/css/OurHistory.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

function OurHistory() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <section className="our-history">
      <div className="history-container">
        <div className="history-content">
          <div className="history-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 
            ref={elementRef}
            className={`scroll-animate-heading ${isVisible ? 'visible' : ''}`}
          >
            Our History
          </h2>
          <p>
            The Accountancy Practitioners Forum (APF Uganda) is the leading professional 
            body dedicated to advancing the accountancy profession in Uganda. We uphold 
            ethical standards, foster professional development, and advocate for policies 
            that benefit our members and the nation's economic growth.
          </p>
        </div>
        
        <div className="history-sidebar">
          <div className="sidebar-link">
            <span className="link-icon">👤</span>
            <span>Become a Member</span>
          </div>
          <div className="sidebar-link">
            <span className="link-icon">📅</span>
            <span>Our Events</span>
          </div>
          <div className="sidebar-link">
            <span className="link-icon">📰</span>
            <span>News & Insights</span>
          </div>
          <div className="sidebar-link">
            <span className="link-icon">💬</span>
            <span>Chairman's message</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurHistory
