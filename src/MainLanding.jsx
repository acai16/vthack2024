import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Import your video file
import forestVideo from "./assets/background/Aviate.mov";

function HeaderOne() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

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

      {/* Navbar and content */}
      <Box component="nav" position="absolute" top="0.5rem" width="100%" zIndex={1}>
        <Container>
          <Grid container flexDirection="row" alignItems="center">
            <Typography
              component={Link}
              href="#"
              variant="h6"
              color="white"
              fontWeight="bold"
              py={1}
              mr={2}
              sx={{ textTransform: 'none', fontSize: '1.25rem' }}
            >
              Material Design
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ display: { xs: "block", lg: "none" }, ml: "auto", fontSize: '1.25rem', p: 1.5 }}
            >
              <Box component="i" color="white" className="fas fa-bars" />
            </Button>
            <Box
              component="ul"
              display={{ xs: "none", lg: "flex" }}
              p={0}
              my={0}
              mx="auto"
              sx={{ listStyle: "none" }}
            >
              {["Home", "About Us", "Contact Us"].map((item) => (
                <Box component="li" key={item}>
                  <Typography
                    component={Link}
                    href="#"
                    variant="h6"
                    color="white"
                    fontWeight="bold"
                    p={2}
                    onClick={(e) => e.preventDefault()}
                    sx={{ textTransform: 'none', fontSize: '1.25rem' }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              component="ul"
              display={{ xs: "none", lg: "flex" }}
              p={0}
              m={0}
              sx={{ listStyle: "none" }}
            >
              {["fab fa-twitter", "fab fa-facebook", "fab fa-instagram"].map((icon) => (
                <Box component="li" key={icon}>
                  <Typography
                    component={Link}
                    href="#"
                    variant="h6"
                    p={2}
                    onClick={(e) => e.preventDefault()}
                    sx={{ fontSize: '1.5rem' }}
                  >
                    <Box component="i" color="white" className={icon} />
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Container>
      </Box>
      
      {/* Content of HeaderOne */}
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
        <Container>
          <Grid container item xs={12} md={7} lg={6} flexDirection="column" justifyContent="center">
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
              pr={6} 
              mr={6}
              sx={{
                fontSize: "1.25rem",
                fontWeight: 400,
              }}
            >
              The time is now for it be okay to be great. People in this world shun people for being
              nice.
            </Typography>
            <Stack direction="row" spacing={1} mt={3}>
              <Button 
                variant="contained" 
                color="primary"
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
        </Container>
      </Box>
    </Box>
  );
}

export default HeaderOne;
