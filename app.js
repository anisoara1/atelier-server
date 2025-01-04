const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { upload } = require("./routes/index");
const productRoutes = require("./routes/index"); // Importă ruta pentru produse
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("./controllers/productController");

dotenv.config(); // Încarcă variabilele din fișierul .env

const app = express();

// Middleware global
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Servește fișierele încărcate
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rute pentru produse
app.get("/products", getProducts);
app.post("/products", upload.single("image"), addProduct); // Creare produs
app.put("/products/:id", upload.single("image"), updateProduct); // Actualizare produs
app.delete("/products/:id", deleteProduct); // Ștergere produs

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
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error(
    "MONGO_URI is not defined. Check your environment variables."
  );
}

console.log("MONGO_URI:", mongoUri);

// Conectarea la MongoDB fără opțiuni depășite
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");

    // Pornirea serverului doar după ce conexiunea la MongoDB este reușită
    app.listen(PORT, () => {
      console.log(`Serverul rulează pe http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Închide aplicația dacă nu se poate conecta la MongoDB
  });
