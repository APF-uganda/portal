import './ChairMessage.css'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import chairmanImg from '../assets/chairman.jpg'

function ChairMessage() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <section className="chair-message">
      <div className="chair-container">
        <div className="chair-image">
          <img 
            src={chairmanImg} 
            alt="CPA Ronald Mukumba - Chairperson APF Uganda" 
            onError={(e) => {
              console.error('Image failed to load:', chairmanImg)
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="chair-text">
          <h2 
            ref={elementRef}
            className={`scroll-animate-heading ${isVisible ? 'visible' : ''}`}
          >
            Message from the Chair
          </h2>
          <p>It is with immense pleasure that I welcome you to the Accountancy Practitioners Forum (APF Uganda). Our mission is clear: to champion advocacy, integrity, and innovation within the accounting profession across Uganda. We are committed to fostering a culture of excellence where continuous learning is paramount, and where the collective voice of our members drives meaningful change. Together, we build a stronger, more credible profession for a prosperous future.</p>
          <p className="chair-name"><strong>CPA Ronald Mukumba</strong></p>
          <p className="chair-title">Chairperson - APF Uganda</p>
          <button className="read-full" onClick={() => console.log('Navigate to full message')}>Read Full Message →</button>
        </div>
      </div>
    </section>
  )
}

export default ChairMessage
