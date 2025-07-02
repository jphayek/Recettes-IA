import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function RecetteCard({ recette }) {
  return (
    <Card
      component={Link}
      to={`/recettes/${recette.id}`}
      variant="outlined"
      sx={{
        textDecoration: 'none',
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: 2,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-6px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1.5 }}>
          {recette.nom}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ minHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {recette.description || 'Pas de description disponible.'}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'space-between',
          px: 2,
          pb: 2,
          pt: 0,
        }}
      >
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
          {recette.calories} kcal
        </Typography>
        <Button size="small" variant="contained" color="primary">
          Voir
        </Button>
      </CardActions>
    </Card>
  );
}
