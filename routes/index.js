const express = require("express");

const { addProduct } = require("../controllers/productController");
const router = express.Router();

// Ruta pentru adăugarea unui produs
router.post("/", addProduct);

// Exportează router-ul pentru a-l folosi în app.js
module.exports = router;
