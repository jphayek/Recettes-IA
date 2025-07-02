import React, { useEffect, useState } from 'react';
import { Container, Typography, Divider, Box, CircularProgress } from '@mui/material';
import RecetteCard from './RecetteCard';
import { Link } from 'react-router-dom';

export default function RecetteList() {
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/recettes')
      .then(res => res.json())
      .then(data => {
        setRecettes(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: 700, color: '#1976d2' }}
      >
        Nos délicieuses recettes
      </Typography>
      <Divider sx={{ mb: 4, width: '60px', mx: 'auto', borderBottomWidth: 3, borderColor: '#1976d2' }} />

      {recettes.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
          Aucune recette trouvée.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {recettes.map(r => (
            <RecetteCard key={r.id} recette={r} />
          ))}
        </Box>
      )}
    </Container>
  );
}
