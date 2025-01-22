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

// Configurare multer
const uploadPath = path.join(__dirname, "../uploads");
fs.ensureDirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Păstrează numele original al fișierului
  },
});

const upload = multer({ storage });

// Rutele pentru produse
router.get("/products", getProducts);
router.post("/products", upload.single("image"), addProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
