import './EventCard.css'

interface EventCardProps {
  image: string
  title: string
  date: string
  time: string
  location: string
  description: string
  onRegister?: () => void
}

function EventCard({ image, title, date, time, location, description, onRegister }: EventCardProps) {
  return (
    <div className="event-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p className="event-date">📅 {date}</p>
      <p className="event-time">🕐 {time}</p>
      <p className="event-location">📍 {location}</p>
      <p className="event-desc">{description}</p>
      <button className="btn-register" onClick={onRegister}>
        Register
      </button>
    </div>
  )
}

export default EventCard
