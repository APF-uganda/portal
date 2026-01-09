import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../assets/css/UnderDevelopment.css'

function AboutPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="under-development">
        <div className="development-content">
          <div className="construction-icon">🚧</div>
          <h1>About APF</h1>
          <p className="development-message">This page is currently under development</p>
          <p className="development-subtitle">We're working hard to bring you this content soon!</p>
          <a href="/" className="back-home-btn">Back to Home</a>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage
