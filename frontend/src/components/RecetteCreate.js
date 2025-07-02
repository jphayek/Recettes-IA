import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function RecetteCreate() {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [etapes, setEtapes] = useState('');
  const [nbPersonnes, setNbPersonnes] = useState('');
  const [calories, setCalories] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nom.trim() || !description.trim()) {
      setError('Le nom et la description sont obligatoires.');
      return;
    }

    if (!calories || Number(calories) <= 0) {
      setError('Les calories doivent être un nombre supérieur à 0.');
      return;
    }

    const recette = {
      nom: nom.trim(),
      description: description.trim(),
      etapes: etapes.split('\n').map(e => e.trim()).filter(e => e !== ''),
      nbPersonnes: Number(nbPersonnes) || 1,
      calories: Number(calories),
    };

    fetch('http://localhost:3000/recettes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recette),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erreur API : ${res.status} ${errorText}`);
        }
        return res.json();
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setError(err.message);
      });
  };



  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
        Créer une nouvelle recette
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nom de la recette"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Étapes (une par ligne)"
          multiline
          rows={4}
          value={etapes}
          onChange={(e) => setEtapes(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Nombre de personnes"
          type="number"
          value={nbPersonnes}
          onChange={(e) => setNbPersonnes(e.target.value)}
          margin="normal"
          inputProps={{ min: 1 }}
        />
        <TextField
          fullWidth
          label="Calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          margin="normal"
          inputProps={{ min: 0 }}
        />

        <Button type="submit" variant="contained" sx={{ mt: 3 }}>
          Créer
        </Button>
      </Box>
    </Container>
  );
}
