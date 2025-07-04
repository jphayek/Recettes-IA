const express = require("express");
const cors = require("cors");
const { recettesTable, ingredientsTable, intolerancesTable } = require("./airtable");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET /recettes — liste des recettes
 */
app.get("/recettes", async (req, res) => {
  try {
     const records = await recettesTable.select({}).all();

    const recettes = records.map(record => ({
      id: record.id,
      nom: record.get("Nom") || "",
      description: record.get("Description") || "",
      calories: record.get("Calories") || 0,
    }));

    res.json(recettes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des recettes." });
  }
});

/**
 * POST /recettes — ajouter une recette
 */
app.post("/recettes", async (req, res) => {
  const {
    nom,
    description,
    calories,
    nbPersonnes,
    proteines,
    lipides,
    glucides,
    typeDePlat,
    ingredients,
    intolerances,
    etapes,
    vitamines,
    mineraux,
  } = req.body;

  if (!nom || !calories) {
    return res.status(400).json({ error: "Nom et calories requis" });
  }

  try {
    // Si ingredients est un tableau de noms, convertis en IDs
    let ingredientIds = [];
    if (Array.isArray(ingredients) && ingredients.length > 0 && typeof ingredients[0] === "string") {
      const ingredientRecords = await ingredientsTable.select({
        filterByFormula: `OR(${ingredients.map(name => `FIND("${name}", {Nom})`).join(",")})`
      }).all();
      ingredientIds = ingredientRecords.map(r => r.id);
    }

    // Même pour intolérances
    let intoleranceIds = [];
    if (Array.isArray(intolerances) && intolerances.length > 0 && typeof intolerances[0] === "string") {
      const intoleranceRecords = await intolerancesTable.select({
        filterByFormula: `OR(${intolerances.map(name => `FIND("${name}", {Nom})`).join(",")})`
      }).all();
      intoleranceIds = intoleranceRecords.map(r => r.id);
    }

    const created = await recettesTable.create({
      "Nom": nom,
      "Description": description || "",
      "Calories": parseInt(calories),
      ...(typeDePlat ? { "Type de plat": typeDePlat } : {}),
      "Nb de personnes": parseInt(nbPersonnes) || null,
      "Protéines": proteines || null,
      "Lipides": lipides || null,
      "Glucides": glucides || null,
      "Ingrédients": ingredientIds,
      "Intolérances": intoleranceIds,
      "Étapes": Array.isArray(etapes) ? etapes.join('\n') : etapes || "",
      "Vitamines": vitamines || "",
      "Minéraux": mineraux || "",
    });

    res.status(201).json({
      id: created.id,
      ...created.fields,
    });
  } catch (err) {
    console.error("Erreur Airtable création recette :", err);
    res.status(500).json({ error: "Erreur lors de la création de la recette." });
  }
});





app.get('/recettes/:id', async (req, res) => {
  try {
    const record = await recettesTable.find(req.params.id);
    console.log(record.fields);
    console.log("Ingrédients du record :", record.fields['Ingrédients']);
    res.json({
      id: record.id,
      ...record.fields
    });
  } catch (err) {
    res.status(404).json({ error: 'Recette non trouvée' });
  }
});

/**
 * GET /ingredients/:id — récupérer un ingrédient par son ID
 */
app.get('/ingredients/:id', async (req, res) => {
  try {
     const record = await ingredientsTable.find(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Ingrédient non trouvé' });
    }
    res.json({
      id: record.id,
      ...record.fields
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Ingrédient non trouvé' });
  }
});


app.get("/ingredients", async (req, res) => {
  try {
     const records = await ingredientsTable.select({}).all();

    const ingredients = records.map(record => ({
      id: record.id,
      nom: (record.get("Nom") || "").trim(),
    }));

    res.json(ingredients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des ingrédients." });
  }
});

app.post('/ingredients/search', async (req, res) => {
  const { names } = req.body;
  if (!Array.isArray(names)) {
    return res.status(400).json({ error: 'Names must be an array' });
  }

  try {
    const records = await ingredientsTable.select({
      filterByFormula: `OR(${names.map(name => `FIND("${name}", {Nom})`).join(',')})`
    }).all();

    const matched = records.filter(r => names.includes(r.get('Nom')));

    res.json(matched.map(r => ({ id: r.id, nom: r.get('Nom') })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la recherche des ingrédients' });
  }
});


app.post('/intolerances/search', async (req, res) => {
  const { names } = req.body;
  if (!Array.isArray(names)) {
    return res.status(400).json({ error: 'Names must be an array' });
  }

  try {
    const records = await intolerancesTable.select({
      filterByFormula: `OR(${names.map(name => `FIND("${name}", {Nom})`).join(',')})`
    }).all();

    const matched = records.filter(r => names.includes(r.get('Nom')));

    res.json(matched.map(r => ({ id: r.id, nom: r.get('Nom') })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la recherche des intolérances' });
  }
});


app.listen(3000, () => {
  console.log("✅ Serveur backend lancé sur http://localhost:3000");
});
