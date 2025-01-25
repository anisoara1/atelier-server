const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("./controllers/productController"); // Controller functions
const multer = require("multer");
const fs = require("fs-extra");

// Load environment variables
dotenv.config();

const app = express();

// Middleware for parsing JSON
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Configure Multer for file uploads
const uploadPath = path.join(__dirname, "uploads"); // Ensure path is relative to the current directory
fs.ensureDirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Preserve original filename
  },
});

const upload = multer({ storage });

// Serve uploaded files
app.use(
  "/uploads",
  (req, res, next) => {
    console.log(`File request: ${req.path}`);
    next();
  },
  express.static(uploadPath)
);

// Main route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the server!");
});

// Product routes
const router = express.Router();

router.get("/products", getProducts);
router.post(
  "/products",
  upload.single("image"),
  (req, res, next) => {
    console.log("Uploaded file:", req.file);
    next();
  },
  addProduct
);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

app.use("/", router);

// Handle 404 errors
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;
const serverUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;

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
      console.log(Server running at http://localhost:${PORT});
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });   



// Log the current environment
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
