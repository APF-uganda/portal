import { useState, useMemo } from "react"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useEvents } from "../../hooks/useCMS"
import { useNavigate } from 'react-router-dom';

const isExpired = (dateStr: string) => {
  if (!dateStr) return true;
  const eventDate = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return eventDate < now
}

const generateCalendar = (year: number, month: number): (string | null)[] => {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const calendar: (string | null)[] = Array(firstDay).fill(null)
  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push(i.toString())
  }
  return calendar
}

const EventCalendar = () => {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState("")
  const navigate = useNavigate();
  
  const { events, loading } = useEvents()
  
  // Maps dates to event objects for easy calendar lookup
  const eventsMap = useMemo(() => {
    const map: Record<string, any> = {}
    events.forEach(event => {
      if (!event.date) return;
      const d = new Date(event.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      map[key] = event
    })
    return map
  }, [events])

  const calendarDates = generateCalendar(year, month)
  const rawSelectedEvent = eventsMap[selectedDate]

  const selectedEvent = useMemo(() => {
    if (!rawSelectedEvent) return null;
    return {
      ...rawSelectedEvent,
      id: rawSelectedEvent.id || rawSelectedEvent.documentId,
      title: rawSelectedEvent.title || "Untitled Event",
      location: rawSelectedEvent.location || "Location TBD",
      description: rawSelectedEvent.description || "No description available.",
      time: rawSelectedEvent.time || null,
      image: rawSelectedEvent.image?.data?.attributes?.url || rawSelectedEvent.image || ""
    };
  }, [rawSelectedEvent]);

  const monthLabel = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const handlePrev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1) } 
    else { setMonth(month - 1) }
    setSelectedDate("")
  }

  const handleNext = () => {
    if (month === 11) { setMonth(0); setYear(year + 1) } 
    else { setMonth(month + 1) }
    setSelectedDate("")
  }

  // Navigation Logic that matches the working EventCard pattern
  // Inside EventCalendar.tsx
const handleRegisterClick = (event: any) => {
  if (!event) return;

  // Format the date here to be human-readable
  const readableDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  navigate('/event-registration', { 
    state: { 
      eventTitle: event.title, 
      eventId: event.id,
      location: event.location, 
      date: readableDate,      
      image: event.image
    } 
  });
};
  return (
    <section className="bg-[#f3e8ff] py-12 -mx-[50vw] px-[50vw]">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 uppercase tracking-tighter">
          Event Calendar
        </h2>
        
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-[#7E49B3] mb-2" size={32} />
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Fetching Calendar...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Calendar Grid */}
            <div className="flex-1 bg-white rounded-[2rem] shadow-sm p-8 border border-purple-100">
              <div className="flex justify-between items-center mb-6">
                <button onClick={handlePrev} className="p-2 hover:bg-purple-50 rounded-full transition-colors text-purple-600">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{monthLabel}</h3>
                <button onClick={handleNext} className="p-2 hover:bg-purple-50 rounded-full transition-colors text-purple-600">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-3">
                {calendarDates.map((date, i) => {
                  if (!date) return <div key={i}></div>
                  const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${date.padStart(2, "0")}`
                  const hasEvent = eventsMap[fullDate]
                  const isSelected = fullDate === selectedDate
                  const isToday = fullDate === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
                  
                  const showEventRing = hasEvent && !isExpired(hasEvent.date)

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(fullDate)}
                      className={`aspect-square flex items-center justify-center rounded-2xl text-sm font-bold transition-all relative
                        ${isSelected 
                          ? "bg-[#7E49B3] text-white scale-110 shadow-lg z-10" 
                          : isToday 
                            ? "bg-purple-700 text-white shadow-md ring-4 ring-purple-100 font-black" // Bold purple highlight for today
                            : "text-gray-400 hover:bg-gray-100"
                        }
                        ${!isSelected && showEventRing ? "border-2 border-[#7E49B3] text-[#7E49B3]" : ""}
                      `}
                    >
                      {date}
                      {!isSelected && hasEvent && isExpired(hasEvent.date) && (
                        <div className="absolute bottom-1 w-1 h-1 bg-slate-300 rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Event Details */}
            <div className="flex-1 bg-white rounded-[2rem] shadow-sm p-8 min-h-[400px] border border-slate-100">
              {selectedEvent ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 ${isExpired(selectedEvent.date) ? 'bg-slate-100 text-slate-500' : 'bg-purple-100 text-purple-600'}`}>
                    {isExpired(selectedEvent.date) ? 'Past Event' : 'Upcoming Event'}
                  </span>
                  <h4 className="text-2xl font-black text-gray-900 mb-6 leading-tight uppercase tracking-tighter">
                    {selectedEvent.title}
                  </h4>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-600 font-medium">
                      <Calendar className="w-5 h-5 mr-3 text-purple-500" />
                      <span>{new Date(selectedEvent.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 font-medium">
                      <Clock className="w-5 h-5 mr-3 text-purple-500" />
                      <span>
                        {typeof selectedEvent.time === 'string' && selectedEvent.time.length > 0 
                          ? selectedEvent.time 
                          : "Time to be announced"}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 font-medium">
                      <MapPin className="w-5 h-5 mr-3 text-purple-500" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    {selectedEvent.description}
                  </p>

                  {!isExpired(selectedEvent.date) ? (
                    <button
                      onClick={() => handleRegisterClick(selectedEvent)}
                      className="w-full bg-[#7E49B3] text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#3C096C] transition-all"
                    >
                      Secure Your Spot
                    </button>
                  ) : (
                    <div className="w-full bg-gray-50 text-gray-400 rounded-2xl py-4 text-center font-bold text-xs uppercase border border-dashed border-slate-200">
                      Registration Closed
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="text-slate-300" />
                   </div>
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                     Select an active date with a <br/> <span className="text-[#7E49B3]">purple ring</span> to view details
                   </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventCalendar;