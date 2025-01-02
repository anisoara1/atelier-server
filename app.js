const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoutes = require("./routes/index"); // Importă ruta pentru produse

dotenv.config(); // Încarcă variabilele din fișierul .env

const app = express();

// Middleware global
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Servește fișierele încărcate
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rute
app.use("/products", productRoutes);

// Gestionare 404
app.use((req, res, next) => {
  next(createError(404));
});

// Gestionare erori globale
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// Conexiune la MongoDB și pornirea serverului
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
