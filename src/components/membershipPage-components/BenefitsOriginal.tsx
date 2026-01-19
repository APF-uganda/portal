import { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import image1 from "../../assets/images/membershipPage-images/image1.webp";
import image2 from "../../assets/images/membershipPage-images/image2.webp";
import image3 from "../../assets/images/membershipPage-images/image3.jpg";
import image4 from "../../assets/images/membershipPage-images/image3.jpg";

interface Benefit {
  id: string;
  title: string;
  description: string;
  image: string;
}

const benefits: Benefit[] = [
  {
    id: "b1",
    title: "Professional Recognition",
    description:
      "Be part of a recognized professional forum that promotes accountability, standards, and credibility in accounting practice.",
    image: image1,
  },
  {
    id: "b2",
    title: "Networking & Collaboration",
    description:
      "Connect with fellow practitioners, attend events, and collaborate across the profession.",
    image: image2,
  },
  {
    id: "b3",
    title: "Access to Resources & Knowledge",
    description:
      "Gain access to guidelines, tools, CPD resources, and professional updates.",
    image: image3,
  },
  {
    id: "b4",
    title: "Professional Development",
    description:
      "Enhance your skills through structured CPD programs and professional learning opportunities.",
    image: image4,
  },
];

const CARD_WIDTH = 320;
const CARD_GAP = 32;
const VISIBLE_CARDS = 3;

export default function BenefitsMuiExact(): JSX.Element {
  const maxIndex = Math.max(0, benefits.length - VISIBLE_CARDS);
  const [index, setIndex] = useState(0); 

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, maxIndex));
  }, [maxIndex]);

  return (
    <Box sx={{ background: "#fff", py: 8 }}>
      {/* TITLE */}
      <Typography
        align="center"
        sx={{ fontSize: "2rem", fontWeight: 700, mb: 4 }}
      >
        Benefits of Joining APF Uganda
      </Typography>

      {/* CAROUSEL WRAPPER */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* LEFT ARROW (ALWAYS VISIBLE) */}
        <IconButton
          onClick={prev}
          aria-label="Previous"
          sx={{
            position: "absolute",
            left: 70,
            top: "50%",
            width: 24,            
            height: 24,
            transform: "translateY(-50%)",
            background: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow: 1,
            zIndex: 5,
            opacity: index === 0 ? 0.4 : 1,
          }}
        >
          <ArrowBackIosNewIcon
            sx={{
              fontSize: 12,
              color: "#64748b",
            }}
          />
        </IconButton>

        {/* VIEWPORT (3 CARDS ONLY) */}
        <Box
          sx={{
            overflow: "hidden",
            width: CARD_WIDTH * 3 + CARD_GAP * 2,
          }}
        >
          {/* TRACK */}
          <Box
            sx={{
              display: "flex",
              gap: `${CARD_GAP}px`,
              transform: `translateX(-${
                index * (CARD_WIDTH + CARD_GAP)
              }px)`,
              transition: "transform 0.35s ease-in-out",
            }}
          >
            {benefits.map((benefit) => (
              <Card
                key={benefit.id}
                sx={{
                  flex: `0 0 ${CARD_WIDTH}px`,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  background: "#fff",
                }}
              >
                {/* IMAGE */}
                <Box sx={{ height: 200, overflow: "hidden" }}>
                  <Box
                    component="img"
                    src={benefit.image}
                    alt={benefit.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>

                {/* CONTENT */}
                <CardContent>
                  <Typography fontWeight={600} mb={1}>
                    {benefit.title}
                  </Typography>
                  <Typography fontSize="0.9rem" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* RIGHT ARROW (ALWAYS VISIBLE) */}
        <IconButton
          onClick={next}
          aria-label="Next"
          sx={{
            position: "absolute",
            right: 70,
            top: "50%",
            width: 24,            
            height: 24,
            transform: "translateY(-50%)",
            background: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow: 1,
            zIndex: 5,
            opacity: index === maxIndex ? 0.4 : 1,
          }}
        >
          <ArrowForwardIosIcon 
           sx={{
              fontSize: 12,
              color: "#64748b",
            }}
          
          />
        </IconButton>
      </Box>

      {/* DOTS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          gap: 1,
        }}
      >
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: i === index ? "#6c5ce7" : "#d1d5db",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
