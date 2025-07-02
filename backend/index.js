const express = require("express");
const cors = require("cors");
const { table } = require("./airtable");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET /recettes — liste des recettes
 */
app.get("/recettes", async (req, res) => {
  try {
    const records = await table.select({}).all();

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
  const { nom, description, calories } = req.body;

  if (!nom || !calories) {
    return res.status(400).json({ error: "Nom et calories requis" });
  }

  try {
    const created = await table.create({
      "Nom": nom,
      "Description": description || "",
      "Calories": parseInt(calories),
    });

    res.status(201).json({
      id: created.id,
      nom: created.get("Nom"),
      description: created.get("Description"),
      calories: created.get("Calories"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la création de la recette." });
  }
});

app.listen(3000, () => {
  console.log("✅ Serveur backend lancé sur http://localhost:3000");
});
