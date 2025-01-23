const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Configure multer
const uploadPath = path.join(__dirname, "../uploads");
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

// Product routes
router.get("/", getProducts); // GET /products
router.post("/", upload.single("image"), addProduct); // POST /products
router.put("/:id", upload.single("image"), updateProduct); // PUT /products/:id
router.delete("/:id", deleteProduct); // DELETE /products/:id

module.exports = router;
