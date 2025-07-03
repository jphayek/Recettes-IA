import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RecetteList from './components/RecetteList';
import RecetteDetail from './components/RecetteDetail';
import RecetteCreate from './components/RecetteCreate';
import LandingPage from './components/LandingPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/recettes" element={<RecetteList />} />
        <Route path="/recettes/create" element={<RecetteCreate />} />
        <Route path="/recettes/:id" element={<RecetteDetail />} />
      </Routes>
    </Router>
  );
}
