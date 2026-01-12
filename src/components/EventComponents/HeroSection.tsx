import { Box, Typography } from "@mui/material";
import heroImage from "../../assets/images/Events/Hero.jpg";

const HeroSection = () => {
    return (
        <Box
            sx={{
                position: "relative",
                height: "100vh",
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
            }}
        >
            {/* Overlay Text */}
            <Box
                sx={{
                    position: "absolute",
                    top: "45%", // vertical position
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h1"
                    fontWeight={700}
                    sx={{
                        fontSize: { xs: "3rem", md: "5rem" },
                        letterSpacing: "0.1em",
                    }}
                >
                    EVENTS
                </Typography>
            </Box>
        </Box>
    );
};

export default HeroSection;
