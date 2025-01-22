const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoutes = require("./routes/index");

dotenv.config();

const app = express();

// Middleware global
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Servește fișierele încărcate
app.use(
  "/uploads",
  (req, res, next) => {
    console.log(`Request for file: ${req.path}`);
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Rute principale
app.use("/", productRoutes);

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

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Serverul rulează pe http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
