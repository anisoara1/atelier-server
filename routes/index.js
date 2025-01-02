const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { addProduct } = require("../controllers/productController"); // Asigură-te că această importare e corectă

// Configurare multer pentru a stoca fișierele încărcate
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination for upload:", "uploads/"); // Log destinația fișierului
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log("File name before saving:", file.originalname); // Log numele fișierului
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576, // Limita de dimensiune a fișierului
  },
});

const upload = multer({ storage: storage });

// Ruta pentru a crea un produs nou
router.post("/", upload.single("image"), (req, res, next) => {
  // Loguri pentru a verifica datele trimise
  console.log("Request body:", req.body); // Log parametrii trimisi prin body (name, price, description, category)
  console.log("File info:", req.file); // Log fișierul trimis

  // Verificăm dacă există un fișier încărcat
  if (!req.file) {
    console.log("No image file uploaded"); // Log dacă nu există fișier
    return res.status(400).json({ error: "No image file uploaded" });
  }

  // Verificăm dimensiunea fișierului
  if (req.file.size > 1048576) {
    console.log("File is too large:", req.file.size); // Log dimensiune fișier
    return res.status(400).json({ error: "File size exceeds limit" });
  }

  // Continuăm cu procesul de creare a produsului
  addProduct(req, res);
});

module.exports = router;
