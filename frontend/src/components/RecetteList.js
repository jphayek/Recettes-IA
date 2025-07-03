import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Divider,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RecetteCard from './RecetteCard';
import { Link } from 'react-router-dom';

export default function RecetteList() {
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/recettes')
      .then(res => res.json())
      .then(data => {
        console.log("Données reçues :", data);
        setRecettes(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filteredRecettes = recettes.filter((r) => {
    const query = searchQuery.toLowerCase();
  return (
    (r.nom && r.nom.toLowerCase().includes(query)) ||
    (r.description && r.description.toLowerCase().includes(query))
    || (r.ingredients && r.ingredients.some(ing => ing.nom.toLowerCase().includes(query)))
    || (r.etapes && r.etapes.some(etape => etape.toLowerCase().includes(query)))
    || (r.intolerances && r.intolerances.some(intol => intol.nom.toLowerCase().includes(query)))
    || (r.vitamines && r.vitamines.toLowerCase().includes(query))
  );
  });

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
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 700, color: '#1976d2', borderBottom: '4px solid #1976d2', pb: 1 }}
        >
          Nos délicieuses recettes
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/recettes/create"
        >
          Créer une recette
        </Button>
      </Box>

      <TextField
        label="Rechercher une recette"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />

      {filteredRecettes.length === 0 ? (
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
          {filteredRecettes.map((r) => (
            <RecetteCard key={r.id} recette={r} />
          ))}
        </Box>
      )}
    </Container>
  );
}
