import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const user = localStorage.getItem('token');

  const handleSignOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/');
  };

  const navLinks = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button color="inherit" component={Link} to="/">Home</Button>
      <Button color="inherit" component={Link} to="/flights">Flights</Button>
      <Button color="inherit" component={Link} to="/hotels">Hotels</Button>
      <Button color="inherit" component={Link} to="/cabs">Cabs</Button>
      {user ? (
        <>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/profile">Profile</Button>
          <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
        </>
      ) : (
        <Button color="inherit" component={Link} to="/login">Login</Button>
      )}
    </Box>
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Travel Booking
      </Typography>
      <List>
        <ListItem component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} to="/flights">
          <ListItemText primary="Flights" />
        </ListItem>
        <ListItem component={Link} to="/hotels">
          <ListItemText primary="Hotels" />
        </ListItem>
        <ListItem component={Link} to="/cabs">
          <ListItemText primary="Cabs" />
        </ListItem>
        {user ? (
          <>
            <ListItem component={Link} to="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem component={Link} to="/profile">
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem onClick={handleSignOut} sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </>
        ) : (
          <ListItem component={Link} to="/login">
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TravelExploreIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                TravelGo
                </Typography>
            </Box>
        </Link>
        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          navLinks
        )}
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};
export default Navigation;
