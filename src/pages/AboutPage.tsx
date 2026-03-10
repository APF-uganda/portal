import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/aboutPage-components/Hero'
import OurHistory from '../components/aboutPage-components/OurHistory'
import Timeline from '../components/aboutPage-components/Timeline'
import OurWork from '../components/aboutPage-components/OurWork'
import VisionMission from '../components/aboutPage-components/VisionMission'
import OurGovernance from '../components/aboutPage-components/OurGovernance'
import JoinCTA from '../components/aboutPage-components/JoinCTA'
import BoardMemberProfilePage from './BoardMemberProfilePage';

function AboutPage() {
  const [searchParams] = useSearchParams();
  const memberSlug = searchParams.get('member');

  if (memberSlug) {
    return <BoardMemberProfilePage forcedSlug={memberSlug} />;
  }

  return (
    <div>
      <Navbar />
      <Hero />
      <OurHistory />
      <Timeline />
      <OurWork />
      <VisionMission />
      <OurGovernance />
      <JoinCTA />
      <Footer />
    </div>
  )
}

export default AboutPage
