import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useAuthInfo } from '@propelauth/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import aviateLogo from '../assets/images/aviate4.png';

function NavBar() {
  const location = useLocation();
  const { isLoggedIn } = useAuthInfo();
  const isOnBirdTrackingPage = location.pathname === '/bird-tracking';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Bird Tracking", path: "/bird-tracking" },
    { name: "Bird Book", path: "/bird-forum" }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.name} component={Link} to={item.path}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        <ListItem button component={Link} to="/login">
          <ListItemText primary={isLoggedIn ? 'Account' : 'Login'} />
        </ListItem>
      </List>
    </Box>
  );

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
        {isMobile ? (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {navItems.map((item) => (
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
        )}
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

export default NavBar;