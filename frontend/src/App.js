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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/recettes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Recette non trouvée');
        return res.json();
      })
      .then(data => {
        setRecette(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!recette) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6">Recette non trouvée.</Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} href="/">
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h3" gutterBottom>
        {recette.nom}
      </Typography>

      <Typography><strong>Calories :</strong> {recette.calories ?? 'N/A'} kcal</Typography>
      <Typography><strong>Protéines :</strong> {recette.proteines ?? 'N/A'} g</Typography>
      <Typography><strong>Glucides :</strong> {recette.glucides ?? 'N/A'} g</Typography>
      <Typography><strong>Lipides :</strong> {recette.lipides ?? 'N/A'} g</Typography>
      <Typography><strong>Vitamines :</strong> {recette.vitamines ?? 'N/A'}</Typography>
      <Typography><strong>Minéraux :</strong> {recette.mineraux ?? 'N/A'}</Typography>

      <Typography sx={{ mt: 3 }}><strong>Description :</strong> {recette.description ?? 'Pas de description'}</Typography>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" startIcon={<ArrowBackIcon />} component={Link} to="/">
          Retour à la liste
        </Button>
      </Box>
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
