import React, { useEffect, useState } from 'react';
import { Container, Typography, Divider, Box, CircularProgress, Button } from '@mui/material';
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
     
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <Typography
      variant="h3"
      component="h1"
      sx={{ fontWeight: 700, color: '#1976d2', pb: 1 }}
    >
      Nos délicieuses recettes
    </Typography>
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '6px',
        width: '100%',
        backgroundColor: '#1976d2',
        borderRadius: '4px',
      }}
    />
  </Box>

  <Button
    variant="contained"
    component={Link}
    to="/recettes/create"
    sx={{ fontWeight: 600, height: 'fit-content' }}
  >
    + Créer une recette
  </Button>
</Box>

    

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
