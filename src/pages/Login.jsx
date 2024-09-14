import React from 'react';
import { useRedirectFunctions, useAuthInfo, useLogoutFunction } from '@propelauth/react';
import { Box, Button, Typography, Container, CircularProgress } from '@mui/material';
import forestVideo from "../assets/background/Aviate.mov";
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery";

function Login() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const { redirectToLoginPage, redirectToSignupPage } = useRedirectFunctions();
  const { user, isLoggedIn, loading, error } = useAuthInfo();
  const logoutFunction = useLogoutFunction();

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
          <Button variant="contained" color="primary" onClick={logoutFunction}>
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