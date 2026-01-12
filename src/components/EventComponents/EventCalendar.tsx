import {
  Box,
  Typography,
  Paper,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
    <Box
      sx={{
        bgcolor: "#f3e8ff",
        py: 6,
        // full-bleed trick
        mx: "calc(50% - 50vw)",
        px: "calc(50vw - 50%)",
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 2 }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          Our Event Calendar
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Calendar Card */}
          <Card sx={{ flex: 1, borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <IconButton onClick={handlePrevMonth}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h6" fontWeight={600} mx={2}>
                  {monthName}
                </Typography>
                <IconButton onClick={handleNextMonth}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 1,
                  textAlign: "center",
                }}
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <Box key={day} sx={{ fontWeight: 600 }}>
                    {day}
                  </Box>
                ))}

                {calendarDates.map((date, i) => {
                  if (!date) return <Box key={i}></Box>;
                  const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${date.padStart(2, "0")}`;
                  const event = events[fullDate];
                  const isSelected = fullDate === selectedDate;
                  const isToday =
                    fullDate ===
                    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
                      today.getDate()
                    ).padStart(2, "0")}`;

                  return (
                    <Paper
                      key={i}
                      onClick={() => setSelectedDate(fullDate)}
                      sx={{
                        p: 1,
                        cursor: "pointer",
                        bgcolor: isSelected
                          ? "#7c3aed"
                          : isToday
                          ? "#7c3aed"
                          : event
                          ? "secondary.main"
                          : "background.paper",
                        color: isSelected || isToday || event ? "#fff" : "text.primary",
                        fontWeight: isSelected || isToday || event ? 600 : 400,
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        transition: "0.3s",
                      }}
                    >
                      {date}
                    </Paper>
                  );
                })}
              </Box>
            </CardContent>
          </Card>

          {/* Event Details Card */}
          <Card sx={{ flex: 1, borderRadius: 3 }}>
            <CardContent>
              {selectedEvent ? (
                <>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    {selectedEvent.title}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography>{selectedDate}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    <Typography>{selectedEvent.time}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOnIcon sx={{ mr: 1 }} />
                    <Typography>{selectedEvent.location}</Typography>
                  </Box>
                  <Typography>{selectedEvent.description}</Typography>
                </>
              ) : (
                <Typography variant="body1">Select a date to view event details.</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default EventCalendar;