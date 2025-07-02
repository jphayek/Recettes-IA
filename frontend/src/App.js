import React, { useEffect, useState } from 'react';

function App() {
  const [recettes, setRecettes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/recettes')
      .then(res => res.json())
      .then(data => setRecettes(data))
      .catch(err => console.error('Erreur:', err));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Liste des recettes</h1>
      {recettes.length === 0 && <p>Aucune recette trouvée.</p>}
      <ul>
        {recettes.map(r => (
          <li key={r.id}>
            <strong>{r.nom}</strong> — {r.calories} kcal
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
