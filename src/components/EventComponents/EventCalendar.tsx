import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const events: Record<string, {
  title: string;
  time: string;
  location: string;
  description: string;
}> = {
  "2026-10-15": {
    title: "Annual APF Conference 2026: Digital Transformation in Accounting",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Join leading experts to explore the impact of digital technologies on the accounting profession. Sessions include AI in audit.",
  },
  "2026-10-24": {
    title: "Ethics in Accounting Seminar",
    time: "2:00 PM – 4:00 PM",
    location: "APF Training Center",
    description: "Explore ethical challenges and best practices in modern accountancy.",
  },
};

const generateCalendar = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar: (string | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push(i.toString());
  }
  return calendar;
};

const EventCalendar = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`
  );

  const calendarDates = generateCalendar(currentYear, currentMonth);
  const selectedEvent = events[selectedDate];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate("");
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate("");
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-[#f3e8ff] py-12 -mx-[50vw] ml-[50%] px-[50vw] pl-[50%]">
      <div className="max-w-[1000px] mx-auto px-4">
        <h4 className="text-center text-2xl font-semibold mb-8">
          Our Event Calendar
        </h4>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Calendar Card */}
          <div className="flex-1 bg-white rounded-3xl shadow-md p-6">
            <div className="flex justify-center items-center mb-4">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h6 className="text-lg font-semibold mx-4">
                {monthName}
              </h6>
              <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-semibold text-sm">
                  {day}
                </div>
              ))}

              {calendarDates.map((date, i) => {
                if (!date) return <div key={i}></div>;
                const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${date.padStart(2, "0")}`;
                const event = events[fullDate];
                const isSelected = fullDate === selectedDate;
                const isToday =
                  fullDate ===
                  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
                    today.getDate()
                  ).padStart(2, "0")}`;

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(fullDate)}
                    className={`p-2 cursor-pointer rounded-full w-10 h-10 flex items-center justify-center mx-auto transition-all duration-300 ${
                      isSelected
                        ? "bg-primary text-white font-semibold"
                        : isToday
                        ? "bg-primary text-white font-semibold"
                        : event
                        ? "bg-secondary text-white font-semibold"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    {date}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Details Card */}
          <div className="flex-1 bg-white rounded-3xl shadow-md p-6">
            {selectedEvent ? (
              <>
                <h6 className="text-lg text-secondary font-semibold mb-4">
                  {selectedEvent.title}
                </h6>
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <p>{selectedDate}</p>
                </div>
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2" />
                  <p>{selectedEvent.time}</p>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <p>{selectedEvent.location}</p>
                </div>
                <p>{selectedEvent.description}</p>
              </>
            ) : (
              <p>Select a date to view event details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;