import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Grid, Alert, CircularProgress, Chip, Rating } from '@mui/material';
import { Hotel, LocationOn, AttachMoney, People, Bed } from '@mui/icons-material';

const API_BASE_URL = "http://localhost:8081/api";

const HotelBooking = () => {
  const [searchData, setSearchData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const searchHotels = async () => {
    if (!searchData.city || !searchData.checkIn || !searchData.checkOut) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/hotels/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });

      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to search hotels');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bookHotel = async (hotel) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to book hotels. Click the Login button in the navigation menu.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/hotels/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hotel: hotel.name,
          city: hotel.city,
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut
        })
      });

      if (response.ok) {
        alert('Hotel booked successfully! Check your dashboard for booking details.');
      } else if (response.status === 401) {
        setError('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to book hotel');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Book a Hotel
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Destination (City Code)" 
                name="city"
                value={searchData.city}
                onChange={handleInputChange}
                placeholder="e.g., NYC, LAX, LON"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                type="date" 
                label="Check-in Date" 
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                type="date" 
                label="Check-out Date" 
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                type="number" 
                label="Guests" 
                name="guests"
                value={searchData.guests}
                onChange={handleInputChange}
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                type="number" 
                label="Rooms" 
                name="rooms"
                value={searchData.rooms}
                onChange={handleInputChange}
                inputProps={{ min: 1, max: 5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                onClick={searchHotels}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Search Hotels'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {hotels.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Hotels
          </Typography>
          {hotels.map((hotel, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Hotel color="primary" />
                      <Box>
                        <Typography variant="h6">
                          {hotel.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {hotel.city}
                          </Typography>
                        </Box>
                        {hotel.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Rating value={hotel.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary">
                              {hotel.rating}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Check-in: {hotel.checkIn}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check-out: {hotel.checkOut}
                      </Typography>
                      {hotel.amenities && (
                        <Box sx={{ mt: 1 }}>
                          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <Chip key={idx} label={amenity} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <People color="action" />
                      <Typography variant="body2">
                        {searchData.guests} Guest{searchData.guests > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Bed color="action" />
                      <Typography variant="body2">
                        {searchData.rooms} Room{searchData.rooms > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="h6" color="primary">
                        <AttachMoney fontSize="small" />
                        {hotel.pricePerNight}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        per night
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => bookHotel(hotel)}
                        sx={{ mt: 1 }}
                        size="small"
                      >
                        {localStorage.getItem('token') ? 'Book Now' : 'Login to Book'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HotelBooking;
