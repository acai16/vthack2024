import React from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Import your video file
import forestVideo from "../assets/background/Aviate.mov";  // Adjust the path as necessary

function Contact() {
  return (
    <Box component="div" position="relative" overflow="hidden" minHeight="100vh">
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
      
      {/* Content overlay */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight="100vh"
        position="relative"
        zIndex={1}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional background overlay
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom color="white">
            Contact Us
          </Typography>
          <Typography variant="body1" color="white">
            Welcome to the Contact page! Here you can put your contact information or a contact form.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Contact;