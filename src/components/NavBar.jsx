import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useAuthInfo } from '@propelauth/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import aviateLogo from '../assets/images/aviate4.png';

function NavBar() {
  const location = useLocation();
  const { isLoggedIn } = useAuthInfo();
  const isOnBirdTrackingPage = location.pathname === '/bird-tracking';

  return (
    <AppBar
      position="fixed"
      sx={{
        background: isOnBirdTrackingPage ? 'rgba(23, 23, 79, 0.09)' : 'transparent',
        boxShadow: 'none',
        color: isOnBirdTrackingPage ? 'black' : 'white'
      }}
    >
      <Toolbar>
        {isOnBirdTrackingPage ? (
          <Box
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img src={aviateLogo} alt="Aviate.ai Logo" style={{ height: '40px' }} />
          </Box>
        ) : (
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            Aviate.ai
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {[
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/contact" },
            { name: "Bird Tracking", path: "/bird-tracking" },
            { name: "Bird Forum", path: "/bird-forum" }  // Add this new link
          ].map((item) => (
            <Button
              key={item.name}
              component={Link}
              to={item.path}
              sx={{
                color: 'inherit',
                '&:hover': {
                  backgroundColor: isOnBirdTrackingPage ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {item.name}
            </Button>
          ))}
          <Button
            color="inherit"
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              ml: 2,
              border: '1px solid',
              '&:hover': {
                backgroundColor: isOnBirdTrackingPage ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {isLoggedIn ? 'Account' : 'Login'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;