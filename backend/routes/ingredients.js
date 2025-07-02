const express = require('express');
const router = express.Router();
const { ingredientsTable } = require('../airtable');

router.post('/search', async (req, res) => {
  const { names } = req.body; // ['Tomate', 'Oignon', ...]
  if (!names || names.length === 0) return res.json([]);

  try {
    const records = await ingredientsTable.select({
      filterByFormula: `OR(${names.map(n => `{Nom}="${n}"`).join(",")})`
    }).all();
    const result = records.map(r => ({ id: r.id, nom: r.get('Nom') }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
