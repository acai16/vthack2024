import React, { useState, useEffect } from 'react';
import { useRedirectFunctions, useAuthInfo, useLogoutFunction } from '@propelauth/react';
import { Box, Button, Typography, Container, CircularProgress, Card, CardContent, Grid } from '@mui/material';
import forestVideo from "../assets/background/Aviate.mov";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from 'axios';

function Login() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const { redirectToLoginPage, redirectToSignupPage } = useRedirectFunctions();
  const { user, isLoggedIn, loading, error } = useAuthInfo();
  const logoutFunction = useLogoutFunction();
  const [hikes, setHikes] = useState([]);
  const [birdsInfo, setBirdsInfo] = useState({});

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchHikes();
    }
  }, [isLoggedIn, user]);

  const fetchHikes = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get_hikes/${user.userId}`);
      const hikesData = response.data.hikes;
      setHikes(hikesData);
      fetchBirdDetails(hikesData); // Fetch details for each bird
    } catch (error) {
      console.error('Error fetching hikes:', error);
    }
  };

  const fetchBirdDetails = async (hikes) => {
    const birdIds = hikes.flatMap(hike => hike.birds_seen);
    const uniqueBirdIds = [...new Set(birdIds)];

    const birdsData = {};
    await Promise.all(uniqueBirdIds.map(async (birdId) => {
      try {
        const response = await axios.get(`http://localhost:5001/api/get_bird_info/${birdId}`);
        birdsData[birdId] = response.data.bird_info;
      } catch (error) {
        console.error(`Error fetching bird info for bird ID ${birdId}:`, error);
      }
    }));

    setBirdsInfo(birdsData);
  };

  const renderContent = () => {
    if (loading) {
      return <CircularProgress />;
    }

    if (error) {
      return <Typography color="error">Error: {error.message}</Typography>;
    }

    if (isLoggedIn && user) {
      return (
        <>
          <Typography
            variant="h1"
            color="white"
            mb={3}
            sx={{
              fontSize: isMdDown ? "3rem" : "4rem",
              fontWeight: 700,
            }}
          >
            Welcome, {user.email}!
          </Typography>
          <Box mt={3}>
            {hikes.length > 0 ? (
              <Grid container spacing={2}>
                {hikes.map((hike, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                      <CardContent>
                        <Typography variant="h6">Hike {index + 1}</Typography>
                        <Typography variant="body2">Length: {hike.length} seconds</Typography>
                        <Typography variant="body2">Started: {new Date(hike.time_started).toLocaleString()}</Typography>
                        {hike.birds_seen && hike.birds_seen.length > 0 ? (
                          hike.birds_seen.map((birdId, birdIndex) => {
                            const birdInfo = birdsInfo[birdId];
                            return birdInfo ? (
                              <Box key={birdIndex} mt={1}>
                                <Typography variant="body2">
                                  Common Name: {birdInfo.common_name}
                                </Typography>
                                <Typography variant="body2">
                                  Scientific Name: {birdInfo.scientific_name}
                                </Typography>
                                <Typography variant="body2">
                                  Start Time: {birdInfo.start_time} seconds
                                </Typography>
                                <Typography variant="body2">
                                  End Time: {birdInfo.end_time} seconds
                                </Typography>
                                <Typography variant="body2">
                                  Confidence: {birdInfo.confidence}%
                                </Typography>
                                <Typography variant="body2">
                                  Label: {birdInfo.label}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" key={birdIndex}>Loading bird data...</Typography>
                            );
                          })
                        ) : (
                          <Typography variant="body2">No bird data available.</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="white">No hikes recorded yet.</Typography>
            )}
          </Box>
          <Button variant="contained" color="primary" onClick={logoutFunction} sx={{ mt: 2 }}>
            Logout
          </Button>
        </>
      );
    }

    return (
      <>
        <Typography
          variant="h1"
          color="white"
          mb={3}
          sx={{
            fontSize: isMdDown ? "3rem" : "4rem",
            fontWeight: 700,
          }}
        >
          Welcome to Aviate.ai
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => redirectToLoginPage()}
            sx={{ mr: 2 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => redirectToSignupPage()}
            sx={{ borderColor: 'white', color: 'white' }}
          >
            Sign Up
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Box component="div" position="relative" overflow="hidden" minHeight="100vh">
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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        position="relative"
        zIndex={1}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
        }}
      >
        <Container>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
}

export default Login;
