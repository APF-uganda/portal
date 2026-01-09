import '../../assets/css/OurGovernance.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import ronaldImg from '../../assets/images/aboutPage-images/CPA Ronald Katumba.jpg'
import sarahImg from '../../assets/images/aboutPage-images/CPA Sarah Nejesa.webp'
import michaelImg from '../../assets/images/aboutPage-images/CPA Michael Tugyetwena.png'
import johnImg from '../../assets/images/aboutPage-images/CPA John kato.webp'
import arindaImg from '../../assets/images/aboutPage-images/CPA Arinda Jolus.jpg'
import patienceImg from '../../assets/images/aboutPage-images/CPA Patience Atuhaire.jpg'

function OurGovernance() {
  const { elementRef, isVisible } = useScrollAnimation()

  const leaders = [
    { name: 'CPA Ronald Katumba', role: 'Chairperson', image: ronaldImg },
    { name: 'CPA Sarah Nejesa', role: 'Vice Chairperson', image: sarahImg },
    { name: 'CPA Michael Tugyetwena', role: 'Director', image: michaelImg },
    { name: 'CPA John Kato', role: 'Secretary', image: johnImg },
    { name: 'CPA Arinda Jolus', role: 'Technical lead', image: arindaImg },
    { name: 'CPA Patience Atuhaire', role: 'Chief Accountant', image: patienceImg }
  ]

  return (
    <section className="our-governance">
      <div className="governance-container">
        <h2 
          ref={elementRef}
          className={`scroll-animate-heading ${isVisible ? 'visible' : ''}`}
        >
          Our Governance
        </h2>
        <p className="governance-subtitle">
          Meet the dedicated leaders who steer APF Uganda towards its vision of 
          professional excellence and integrity.
        </p>
        
        <div className="leaders-grid">
          {leaders.map((leader, index) => (
            <div key={index} className="leader-card">
              <div className="leader-image">
                <img src={leader.image} alt={leader.name} />
              </div>
              <h3 className="leader-name">{leader.name}</h3>
              <p className="leader-role">{leader.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurGovernance
