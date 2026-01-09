import Navbar from '../components/Navbar'
import Hero from '../components/landingPage-components/Hero'
import Stats from '../components/landingPage-components/Stats'
import ChairMessage from '../components/landingPage-components/ChairMessage'
import ConnectingProfessionals from '../components/landingPage-components/ConnectingProfessionals'
import FeaturedEvents from '../components/landingPage-components/FeaturedEvents'
import LatestNews from '../components/landingPage-components/LatestNews'
import Partners from '../components/landingPage-components/Partners'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stats />
      <ChairMessage />
      <ConnectingProfessionals />
      <FeaturedEvents />
      <LatestNews />
      <Partners />
      <Footer />
    </div>
  )
}

export default LandingPage
