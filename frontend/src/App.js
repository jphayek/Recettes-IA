import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';

function RecetteList() {
  const [recettes, setRecettes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/recettes')
      .then(res => res.json())
      .then(data => setRecettes(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Liste des recettes</h1>
      {recettes.length === 0 && <p>Aucune recette trouvée.</p>}
      <ul>
        {recettes.map(r => (
          <li key={r.id}>
            <Link to={`/recettes/${r.id}`}>
              <strong>{r.nom}</strong> — {r.calories} kcal
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecetteDetail() {
  const { id } = useParams();
  const [recette, setRecette] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/recettes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Recette non trouvée');
        return res.json();
      })
      .then(data => setRecette(data))
      .catch(console.error);
  }, [id]);

  if (!recette) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>{recette.nom}</h1>

      <p><strong>Calories :</strong> {recette["Calories"] ?? 'N/A'} kcal</p>
      <p><strong>Protéines :</strong> {recette["Protéines"] ?? 'N/A'} g</p>
      <p><strong>Glucides :</strong> {recette["Glucides"] ?? 'N/A'} g</p>
      <p><strong>Lipides :</strong> {recette["Lipides"] ?? 'N/A'} g</p>
      <p><strong>Vitamines :</strong> {recette["Vitamines"] ?? 'N/A'}</p>
      <p><strong>Minéraux :</strong> {recette["Minéraux"] ?? 'N/A'}</p>

      <p><strong>Description :</strong> {recette.description ?? 'Pas de description'}</p>

      <Link to="/">← Retour à la liste</Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecetteList />} />
        <Route path="/recettes/:id" element={<RecetteDetail />} />
      </Routes>
    </Router>
  );
}
