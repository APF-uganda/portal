import { useState } from "react";
import {
    Calendar,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

type Event = {
    title: string;
    time: string;
    location: string;
    description: string;
};

const events: Record<string, Event> = {
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
        description:
            "Explore ethical challenges and best practices in modern accountancy.",
    },
};

const generateCalendar = (year: number, month: number): (string | null)[] => {
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
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState("");

    const calendarDates = generateCalendar(year, month);
    const selectedEvent = events[selectedDate];

    const monthLabel = new Date(year, month).toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const handlePrev = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
        setSelectedDate("");
    };

    const handleNext = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
        setSelectedDate("");
    };

    return (
        <section className="bg-[#f3e8ff] py-12 -mx-[50vw] px-[50vw]">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Our Event Calendar
                </h2>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Calendar */}
                    <div className="flex-1 bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={handlePrev}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h3 className="text-lg font-semibold text-gray-700">
                                {monthLabel}
                            </h3>
                            <button
                                onClick={handleNext}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day}>{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {calendarDates.map((date, i) => {
                                if (!date) return <div key={i}></div>;
                                const fullDate = `${year}-${String(month + 1).padStart(
                                    2,
                                    "0"
                                )}-${date.padStart(2, "0")}`;
                                const isToday =
                                    fullDate ===
                                    `${today.getFullYear()}-${String(
                                        today.getMonth() + 1
                                    ).padStart(2, "0")}-${String(today.getDate()).padStart(
                                        2,
                                        "0"
                                    )}`;
                                const hasEvent = events[fullDate];
                                const isSelected = fullDate === selectedDate;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedDate(fullDate)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer mx-auto transition-all duration-300
                                            ${isSelected
                                                ? "bg-[#6D28D9] text-white font-bold" 
                                                : hasEvent
                                                    ? "ring-2 ring-[#6D28D9] text-gray-900 hover:bg-[#6D28D9] hover:text-white"
                                                    : isToday
                                                        ? "bg-black text-white font-semibold"
                                                        : "text-gray-900 hover:bg-gray-200"
                                            }`}
                                    >
                                        {date}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 bg-white rounded-xl shadow p-6 animate-fade-in-up">
                        {selectedEvent ? (
                            <>
                                <h4 className="text-xl font-bold text-primary mb-4">
                                    {selectedEvent.title}
                                </h4>
                                <div className="flex items-center text-gray-700 mb-2">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>{selectedDate}</span>
                                </div>
                                <div className="flex items-center text-gray-700 mb-2">
                                    <Clock className="w-5 h-5 mr-2" />
                                    <span>{selectedEvent.time}</span>
                                </div>
                                <div className="flex items-center text-gray-700 mb-4">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    <span>{selectedEvent.location}</span>
                                </div>
                                <p className="text-gray-600">{selectedEvent.description}</p>
                            </>
                        ) : (
                            <p className="text-gray-500">
                                Select a date to view event details.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventCalendar;
