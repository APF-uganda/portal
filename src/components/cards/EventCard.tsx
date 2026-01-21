import { Clock, MapPin } from 'lucide-react'

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
    <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="h-[180px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-gray-800 text-base font-bold mb-4 leading-tight min-h-[48px]">
          {title}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>{time}</span>
          </div>
          <div className="flex items-start gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{location}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-5 min-h-[60px]">
          {description}
        </p>
        <button
          onClick={onRegister}
          className="w-full bg-white text-purple-700 border-2 border-purple-700 rounded-lg py-2.5 font-semibold text-sm transition-all duration-300 hover:bg-purple-700 hover:text-white"
        >
          Register
        </button>
      </div>
    </div>
  )
}

export default EventCard
