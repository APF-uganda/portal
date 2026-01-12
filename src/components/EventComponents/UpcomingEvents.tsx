import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
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
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "40%",
      left: -50, // more space from cards
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
      right: -50, // more space from cards
      zIndex: 1,
      bgcolor: "#7c3aed",
      color: "#fff",
      "&:hover": { bgcolor: "#6d28d9" },
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
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
    <Box
      sx={{
        py: 6,
        bgcolor: "#f9fafb",
        mx: "calc(50% - 50vw)",
        px: "calc(50vw - 50%)",
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          Upcoming Events
        </Typography>
        <Box sx={{ position: "relative" }}>
          <Slider {...settings}>
            {events.map((event, index) => (
              <Box key={index} sx={{ px: 2, py: 2 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 500, // equal height for all cards
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

                    <Box display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#7c3aed",
                          color: "#fff",
                          borderRadius: "20px",
                          px: 8, // wider button
                          "&:hover": { backgroundColor: "#6d28d9" },
                        }}
                      >
                        Register
                      </Button>
                    </Box>
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

export default UpcomingEvents;