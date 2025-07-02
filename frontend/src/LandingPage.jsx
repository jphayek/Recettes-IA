import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <Box
      sx={{
        height: '100vh',
        position: 'relative',
        bgcolor: 'primary.dark',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Image floutée en arrière-plan */}
      <Box
        component="img"
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80"
        alt="background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(6px)',
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
          Bienvenue dans RecetteIA
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
          Découvrez des recettes personnalisées grâce à l’intelligence artificielle
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/recettes"
          sx={{
            bgcolor: 'secondary.main',
            px: 5,
            py: 1.5,
            fontWeight: 700,
            boxShadow: '0 6px 20px rgba(255,105,0,0.7)',
            '&:hover': {
              bgcolor: 'secondary.dark',
              boxShadow: '0 10px 30px rgba(255,69,0,0.9)',
              transform: 'translateY(-3px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Voir les recettes
        </Button>
      </Container>
    </Box>
  );
}
