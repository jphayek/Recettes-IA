import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Card, Divider, Box, CircularProgress } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

export default function RecetteDetail() {
  const { id } = useParams();
  const [recette, setRecette] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/recettes/${id}`)
      .then(res => res.json())
      .then(data => {
        const recetteFormatee = {
          nom: data.Nom?.trim() || '',
          description: data.Description || '',
          etapes: data['Étapes'] ? data['Étapes'].split('\n').map(e => e.trim()) : [],
          nbPersonnes: data['Nb de personnes'] || 0,
          calories: data.Calories || 0,
          proteines: data['Protéines'] || 0,
          lipides: data.Lipides || 0,
          glucides: data.Glucides || 0,
          ingredientsIds: data['Ingredients'] || [],
          vitamines: data.Vitamines || '',
          mineraux: data['Minéraux'] || '',
        };
        setRecette(recetteFormatee);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!recette?.ingredientsIds?.length) {
      setIngredients([]);
      return;
    }
    Promise.all(
      recette.ingredientsIds.map(ingId =>
        fetch(`http://localhost:3000/ingredients/${ingId}`)
          .then(res => res.json())
          .catch(() => null)
      )
    ).then(results => {
      setIngredients(results.filter(Boolean));
    });
  }, [recette?.ingredientsIds]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!recette) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Recette non trouvée.
        </Typography>
        <Button component={Link} to="/" sx={{ mt: 2 }}>
          Retour à l'accueil
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Button component={Link} to="/" variant="outlined" sx={{ mb: 3 }}>
        ← Retour à la liste
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 3, p: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          {recette.nom}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          {recette.description || 'Aucune description disponible.'}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Calories</Typography>
          <Typography variant="body1" color="primary" sx={{ fontWeight: 600 }}>
            {recette.calories} kcal
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Ingrédients</Typography>
          {ingredients.length > 0 ? (
            <ul>
              {ingredients.map((ing, idx) => (
                <li key={idx}>
                  <Typography variant="body1">{ing.Nom || ing.nom || 'Ingrédient inconnu'}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Aucun ingrédient trouvé.
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Étapes</Typography>
          {recette.etapes.length > 0 ? (
            <ol>
              {recette.etapes.map((etape, idx) => (
                <li key={idx}>
                  <Typography variant="body1">{etape}</Typography>
                </li>
              ))}
            </ol>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Aucune étape disponible.
            </Typography>
          )}
        </Box>
      </Card>
    </Container>
  );
}
