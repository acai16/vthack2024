import React from 'react';
import { Link, useLocation } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function NavBar() {
  const location = useLocation();

  const isOnBirdTrackingPage = location.pathname === '/bird-tracking';

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: isOnBirdTrackingPage ? 'rgba(211, 211, 211, 0.7)' : 'transparent', 
        boxShadow: 'none',
        color: isOnBirdTrackingPage ? 'black' : 'white'
      }}
    >
      <Toolbar>
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
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {[
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/contact" },
            { name: "Bird Tracking", path: "/bird-tracking" }
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
        </Box>
        <Button
          color="inherit"
          sx={{ 
            display: { md: 'none' },
            '&:hover': {
              backgroundColor: isOnBirdTrackingPage ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Menu
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;