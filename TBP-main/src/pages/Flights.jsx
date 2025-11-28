import React from 'react';
import { Container, Typography, Paper, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';

const Flights = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search for Flights
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="From" variant="outlined" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="To" variant="outlined" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Departure Date" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Return Date" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Passengers" type="number" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Button fullWidth variant="contained" color="primary" sx={{ height: '100%' }}>Search Flights</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Flights;
