import React from 'react';
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function NavBar() {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'transparent', 
        boxShadow: 'none',
        color: 'white'
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
            { name: "Contact Us", path: "/contact" }  // This line is already correct
          ].map((item) => (
            <Button
              key={item.name}
              component={Link}
              to={item.path}
              sx={{ 
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
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
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
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