import Slider from "react-slick";
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import annualImg from "../../assets/images/Events/annual.png";
import taxImg from "../../assets/images/Events/Tax.jpg";
import ethicsImg from "../../assets/images/Events/Ethics.jpg";
import digitalImg from "../../assets/images/Events/Digital.jpg";

const events = [
  {
    title: "Annual APF Conference 2026: Digital Transformation in Accounting",
    date: "October 15, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Join us for engaging, relevant and insightful discussions on digital transformation in accounting.",
    image: annualImg,
  },
  {
    title: "Tax Updates Workshop 2026",
    date: "February 25, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Stay informed with the latest tax regulations and compliance requirements.",
    image: taxImg,
  },
  {
    title: "Annual Ethics in Accounting Seminar",
    date: "October 18, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Explore challenges and best practices in modern accounting ethics.",
    image: ethicsImg,
  },
  {
    title: "Annual Digital Transformation Forum",
    date: "October 20, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Discover the latest trends and innovations in digital transformation.",
    image: digitalImg,
  },
];

const ArrowLeft = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-[40%] left-[-50px] z-10 bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors"
  >
    <ChevronLeft className="w-6 h-6" />
  </button>
);

const ArrowRight = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-[40%] right-[-50px] z-10 bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors"
  >
    <ChevronRight className="w-6 h-6" />
  </button>
);

const UpcomingEvents = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <ArrowRight />,
    prevArrow: <ArrowLeft />,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="py-12 bg-[#f9fafb] -mx-[50vw] ml-[50%] px-[50vw] pl-[50%]">
      <div className="max-w-[1000px] mx-auto">
        <h4 className="text-center text-2xl font-semibold mb-8">
          Upcoming Events
        </h4>
        <div className="relative">
          <Slider {...settings}>
            {events.map((event, index) => (
              <div key={index} className="px-4 py-4">
                <div className="rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between min-h-[500px] bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-[180px] w-full object-cover"
                  />
                  <div className="p-6 flex-grow flex flex-col">
                    <h6 className="text-lg text-gray-900 mb-4 font-semibold">
                      {event.title}
                    </h6>

                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      <p>{event.date}</p>
                    </div>

                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 mr-2 text-primary" />
                      <p>{event.time}</p>
                    </div>

                    <div className="flex items-center mb-4">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      <p>{event.location}</p>
                    </div>

                    <p className="text-sm mb-6 flex-grow">
                      {event.description}
                    </p>

                    <div className="flex justify-center">
                      <button className="bg-primary text-white rounded-[20px] px-16 py-2 hover:bg-primary-dark transition-colors">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;