import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Import your video file
import forestVideo from "./assets/background/Aviate.mov";
// Import your logo file
import logoImage from "./assets/images/aviate4.png";

function MainLanding() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate('/about');
  };

  const handleGetStarted = () => {
    navigate('/bird-tracking');
  };

  return (
    <Box component="header" position="relative" overflow="hidden">
      {/* Video background */}
      <Box
        component="video"
        src={forestVideo}
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      {/* Content of MainLanding */}
      <Box
        display="flex"
        alignItems="center"
        minHeight="100vh"
        position="relative"
        zIndex={1}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional background overlay
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h1"
                color="white"
                mb={3}
                sx={{
                  fontSize: isMdDown ? "3rem" : "4rem",
                  fontWeight: 700,
                }}
              >
                Aviate.ai
              </Typography>
              <Typography
                variant="body1"
                color="white"
                opacity={0.8}
                mb={3}
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 400,
                }}
              >
                Discover Nature’s Voices, Protect Their Habitats.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGetStarted}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontSize: '1rem',
                    padding: '0.75rem 1.5rem',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="text"
                  onClick={handleReadMore}
                  sx={{
                    color: 'white',
                    fontSize: '1rem',
                    padding: '0.75rem 1.5rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Read more
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={logoImage}
                alt="Aviate.ai Logo"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: isMdDown ? '200px' : '500px',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default MainLanding;