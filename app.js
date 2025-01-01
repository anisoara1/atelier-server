const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const productRoutes = require("./routes/index"); // Rutele definite mai sus

dotenv.config();

const app = express();

// Configurare middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Configurare multer pentru a stoca fișierele încărcate
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Ruta pentru încărcarea imaginilor
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
  console.log("Upload route accessed");
  console.log("File details:", req.file);
});

// Servirea fișierelor statice din directorul "uploads"
app.use("/uploads", express.static("uploads"));

// Utilizare rute
app.use("/products", productRoutes);

// Error handling pentru 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
