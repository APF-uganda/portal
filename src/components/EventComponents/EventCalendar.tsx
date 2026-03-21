import { useState, useMemo, useEffect } from "react" 
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { useEvents } from "../../hooks/useCMS"
import { useNavigate } from 'react-router-dom'

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const navigate = useNavigate()
  
  const { events } = useEvents()
  
  const DESCRIPTION_LIMIT = 150

  // 1. Logic to find the "Next Upcoming Event" and auto-select it
  useEffect(() => {
    if (!loading && events.length > 0 && selectedDate === "") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

     
      const futureEvents = events
        .filter(e => e.date && new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (futureEvents.length > 0) {
        const nextEvent = futureEvents[0];
        const d = new Date(nextEvent.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        
        // Update calendar view to the month of the next event
        setYear(d.getFullYear());
        setMonth(d.getMonth());
        // Select the date
        setSelectedDate(key);
      }
    }
  }, [events, loading, selectedDate]);
  
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
    
    setIsDescriptionExpanded(false)
  }

  const handleNext = () => {
    if (month === 11) { setMonth(0); setYear(year + 1) } 
    else { setMonth(month + 1) }
    setIsDescriptionExpanded(false)
  }

  const getTruncatedDescription = (description: string) => {
    if (!description) return "No description available."
    if (description.length <= DESCRIPTION_LIMIT) return description
    return description.substring(0, DESCRIPTION_LIMIT) + "..."
  }

  const getFullDescription = (description: string) => {
    return description || "No description available."
  }

  const handleRegisterClick = (event: any) => {
    if (!event) return;
    const readableDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    navigate('/event-registration', { 
      state: { 
        ...event, 
        eventTitle: event.title, 
        eventId: event.id,
        location: event.location, 
        date: readableDate,      
        image: event.image
      } 
    });
  };

  return (
    <section className="bg-[#f3e8ff] py-8 -mx-[50vw] px-[50vw]">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Event Calendar
        </h2>
        
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-[#7E49B3] mb-2" size={32} />
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Fetching Calendar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100 h-[420px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrev} className="p-1.5 hover:bg-purple-50 rounded-full transition-colors text-purple-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-gray-800">{monthLabel}</h3>
                <button onClick={handleNext} className="p-1.5 hover:bg-purple-50 rounded-full transition-colors text-purple-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-3">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 flex-1">
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
                      onClick={() => {
                        setSelectedDate(fullDate)
                        setIsDescriptionExpanded(false)
                      }}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative
                        ${isSelected 
                          ? "bg-[#7E49B3] text-white scale-105 shadow-md z-10" 
                          : isToday 
                            ? "bg-purple-100 text-[#7E49B3] ring-1 ring-[#7E49B3] font-semibold" 
                            : "text-gray-600 hover:bg-gray-50"
                        }
                        ${!isSelected && showEventRing ? "border-2 border-[#7E49B3] text-[#7E49B3] font-semibold" : ""}
                      `}
                    >
                      {date}
                      {!isSelected && hasEvent && isExpired(hasEvent.date) && (
                        <div className="absolute bottom-0.5 w-1 h-1 bg-slate-400 rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6 h-[420px] border border-slate-100 flex flex-col">
              {selectedEvent ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col h-full">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 self-start ${isExpired(selectedEvent.date) ? 'bg-slate-100 text-slate-600' : 'bg-purple-100 text-purple-700'}`}>
                    {selectedEvent.date === selectedDate && !events.find(e => e.date === selectedDate) ? 'Next Event' : (isExpired(selectedEvent.date) ? 'Past Event' : 'Upcoming Event')}
                  </span>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                    {selectedEvent.title}
                  </h4>
                  
                  <div className="space-y-2.5 mb-4 flex-shrink-0">
                    <div className="flex items-center text-gray-600 font-medium text-sm">
                      <Calendar className="w-4 h-4 mr-2.5 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{new Date(selectedEvent.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                    </div>
                   
                    <div className="flex items-center text-gray-600 font-medium text-sm">
                      <Clock className="w-4 h-4 mr-2.5 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{selectedEvent.time || "Time TBD"}</span>
                    </div>
                    <div className="flex items-center text-gray-600 font-medium text-sm">
                      <MapPin className="w-4 h-4 mr-2.5 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{selectedEvent.location}</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto mb-4 pr-1 custom-scrollbar"> 
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {isDescriptionExpanded 
                        ? getFullDescription(selectedEvent.description)
                        : getTruncatedDescription(selectedEvent.description)
                      }
                    </p>
                    {selectedEvent.description?.length > DESCRIPTION_LIMIT && (
                      <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="mt-2 text-purple-600 text-xs font-medium">
                        {isDescriptionExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {!isExpired(selectedEvent.date) ? (
                      <button
                        onClick={() => handleRegisterClick(selectedEvent)}
                        className="w-full bg-[#7E49B3] text-white rounded-full py-3 font-semibold text-sm shadow-md hover:bg-[#3C096C] transition-all"
                      >
                        Register
                      </button>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-500 rounded-lg py-3 text-center font-medium text-sm">
                        Registration Closed
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                   <Calendar className="text-slate-300 w-12 h-12 mb-3" />
                   <p className="text-slate-500 text-sm">Select a date to view details</p>
                </div>
              )}
            </div>
          </div>
      </div>
    </section>
  )
}

export default EventCalendar;
