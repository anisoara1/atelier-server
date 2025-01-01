const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String },
  category: { type: String, required: true }, // Adaugă câmpul pentru categorie
});

module.exports = productSchema; // Exportă schema direct
