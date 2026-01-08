import './ConnectingProfessionals.css'
import connectingImg from '../assets/connecting.jpeg'

function ConnectingProfessionals() {
  return (
    <section className="connecting">
      <div className="connecting-container">
        <div className="connecting-left">
          <h2>Connecting Accounting Professionals</h2>
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
