import React from 'react';
import { Container, CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <Container sx={{ textAlign: 'center', mt: 10 }}>
      <CircularProgress />
    </Container>
  );
}
