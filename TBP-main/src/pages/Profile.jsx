import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert, CircularProgress, Card, CardContent, Grid, Chip } from '@mui/material';
import { Person, Email, LocationOn, Phone, History, FlightTakeoff, Hotel, DirectionsCar } from '@mui/icons-material';

const API_BASE_URL = "http://localhost:8081/api";

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', address: '', phone: '', email: '' });
  const [bookings, setBookings] = useState([]);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("Please login to view profile");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else if (response.status === 401) {
          setError("Your session has expired. Please login again.");
          localStorage.removeItem('token');
          localStorage.removeItem('email');
        } else {
          setError("Failed to load profile");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      if (!token) {
        setBookingsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else if (response.status === 401) {
          // Session expired, handled in fetchProfile
        } else {
          console.error("Failed to load bookings");
        }
      } catch (error) {
        console.error("Network error loading bookings:", error);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchProfile();
    fetchBookings();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          address: profile.address,
          phone: profile.phone
        })
      });
      if (response.ok) {
        setEdit(false);
        alert('Profile updated successfully!');
      } else if (response.status === 401) {
        setError("Your session has expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('email');
      } else {
        setError("Failed to update profile");
      }
    } catch {
      setError("Network error");
    }
  };

  const getBookingIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'flight':
        return <FlightTakeoff color="primary" />;
      case 'hotel':
        return <Hotel color="primary" />;
      case 'cab':
        return <DirectionsCar color="primary" />;
      default:
        return <History color="primary" />;
    }
  };

  const getBookingColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'flight':
        return 'primary';
      case 'hotel':
        return 'secondary';
      case 'cab':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="primary" />
              Profile
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                label="Email" 
                value={profile.email || ''} 
                InputProps={{ 
                  readOnly: true,
                  startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                }} 
              />
              <TextField 
                label="Name" 
                name="name" 
                value={profile.name || ''} 
                onChange={handleChange} 
                disabled={!edit}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              <TextField 
                label="Address" 
                name="address" 
                value={profile.address || ''} 
                onChange={handleChange} 
                disabled={!edit}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              <TextField 
                label="Phone" 
                name="phone" 
                value={profile.phone || ''} 
                onChange={handleChange} 
                disabled={!edit}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              {!edit ? (
                <Button variant="contained" onClick={() => setEdit(true)}>
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={() => setEdit(false)}>
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Booking History Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History color="primary" />
              Booking History
            </Typography>
            
            {bookingsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : bookings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <History sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No bookings yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start booking flights, hotels, or cabs to see your history here.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {bookings.map((booking, index) => (
                  <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        {getBookingIcon(booking.type)}
                        <Chip 
                          label={booking.type} 
                          color={getBookingColor(booking.type)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Booking #{booking.id}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {booking.details}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Booked on: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
