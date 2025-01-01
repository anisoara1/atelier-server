const mongoose = require("mongoose");
const Product = mongoose.model("Product", require("../models/productModel"));

const addProduct = async (req, res) => {
  console.log("Add product route accessed");
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  try {
    const { name, price, description, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image,
    });

    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Eroare la crearea produsului" });
  }
};

module.exports = { addProduct };
