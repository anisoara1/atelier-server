const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoutes = require("./routes/index"); // Correct import path

dotenv.config();

const app = express();

// Global middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Serve uploaded files
app.use(
  "/uploads",
  (req, res, next) => {
    console.log(`File request: ${req.path}`);
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Main routes
app.use("/", (req, res) => {
  res.status(200).send("Welcome to the server!");
});
app.use("/products", productRoutes); // Prefix product routes with '/products'

// Handle 404 errors
app.use((req, res, next) => {
  next(createError(404));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// Connect to MongoDB and start the server
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
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
