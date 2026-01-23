import { useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import EventCard from "../common/EventCard"
import { baseEvents } from "./eventsData"

const UpcomingEvents = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 340, behavior: "smooth" })
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" })
    }
  }

  // Filter upcoming events (date >= today)
  const today = new Date()
  const upcomingEvents = baseEvents.filter(
    (event) => new Date(event.date) >= today
  )

  return (
    <section className="bg-white py-12 -mx-[50vw] px-[50vw]">
      <div className="max-w-7xl mx-auto px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Upcoming Events
        </h2>

        <div className="flex items-center gap-4">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="bg-[#7E49B3] text-white rounded-full shadow p-3 
                       hover:bg-[#3C096C] transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 snap-x snap-mandatory pb-4 scroll-smooth
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex-grow"
          >
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="min-w-[300px] max-w-sm snap-start flex-shrink-0"
              >
                <EventCard
                  image={event.image}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  description={event.description}
                  onRegister={() => {
                    // Later: route to your EventRegistration form
                    console.log(`Register clicked for ${event.title}`)
                  }}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="bg-[#7E49B3] text-white rounded-full shadow p-3 
                       hover:bg-[#3C096C] transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents