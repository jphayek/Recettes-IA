import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

async function getIngredientIdsByName(names) {
  if (!names || names.length === 0) return [];
  const response = await fetch('http://localhost:3000/ingredients/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ names }),
  });
  const data = await response.json();
  return data.map(i => i.id);
}

async function getIntoleranceIdsByName(names) {
  if (!names || names.length === 0) return [];
  const response = await fetch('http://localhost:3000/intolerances/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ names }),
  });
  const data = await response.json();
  return data.map(i => i.id);
}

export default function RecetteCreate() {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [etapes, setEtapes] = useState('');
  const [nbPersonnes, setNbPersonnes] = useState('');
  const [calories, setCalories] = useState('');
  const [error, setError] = useState('');
  const [proteines, setProteines] = useState('');
  const [lipides, setLipides] = useState('');
  const [glucides, setGlucides] = useState('');
  const [ingredients, setIngredients] = useState('');  
  //const [intolerances, setIntolerances] = useState('');
  const [vitamines, setVitamines] = useState('');
  const [mineraux, setMineraux] = useState('');
  const [intolerances, setIntolerances] = useState([]);
  const [typeDePlat, setTypeDePlat] = useState('');

  const intolerancesOptions = [
    "Gluten",
    "Lactose",
    "Fruits à coque",
    "Œufs",
    "Soja",
    "Poissons",
  ];

  const typeDePlatOptions = [
    "Entrée",
    "Plat principal",
    "Dessert",
    "Apéritif",
    "Accompagnement",
  ];

  const handleIntolerancesChange = (event) => {
    setIntolerances(event.target.value);
  };
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  // On récupère la liste d’ingrédients en tableau
  const ingredientNames = ingredients
    .split('\n')
    .map(i => i.trim())
    .filter(i => i !== '');

  
  const intoleranceNames = intolerances;

  try {
    const ingredientIds = await getIngredientIdsByName(ingredientNames);
    const intoleranceIds = await getIntoleranceIdsByName(intoleranceNames);

    const recette = {
      nom,
      description,
      etapes: etapes.split('\n').map(e => e.trim()).filter(e => e !== ''),
      nbPersonnes: Number(nbPersonnes),
      calories: Number(calories),
      proteines: Number(proteines),
      lipides: Number(lipides),
      glucides: Number(glucides),
      ingredients: ingredientIds,   
      intolerances: intoleranceIds,
      vitamines,
      mineraux,
    };

    // POST vers Airtable (ou ton backend)
    await fetch('http://localhost:3000/recettes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recette),
    });

    navigate('/');
  } catch (err) {
    setError(err.message);
  }
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
        <FormControl fullWidth margin="normal">
          <InputLabel id="type-plat-label">Type de plat</InputLabel>
          <Select
            labelId="type-plat-label"
            value={typeDePlat}
            onChange={(e) => setTypeDePlat(e.target.value)}
            label="Type de plat"
          >
            {typeDePlatOptions.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

        <TextField
          fullWidth
          label="Protéines (g)"
          type="number"
          value={proteines}
          onChange={e => setProteines(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Lipides (g)"
          type="number"
          value={lipides}
          onChange={e => setLipides(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Glucides (g)"
          type="number"
          value={glucides}
          onChange={e => setGlucides(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Ingrédients (une par ligne)"
          multiline
          rows={4}
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          margin="normal"
        />


     <FormControl fullWidth margin="normal">
      <InputLabel id="intolerances-label">Intolérances</InputLabel>
      <Select
        labelId="intolerances-label"
        multiple
        value={intolerances}
        onChange={handleIntolerancesChange}
        renderValue={(selected) => selected.join(', ')}
      >
        {intolerancesOptions.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={intolerances.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>

        <TextField
          fullWidth
          label="Vitamines"
          value={vitamines}
          onChange={e => setVitamines(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Minéraux"
          value={mineraux}
          onChange={e => setMineraux(e.target.value)}
          margin="normal"
        />


        <Button type="submit" variant="contained" sx={{ mt: 3 }}>
          Créer
        </Button>
      </Box>
    </Container>
  );
}
