import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import GroupsIcon from "@mui/icons-material/Groups";

const CPDSection = () => {
  return (
    <Box
      sx={{
        py: 6,
        bgcolor: "#f3e8ff", // soft purple background
        mx: "calc(50% - 50vw)", // full-bleed trick
        px: "calc(50vw - 50%)",
        textAlign: "center",
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 3 }}>
        <Typography variant="h4" mb={2}>
          CPD Accreditation
        </Typography>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Elevate Your Expertise with APF CPD
        </Typography>
        <Typography variant="body1" maxWidth="700px" mx="auto" mb={4}>
          Our Continuous Professional Development (CPD) programs are meticulously designed to ensure
          accountancy practitioners in Uganda remain at the forefront of industry knowledge, ethical
          standards, and professional skills.
        </Typography>

        <List sx={{ maxWidth: 700, mx: "auto", textAlign: "left" }}>
          <ListItem>
            <ListItemIcon>
              <TrendingUpIcon sx={{ color: "#7c3aed" }} />
            </ListItemIcon>
            <ListItemText primary="Stay updated with the latest industry trends and regulations." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SchoolIcon sx={{ color: "#7c3aed" }} />
            </ListItemIcon>
            <ListItemText primary="Enhance your professional skills and competencies." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon sx={{ color: "#7c3aed" }} />
            </ListItemIcon>
            <ListItemText primary="Access exclusive workshops, webinars, and conferences." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <VerifiedIcon sx={{ color: "#7c3aed" }} />
            </ListItemIcon>
            <ListItemText primary="Maintain your professional license and credibility." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GroupsIcon sx={{ color: "#7c3aed" }} />
            </ListItemIcon>
            <ListItemText primary="Network with leading professionals in the accountancy field." />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default CPDSection;