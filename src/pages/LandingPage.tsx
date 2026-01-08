import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import ChairMessage from '../components/ChairMessage'
import ConnectingProfessionals from '../components/ConnectingProfessionals'
import FeaturedEvents from '../components/FeaturedEvents'
import LatestNews from '../components/LatestNews'
import Partners from '../components/Partners'
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
