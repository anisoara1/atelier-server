const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { addProduct } = require("../controllers/productController");

// Configurare `multer`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    console.log("Destination for upload:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log("File name before saving:", file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1048576 }, // 1MB
});

// Ruta pentru crearea unui produs
router.post("/", upload.single("image"), (req, res) => {
  console.log("Request body:", req.body); // Log parametrii din body
  console.log("File info:", req.file); // Log fișierul încărcat

  if (!req.file) {
    console.log("No image file uploaded");
    return res.status(400).json({ error: "No image file uploaded" });
  }

  addProduct(req, res); // Apel la controller
});

module.exports = router;
