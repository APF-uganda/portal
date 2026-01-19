// import { Link } from 'react-router-dom'
// import { Construction } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/membershipPage-components/Hero' 
import Intro from '../components/membershipPage-components/Intro'
import Benefits  from '../components/membershipPage-components/Benefits'
import MembershipProcess from '../components/membershipPage-components/application'
import MembershipRequirements from '../components/membershipPage-components/requirements'


function MembershipPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Intro />
      <Benefits />
      <MembershipProcess />
      <MembershipRequirements />
      <Footer />
    </div>
  )
}

export default MembershipPage
