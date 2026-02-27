import { useRef, useState, useEffect } from "react"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEvents } from "../../hooks/useCMS"

const PreviousEvents = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  
  // 1. Fetch live data from CMS
  const { events, loading } = useEvents()

  // 2. Filter logic for expired events
  const previousEvents = events.filter((event) => {
    if (!event.date) return false
    const eventDate = new Date(event.date)
    const now = new Date()
    return eventDate < now
  })

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20 bg-[#F5EFFB]">
      <Loader2 className="animate-spin text-purple-600" />
    </div>
  )

  if (previousEvents.length === 0) return null

  return (
    <section className="bg-[#F5EFFB] py-16 -mx-[50vw] px-[50vw] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
              Past Events
            </h2>
            <p className="text-purple-600 font-bold text-xs uppercase tracking-[0.2em] mt-2">
              Relive our recent gatherings
            </p>
          </div>
          
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="bg-white text-purple-600 border border-purple-100 rounded-xl p-3 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-white text-purple-600 border border-purple-100 rounded-xl p-3 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scroll-smooth
                     [&::-webkit-scrollbar]:hidden flex-grow"
        >
          {previousEvents.map((event) => (
            <div
              key={event.id || event.documentId}
              className="w-[85vw] md:w-[350px] snap-start flex-shrink-0 bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-900/5 border border-white flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || '/images/placeholder.jpg'}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                <span className="absolute bottom-4 left-6 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30">
                  Completed
                </span>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2 leading-tight uppercase tracking-tight">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500 text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-3 text-purple-500" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  
                  {event.time && (
                    <div className="flex items-center text-gray-500 text-sm font-medium">
                      <Clock className="w-4 h-4 mr-3 text-purple-500" />
                      <span>{event.time}</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-500 text-sm font-medium">
                    <MapPin className="w-4 h-4 mr-3 text-purple-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-6 italic">
                  {event.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-50">
                   <button 
                    disabled 
                    className="w-full text-center text-slate-300 font-black text-[10px] uppercase tracking-widest cursor-not-allowed"
                   >
                    Registration Closed
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Indicator */}
        <div className="flex justify-center mt-4 gap-1 md:hidden">
          {previousEvents.map((_, i) => (
            <div key={i} className="h-1 w-4 bg-purple-200 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PreviousEvents;