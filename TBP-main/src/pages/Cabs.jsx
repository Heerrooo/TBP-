import React from 'react';
import { Container, Typography, Paper, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';

const Cabs = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book a Cab
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Pickup Location" variant="outlined" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Dropoff Location" variant="outlined" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Pickup Date & Time" type="datetime-local" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button fullWidth variant="contained" color="primary" sx={{ height: '100%' }}>Search Cabs</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Cabs;
