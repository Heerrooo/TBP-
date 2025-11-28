import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Grid, Alert, CircularProgress, Chip } from '@mui/material';
import { DirectionsCar, LocationOn, AttachMoney, AccessTime, Person } from '@mui/icons-material';

const API_BASE_URL = "http://localhost:8081/api";

const CabBooking = () => {
  const [searchData, setSearchData] = useState({
    pickup: '',
    dropoff: '',
    pickupTime: ''
  });
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const searchCabs = async () => {
    if (!searchData.pickup || !searchData.dropoff || !searchData.pickupTime) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/cabs/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });

      if (response.ok) {
        const data = await response.json();
        setCabs(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to search cabs');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bookCab = async (cab) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to book cabs. Click the Login button in the navigation menu.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cabs/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pickup: cab.pickup,
          dropoff: cab.dropoff,
          pickupTime: cab.pickupTime
        })
      });

      if (response.ok) {
        alert('Cab booked successfully! Check your dashboard for booking details.');
      } else if (response.status === 401) {
        setError('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to book cab');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Book a Cab
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Pick-up Location" 
                name="pickup"
                value={searchData.pickup}
                onChange={handleInputChange}
                placeholder="e.g., Times Square, New York"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Drop-off Location" 
                name="dropoff"
                value={searchData.dropoff}
                onChange={handleInputChange}
                placeholder="e.g., JFK Airport, New York"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                type="datetime-local" 
                label="Pick-up Time" 
                name="pickupTime"
                value={searchData.pickupTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                onClick={searchCabs}
                disabled={loading}
                sx={{ height: '100%' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Search Cabs'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {cabs.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Cabs
          </Typography>
          {cabs.map((cab, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DirectionsCar color="primary" />
                      <Box>
                        <Typography variant="h6">
                          {cab.provider}
                        </Typography>
                        <Chip 
                          label={cab.vehicleType} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          From: {cab.pickup}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          To: {cab.dropoff}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime color="action" />
                      <Box>
                        <Typography variant="body2">
                          {cab.estimatedDuration}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cab.pickupTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" color="primary">
                          <AttachMoney fontSize="small" />
                          {cab.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cab.currency}
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => bookCab(cab)}
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

export default CabBooking;
