require('dotenv').config();
const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID);

base(process.env.AIRTABLE_TABLE_RECETTES).select({
    maxRecords: 5,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
        console.log(`🔸 ${record.get('Nom')} — ${record.get('Calories')} kcal`);
    });
    fetchNextPage();
}, function done(err) {
    if (err) { console.error(err); return; }
});
