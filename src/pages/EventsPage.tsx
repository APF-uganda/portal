import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';
import HeroSection from '../components/EventComponents/HeroSection';
import EventCalendar from '../components/EventComponents/EventCalendar';
import UpcomingEvents from '../components/EventComponents/UpcomingEvents';
import PreviousEvents from '../components/EventComponents/PreviousEvents';
import CPDSection from '../components/EventComponents/CPDSection';

function EventsPage() {
  return (
    <div>
      <SEO 
        title="Events"
        description="Explore upcoming CPD events, workshops, and networking opportunities for accounting professionals. Register for events and earn CPD points with APF."
        keywords="CPD events, accounting workshops, professional development, networking, APF events"
      />
      <Navbar />
      <HeroSection />
      <div className="max-w-7xl mx-auto">
        <EventCalendar />
        <UpcomingEvents />
        <PreviousEvents />
        <CPDSection />
      </div>
      <Footer />
    </div>
  );
}

export default EventsPage;