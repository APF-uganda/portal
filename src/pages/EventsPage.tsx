import { Box, Container } from '@mui/material';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/EventComponents/HeroSection';
import EventCalendar from '../components/EventComponents/EventCalendar';
import UpcomingEvents from '../components/EventComponents/UpcomingEvents';
import PreviousEvents from '../components/EventComponents/PreviousEvents';
import CPDSection from '../components/EventComponents/CPDSection';

function EventsPage() {
  return (
    <Box>
      <Navbar />
      <HeroSection />
      <Container maxWidth="lg">
        <EventCalendar />
        <UpcomingEvents />
        <PreviousEvents />
        <CPDSection />
      </Container>
      <Footer />
    </Box>
  );
}

export default EventsPage;