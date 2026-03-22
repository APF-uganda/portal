import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import SEO from '../components/common/SEO'
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
  const location = useLocation();
  const memberSlug = searchParams.get('member');

  useEffect(() => {
    if (location.hash !== '#governance') return;

    // Wait one frame so the section is guaranteed to be in the DOM.
    const id = window.requestAnimationFrame(() => {
      const section = document.getElementById('governance');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    return () => window.cancelAnimationFrame(id);
  }, [location.hash]);

  if (memberSlug) {
    return <BoardMemberProfilePage forcedSlug={memberSlug} />;
  }

  return (
    <div>
      <SEO 
        title="About Us"
        description="Learn about the Accountancy Practitioners Forum - our history, vision, mission, governance structure, and leadership team dedicated to advancing accountancy in Uganda."
        keywords="about APF, accountancy Uganda, governance, leadership, vision, mission, history"
      />
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
