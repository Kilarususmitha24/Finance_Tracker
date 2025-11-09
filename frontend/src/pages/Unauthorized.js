import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>Unauthorized</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You do not have permission to view this page.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">Go to Home</Button>
      </Box>
    </Box>
  );
}
