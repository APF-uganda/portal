import '../../assets/css/OurWork.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import workImg from '../../assets/images/aboutPage-images/our_work1.png'

function OurWork() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <section className="our-work">
      <div className="work-container">
        <div className="work-text">
          <h2 
            ref={elementRef}
            className={`scroll-animate-heading ${isVisible ? 'visible' : ''}`}
          >
            Our Work
          </h2>
          <p>
            APF supports its accounting professionals through advocacy, consultation, 
            and professional development. We promote ethical practice, influence policy, 
            shape standards and provide platforms that help practitioners thrive, 
            innovate and lead within the profession.
          </p>
        </div>
        <div className="work-image">
          <img src={workImg} alt="APF Team Collaboration" />
        </div>
      </div>
    </section>
  )
}

export default OurWork
