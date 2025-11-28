import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Paper, Box, Grid, Card, CardContent, Alert, CircularProgress, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FlightTakeoff, Hotel, DirectionsCar, History, Person, TrendingUp } from '@mui/icons-material';

const API_BASE_URL = "http://localhost:8081/api";

const Dashboard = () => {
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError("Please login to view dashboard");
        setLoading(false);
        return;
      }

      try {
        // Fetch profile data
        const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        }

        // Fetch booking history
        const bookingsResponse = await fetch(`${API_BASE_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        } else if (bookingsResponse.status === 401) {
          setError("Your session has expired. Please login again.");
          localStorage.removeItem('token');
          localStorage.removeItem('email');
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/');
  };

  const goToFlights = () => navigate('/flights');
  const goToHotels = () => navigate('/hotels');
  const goToCabs = () => navigate('/cabs');
  const goToProfile = () => navigate('/profile');

  const getBookingStats = () => {
    const flightBookings = bookings.filter(b => b.type?.toLowerCase() === 'flight').length;
    const hotelBookings = bookings.filter(b => b.type?.toLowerCase() === 'hotel').length;
    const cabBookings = bookings.filter(b => b.type?.toLowerCase() === 'cab').length;
    const totalBookings = bookings.length;

    return { flightBookings, hotelBookings, cabBookings, totalBookings };
  };

  const getBookingIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'flight':
        return <FlightTakeoff color="primary" />;
      case 'hotel':
        return <Hotel color="secondary" />;
      case 'cab':
        return <DirectionsCar color="success" />;
      default:
        return <History color="action" />;
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

  const stats = getBookingStats();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="primary" />
            Welcome, {profile.name || email || 'Guest'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {profile.email || email}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={goToProfile}>
            View Profile
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.totalBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Bookings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FlightTakeoff color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.flightBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Flight Bookings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Hotel color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="secondary">
                {stats.hotelBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hotel Bookings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <DirectionsCar color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success">
                {stats.cabBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cab Bookings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp color="primary" />
              Quick Actions
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Choose a service to get started:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={goToFlights} startIcon={<FlightTakeoff />}>
                Book Flights
              </Button>
              <Button variant="contained" onClick={goToHotels} startIcon={<Hotel />}>
                Book Hotels
              </Button>
              <Button variant="contained" onClick={goToCabs} startIcon={<DirectionsCar />}>
                Book Cabs
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History color="primary" />
              Recent Bookings
            </Typography>
            
            {bookings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <History sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No bookings yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start booking to see your recent activity here.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {bookings.slice(0, 5).map((booking, index) => (
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
                          #{booking.id}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {booking.details}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {bookings.length > 5 && (
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={goToProfile}
                    sx={{ mt: 1 }}
                  >
                    View All Bookings
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
