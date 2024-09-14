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

function MainLanding() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate('/about');
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
        </Container>
      </Box>
    </Box>
  );
}

export default MainLanding;