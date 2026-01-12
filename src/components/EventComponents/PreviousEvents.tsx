import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";
import Slider from "react-slick";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import annualImg from "../../assets/images/Events/annual.png";
import taxImg from "../../assets/images/Events/Tax.jpg";

const previousEvents = [
  {
    title: "Annual APF Conference 2026: Digital Transformation in Accounting",
    date: "October 15, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Join us for our flagship annual event featuring keynote speakers, elections, and networking.",
    image: annualImg,
  },
  {
    title: "Tax Updates Workshop 2026",
    date: "February 12, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Stay ahead with the latest tax regulations and compliance requirements for 2026.",
    image: taxImg,
  },
  // Duplicate for slider effect
  {
    title: "Annual APF Conference 2026: Digital Transformation in Accounting",
    date: "October 15, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Join us for our flagship annual event featuring keynote speakers, elections, and networking.",
    image: annualImg,
  },
  {
    title: "Tax Updates Workshop 2026",
    date: "February 12, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Sheraton Kampala Hotel, Kampala",
    description:
      "Stay ahead with the latest tax regulations and compliance requirements for 2026.",
    image: taxImg,
  },
];

// Custom arrow components
const ArrowLeft = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "40%",
      left: -50,
      zIndex: 1,
      bgcolor: "#7c3aed",
      color: "#fff",
      "&:hover": { bgcolor: "#6d28d9" },
    }}
  >
    <ArrowBackIosNewIcon />
  </IconButton>
);

const ArrowRight = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "40%",
      right: -50,
      zIndex: 1,
      bgcolor: "#7c3aed",
      color: "#fff",
      "&:hover": { bgcolor: "#6d28d9" },
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
);

const PreviousEvents = () => {
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
    <Box
      sx={{
        py: 6,
        bgcolor: "#f5f5f5",
        mx: "calc(50% - 50vw)",
        px: "calc(50vw - 50%)",
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          Previous Events
        </Typography>
        <Box sx={{ position: "relative" }}>
          <Slider {...settings}>
            {previousEvents.map((event, index) => (
              <Box key={index} sx={{ px: 2, py: 2 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 500,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={event.image}
                    alt={event.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      {event.title}
                    </Typography>

                    <Box display="flex" alignItems="center" mb={1}>
                      <CalendarTodayIcon sx={{ mr: 1, color: "#7c3aed" }} />
                      <Typography>{event.date}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                      <AccessTimeIcon sx={{ mr: 1, color: "#7c3aed" }} />
                      <Typography>{event.time}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationOnIcon sx={{ mr: 1, color: "#7c3aed" }} />
                      <Typography>{event.location}</Typography>
                    </Box>

                    <Typography variant="body2" mb={3}>
                      {event.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    </Box>
  );
};

export default PreviousEvents;