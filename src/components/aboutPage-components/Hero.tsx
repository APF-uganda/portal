import '../../assets/css/AboutHero.css'
import heroImg from '../../assets/images/aboutPage-images/haro_section.jpg'

function Hero() {
  return (
    <section className="about-hero">
      <img src={heroImg} alt="APF Uganda Team" className="about-hero-bg" />
      <div className="about-hero-overlay">
        <h1>About APF Uganda</h1>
      </div>
    </section>
  )
}

export default Hero
