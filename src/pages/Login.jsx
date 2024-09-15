import React, { useState, useEffect } from 'react';
import { useRedirectFunctions, useAuthInfo, useLogoutFunction } from '@propelauth/react';
import { Box, Button, Typography, Container, CircularProgress, Card, CardContent, Grid, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import forestVideo from "../assets/background/Aviate.mov";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'w'; // Replace with your actual Unsplash access key

function Login() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const { redirectToLoginPage, redirectToSignupPage } = useRedirectFunctions();
  const { user, isLoggedIn, loading, error } = useAuthInfo();
  const logoutFunction = useLogoutFunction();
  const [hikes, setHikes] = useState([]);
  const [birdsInfo, setBirdsInfo] = useState({});
  const [expandedHikes, setExpandedHikes] = useState({});
  const [backgroundImages, setBackgroundImages] = useState({});

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchHikes();
    }
  }, [isLoggedIn, user]);

  const fetchHikes = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get_hikes_from_id/${user.userId}`);
      const hikesData = response.data.hikes;
      setHikes(hikesData);
      fetchBirdDetails(hikesData);
      hikesData.forEach(hike => fetchBackgroundImage(hike.hike_id));
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

  const fetchBackgroundImage = async (hikeId) => {
    try {
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          query: 'nature scenery',
          orientation: 'landscape',
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });
      setBackgroundImages(prev => ({
        ...prev,
        [hikeId]: response.data.urls.regular,
      }));
    } catch (error) {
      console.error('Error fetching background image:', error);
    }
  };

  const toggleExpand = (hikeId) => {
    setExpandedHikes(prev => ({
      ...prev,
      [hikeId]: !prev[hikeId]
    }));
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
            variant="h2"
            color="white"
            mb={4}
            sx={{
              fontSize: isMdDown ? "2.5rem" : "3.5rem",
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Your Hiking Adventures
          </Typography>
          <Box mt={3}>
            {hikes.length > 0 ? (
              <Grid container spacing={3}>
                {hikes.map((hike, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ 
                      height: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundImage: `url(${backgroundImages[hike.hike_id]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'brightness(0.6)',
                          zIndex: 0,
                        }}
                      />
                      <CardContent sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        position: 'relative',
                        zIndex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        pb: 0,
                      }}>
                        <Box mb={2}>
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            Hike {index + 1}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                            Duration: {Math.floor(hike.length / 60)} min {hike.length % 60} sec
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }} noWrap>
                            Started: {new Date(hike.time_started).toLocaleString()}
                          </Typography>
                          {hike.birds_seen && hike.birds_seen.length > 0 && (
                            <Typography variant="body2" mt={1} sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                              Birds Spotted: {hike.birds_seen.length}
                            </Typography>
                          )}
                        </Box>
                        {hike.birds_seen && hike.birds_seen.length > 0 && (
                          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Collapse in={expandedHikes[hike.hike_id]} sx={{ flexGrow: 1, overflow: 'auto' }}>
                              <Box sx={{ maxHeight: '120px', overflowY: 'auto', pr: 1 }}>
                                {hike.birds_seen.map((birdId, birdIndex) => {
                                  const birdInfo = birdsInfo[birdId];
                                  return birdInfo ? (
                                    <Box key={birdIndex} mt={1} sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: '4px' }}>
                                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                        {birdInfo.common_name}
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.8 }}>
                                        {birdInfo.scientific_name}
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                        Confidence: {Math.round(birdInfo.confidence * 100)}%
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Typography variant="body2" key={birdIndex} sx={{ opacity: 0.7, fontSize: '0.8rem' }}>
                                      Loading bird data...
                                    </Typography>
                                  );
                                })}
                              </Box>
                            </Collapse>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 1 }}>
                              <IconButton 
                                onClick={() => toggleExpand(hike.hike_id)}
                                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                              >
                                {expandedHikes[hike.hike_id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="white" variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                No hikes recorded yet. Time to start your adventure!
              </Typography>
            )}
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={logoutFunction} 
            sx={{ 
              mt: 4, 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
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
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          Welcome to Aviate.ai
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => redirectToLoginPage()}
            sx={{ mr: 2, backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            onClick={() => redirectToSignupPage()}
            sx={{ borderColor: 'white', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
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
