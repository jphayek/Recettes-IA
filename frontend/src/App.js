import React, { useEffect, useState } from 'react';
import LandingPage from './LandingPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
  Button,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function RecetteList() {
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
        sx={{ fontWeight: 700, color: '#1976d2' /* bleu MUI */ }}
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
          {recettes.map((r) => (
            <Card
              key={r.id}
              component={Link}
              to={`/recettes/${r.id}`}
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
                  {r.nom}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {r.description || 'Pas de description disponible.'}
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
                  {r.calories} kcal
                </Typography>
                <Button size="small" variant="contained" color="primary">
                  Voir
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

function RecetteDetail() {
  const { id } = useParams();
  const [recette, setRecette] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement de la recette
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
          ingredientsIds: data['Ingrédients'] || [],
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

  // Chargement des détails des ingrédients à partir de leurs IDs
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
              Aucun ingrédient listé.
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Étapes</Typography>
          {recette.etapes.length > 0 ? (
            <ol>
              {recette.etapes.map((etape, idx) => (
                <li key={idx}>
                  <Typography variant="body1" paragraph>{etape}</Typography>
                </li>
              ))}
            </ol>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Aucune étape renseignée.
            </Typography>
          )}
        </Box>
      </Card>
    </Container>
  );
}


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/recettes" element={<RecetteList />} />
        <Route path="/recettes/:id" element={<RecetteDetail />} />
      </Routes>
    </Router>
  );
}
