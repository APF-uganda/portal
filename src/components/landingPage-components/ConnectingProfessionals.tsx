import '../../assets/css/ConnectingProfessionals.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import connectingImg from '../../assets/images/connecting.jpeg'

function ConnectingProfessionals() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <section className="connecting">
      <div className="connecting-container">
        <div className="connecting-left">
          <h2 
            ref={elementRef}
            className={`scroll-animate-heading ${isVisible ? 'visible' : ''}`}
          >
            Connecting Accounting Professionals
          </h2>
          <div className="accordion-item">
            <h3>Empowerment <span>▲</span></h3>
            <p>Access shared resources, insights and opportunities that support continuous learning and professional growth.</p>
          </div>
          <div className="accordion-item">
            <h3>Engagement <span>▼</span></h3>
          </div>
          <div className="accordion-item">
            <h3>Networking <span>▼</span></h3>
          </div>
        </div>
        <div className="connecting-right">
          <img src={connectingImg} alt="Connecting Professionals" />
        </div>
      </div>
    </section>
  )
}

export default ConnectingProfessionals
