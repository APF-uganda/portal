import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/membershipPage-components/Hero' 
import Intro from '../components/membershipPage-components/Intro'
// import { Benefits } from '../components/membershipPage-components/Benefits'
/*import '../assets/css/UnderDevelopment.css'*/

function MembershipPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Intro />
      {/* <Benefits /> */}

      {/* <main className="under-development">
        <div className="development-content">
          <div className="construction-icon">🚧</div>
          <h1>Membership</h1>
          <p className="development-message">This page is currently under development</p>
          <p className="development-subtitle">We're working hard to bring you this content soon!</p>
          <a href="/" className="back-home-btn">Back to Home</a>
        </div>
      </main> */}
      <Footer />
    </div>
  )
}

export default MembershipPage
