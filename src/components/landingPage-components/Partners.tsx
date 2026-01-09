import '../../assets/css/Partners.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

function Partners() {
  const { elementRef, isVisible } = useScrollAnimation()

  // Duplicate partners array for seamless infinite scroll
  const partners = [
    'ICPAU',
    'ACCA',
    'CPA',
    'IFAC',
    'AAT',
    'CIMA',
    'IIA',
    'ISACA'
  ]

  return (
    <section className="partners">
      <h2 
        ref={elementRef}
        className={`scroll-animate-heading ${isVisible ? 'visible' : ''}`}
      >
        Our Partners
      </h2>
      <div className="partners-scroll-container">
        <div className="partners-scroll">
          {/* First set of partners */}
          {partners.map((partner, index) => (
            <div key={`partner-1-${index}`} className="partner-logo">
              {partner}
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {partners.map((partner, index) => (
            <div key={`partner-2-${index}`} className="partner-logo">
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Partners
