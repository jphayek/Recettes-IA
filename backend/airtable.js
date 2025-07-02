require("dotenv").config();
const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN })
  .base(process.env.AIRTABLE_BASE_ID);

const recettesTable = base(process.env.AIRTABLE_TABLE_RECETTES);
const ingredientsTable = base(process.env.AIRTABLE_TABLE_INGREDIENTS);
const intolerancesTable = base(process.env.AIRTABLE_TABLE_INTOLERANCES);

module.exports = { recettesTable, ingredientsTable, intolerancesTable };
