import '../../assets/css/FeaturedEvents.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import EventCard from '../cards/EventCard'
import event1Img from '../../assets/images/event1.jpg'
import event2Img from '../../assets/images/event2.jpeg'
import event3Img from '../../assets/images/event3.jpeg'

interface Event {
  image: string
  title: string
  date: string
  time: string
  location: string
  description: string
}

function FeaturedEvents() {
  const { elementRef, isVisible } = useScrollAnimation()

  const events: Event[] = [
    {
      image: event1Img,
      title: 'Annual APF Conference 2026: Digital Transformation',
      date: 'January 15, 2026',
      time: '8:00 AM - 5:00 PM',
      location: 'Kampala Serena Hotel, Kampala',
      description: 'Join us for our flagship annual event featuring keynote speakers, interactive sessions, and networking opportunities.'
    },
    {
      image: event2Img,
      title: 'Tax Updates Workshop 2026',
      date: 'February 10, 2026',
      time: '9:00 AM - 4:00 PM',
      location: 'Sheraton Hotel, Kampala',
      description: 'Stay ahead with the latest tax regulations and compliance requirements.'
    },
    {
      image: event3Img,
      title: 'Annual Digital Transformation Forum',
      date: 'March 20, 2026',
      time: '9:00 AM - 4:00 PM',
      location: 'Kampala Serena Hotel, Kampala',
      description: 'Discover how technology is reshaping the accounting profession.'
    }
  ]

  const handleRegister = (eventTitle: string) => {
    console.log('Register for:', eventTitle)
    // Add registration logic here
  }

  return (
    <section className="events">
      <h2 
        ref={elementRef}
        className={`scroll-animate-heading ${isVisible ? 'visible' : ''}`}
      >
        Featured Events & CPD
      </h2>
      <div className="events-grid">
        {events.map((event, index) => (
          <EventCard
            key={index}
            image={event.image}
            title={event.title}
            date={event.date}
            time={event.time}
            location={event.location}
            description={event.description}
            onRegister={() => handleRegister(event.title)}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturedEvents
