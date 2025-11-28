import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Grid, Chip, Alert, CircularProgress } from '@mui/material';
import { FlightTakeoff, FlightLand, AccessTime, AttachMoney } from '@mui/icons-material';

const API_BASE_URL = "http://localhost:8081/api";

const FlightBooking = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    adults: 1
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const searchFlights = async () => {
    if (!searchData.from || !searchData.to || !searchData.departureDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/flights/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });

      if (response.ok) {
        const data = await response.json();
        setFlights(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to search flights');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bookFlight = async (flight) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to book flights. Click the Login button in the navigation menu.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/flights/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          flightNumber: flight.flightNumber,
          from: flight.from,
          to: flight.to,
          departureDate: searchData.departureDate
        })
      });

      if (response.ok) {
        alert('Flight booked successfully! Check your dashboard for booking details.');
      } else if (response.status === 401) {
        setError('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to book flight');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Book a Flight
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="From (Airport Code)" 
                name="from"
                value={searchData.from}
                onChange={handleInputChange}
                placeholder="e.g., JFK, LAX"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="To (Airport Code)" 
                name="to"
                value={searchData.to}
                onChange={handleInputChange}
                placeholder="e.g., LAX, JFK"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                type="date" 
                label="Departure Date" 
                name="departureDate"
                value={searchData.departureDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                type="date" 
                label="Return Date (Optional)" 
                name="returnDate"
                value={searchData.returnDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                type="number" 
                label="Adults" 
                name="adults"
                value={searchData.adults}
                onChange={handleInputChange}
                inputProps={{ min: 1, max: 9 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                onClick={searchFlights}
                disabled={loading}
                sx={{ height: '100%' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Search Flights'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {flights.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Flights
          </Typography>
          {flights.map((flight, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlightTakeoff color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {flight.from}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {flight.departureTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlightLand color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {flight.to}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {flight.arrivalTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime color="primary" />
                      <Box>
                        <Typography variant="body2">
                          {flight.airline || 'Airline'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {flight.flightNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" color="primary">
                          <AttachMoney fontSize="small" />
                          {flight.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {flight.currency}
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => bookFlight(flight)}
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

export default FlightBooking;
