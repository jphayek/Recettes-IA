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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Box,
  Button
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
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Liste des recettes
      </Typography>
      {recettes.length === 0 ? (
        <Typography>Aucune recette trouvée.</Typography>
      ) : (
        <List>
          {recettes.map((r) => (
            <ListItem key={r.id} disablePadding>
              <ListItemButton component={Link} to={`/recettes/${r.id}`}>
                <ListItemText
                  primary={r.nom}
                  secondary={`${r.calories} kcal`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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
