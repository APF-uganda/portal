import { useEffect, useRef } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

type Event = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
};

const baseEvents: Event[] = [
  {
    title: "Annual APF Conference 2026: Digital Transformation in Accounting",
    date: "October 15, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Join us for our flagship annual event featuring keynote speakers, elections, and networking.",
    image: "/images/annual.png",
  },
  {
    title: "Tax Updates Workshop 2026",
    date: "February 12, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Stay ahead with the latest tax regulations and compliance requirements for 2026.",
    image: "/images/Tax.jpg",
  },
   {
    title: "Annual APF Conference 2026: Digital Transformation in Accounting",
    date: "October 15, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Join us for our flagship annual event featuring keynote speakers, elections, and networking.",
    image: "/images/annual.png",
  },
  {
    title: "Tax Updates Workshop 2026",
    date: "February 12, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Stay ahead with the latest tax regulations and compliance requirements for 2026.",
    image: "/images/Tax.jpg",
  },
];


const events = [...baseEvents, ...baseEvents, ...baseEvents];

const PreviousEvents = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#F5EFFB] py-12 -mx-[50vw] px-[50vw]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Previous Events</h2>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 snap-x snap-mandatory pb-4 scroll-smooth px-4
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          {events.map((event, index) => (
            <div
              key={index}
              className="min-w-[300px] max-w-sm bg-gray-50 rounded-2xl shadow-md snap-start flex-shrink-0 flex flex-col h-[500px]"
            >
              <img
                src={event.image}
                alt={event.title}
                className="h-40 w-full object-cover rounded-t-2xl"
              />
              <div className="flex flex-col justify-between flex-grow p-6">
                <div>
                  <h3 className="text-lg font-bold text-primary mb-2">{event.title}</h3>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreviousEvents;