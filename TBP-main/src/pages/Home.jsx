import React from 'react';
import { Box, Typography, Button, Tabs, Tab, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import FlightBooking from '../components/FlightBooking';
import HotelBooking from '../components/HotelBooking';
import CabBooking from '../components/CabBooking';

const HeroSection = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  background: `url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop') no-repeat center center`,
  backgroundSize: 'cover',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
}));

const HeroContent = styled('div')(({ theme }) => ({
    position: 'relative',
    textAlign: 'center',
    padding: theme.spacing(4),
}));

const Home = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <HeroSection>
        <HeroContent>
          <Typography variant="h2" component="h1" gutterBottom>
            Your Journey Begins Here
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Discover and book flights, hotels, and cabs all in one place.
          </Typography>
          <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
            Explore Now
          </Button>
        </HeroContent>
      </HeroSection>
        <Paper sx={{ maxWidth: 1200, margin: '-80px auto 32px auto', position: 'relative', zIndex: 1 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Flights" />
            <Tab label="Hotels" />
            <Tab label="Cabs" />
            </Tabs>
            {tabIndex === 0 && <FlightBooking />}
            {tabIndex === 1 && <HotelBooking />}
            {tabIndex === 2 && <CabBooking />}
      </Paper>
    </>
  );
};

export default Home;
