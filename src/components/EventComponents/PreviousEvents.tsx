import { useEffect, useRef, useState } from "react"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { baseEvents } from "./eventsData"

const PreviousEvents = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined)

  // Auto-scroll every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 340, behavior: "smooth" })
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Calculate max card height dynamically based on content
  useEffect(() => {
    if (scrollRef.current) {
      const heights = Array.from(scrollRef.current.children).map(
        (child) => (child as HTMLElement).scrollHeight
      )
      if (heights.length > 0) {
        setCardHeight(Math.max(...heights))
      }
    }
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

  // Utility: check if event has expired
  const isExpired = (dateStr: string) => {
    const eventDate = new Date(dateStr)
    const now = new Date()
    return eventDate < now
  }

  const previousEvents = baseEvents.filter((event) => isExpired(event.date))

  return (
    <section className="bg-[#F5EFFB] py-12 -mx-[50vw] px-[50vw]">
      <div className="max-w-7xl mx-auto px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Previous Events
        </h2>

        <div className="flex items-center gap-4">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="bg-[#7E49B3] text-white rounded-full shadow p-3 hover:bg-[#3C096C] transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 snap-x snap-mandatory pb-4 scroll-smooth
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex-grow"
          >
            {previousEvents.map((event, index) => (
              <div
                key={index}
                className="min-w-[300px] max-w-sm bg-gray-50 rounded-2xl shadow-md snap-start flex-shrink-0 flex flex-col"
                style={{ height: cardHeight ? `${cardHeight}px` : "auto" }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-40 w-full object-cover rounded-t-2xl"
                />
                <div className="flex flex-col justify-between flex-grow p-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-700 mb-1">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                  {/* No register button for expired events */}
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="bg-[#7E49B3] text-white rounded-full shadow p-3 hover:bg-[#3C096C] transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default PreviousEvents