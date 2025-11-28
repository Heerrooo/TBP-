import React from 'react';
import { Container, Typography, Paper, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';

const Hotels = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search for Hotels
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="City, hotel, area or landmark" variant="outlined" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Check-in" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Check-out" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Guests" type="number" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Rooms" type="number" InputLabelProps={{ shrink: true }} />
            </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button fullWidth variant="contained" color="primary" sx={{ height: '100%' }}>Search Hotels</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Hotels;
