import React from 'react';
import { Box, Container, Typography } from '@mui/material';

// Minimal/empty dashboard per request — features removed
const Dashboard = () => (
  <Container maxWidth="lg" sx={{ py: 8 }}>
    <Box sx={{ textAlign: 'center', py: 12 }}>
      <Typography variant="h3" component="h1" gutterBottom>Dashboard</Typography>
      <Typography variant="body1" color="text.secondary">This dashboard has been emptied. Features and visualizers have been removed.</Typography>
    </Box>
  </Container>
);

export default Dashboard;