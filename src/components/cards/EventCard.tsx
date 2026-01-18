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
    <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out animate-fade-in-up hover:-translate-y-2.5 hover:shadow-[0_8px_25px_rgba(124,58,237,0.2)] group">
      <div className="h-[200px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h6 className="text-secondary text-[1.1rem] mb-2 font-semibold">
          {title}
        </h6>
        <p className="text-[#666] text-[0.9rem] py-1">
          📅 {date}
        </p>
        <p className="text-[#666] text-[0.9rem] py-1">
          🕐 {time}
        </p>
        <p className="text-[#666] text-[0.9rem] py-1">
          📍 {location}
        </p>
        <p className="text-[#666] text-[0.9rem] py-1 pb-4">
          {description}
        </p>
        <button
          onClick={onRegister}
          className="w-full bg-primary text-white rounded-[25px] py-3 font-semibold transition-all duration-300 ease-in-out hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(124,58,237,0.4)]"
        >
          Register
        </button>
      </div>
    </div>
  )
}

export default EventCard
