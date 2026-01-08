import './FeaturedEvents.css'
import event1Img from '../assets/event1.jpg'
import event2Img from '../assets/event2.jpeg'
import event3Img from '../assets/event3.jpeg'

interface Event {
  image: string
  title: string
  date: string
  time: string
  location: string
  description: string
}

function FeaturedEvents() {
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

  return (
    <section className="events">
      <h2>Featured Events & CPD</h2>
      <div className="events-grid">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <img src={event.image} alt={event.title} />
            <h3>{event.title}</h3>
            <p className="event-date">📅 {event.date}</p>
            <p className="event-time">🕐 {event.time}</p>
            <p className="event-location">📍 {event.location}</p>
            <p className="event-desc">{event.description}</p>
            <button className="btn-register">Register</button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedEvents
