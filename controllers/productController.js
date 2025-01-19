const Product = require("../models/productModel"); // Importă modelul pentru produs

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Eroare la obținerea produselor" });
  }
};

const addProduct = async (req, res) => {
  console.log("addProduct route accessed");

  // Loguri pentru a verifica datele trimise în body și fișierul
  console.log("Request body:", req.body); // Log datele trimise
  console.log("Uploaded file:", req.file); // Log fișierul încărcat

  // Verificăm dacă toate câmpurile necesare sunt prezentate
  const { name, price, description, category } = req.body;
  if (!name || !price || !description || !category) {
    console.log("Error: Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Verificăm dacă prețul este valid (un număr)
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    console.log("Error: Invalid price value");
    return res.status(400).json({ error: "Invalid price value" });
  }

  // Logăm informațiile despre fișier, dacă există
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  console.log("Image path after processing:", image);

  try {
    // Creează un obiect produs
    const newProduct = new Product({
      name,
      price: parsedPrice, // Asigurăm că prețul este un număr
      description,
      category,
      image, // Salvează calea fișierului încărcat, dacă există
    });

    console.log("Saving product to database:", newProduct);

    // Salvează produsul în baza de date
    const savedProduct = await newProduct.save();
    console.log("Product saved:", savedProduct); // Log după ce produsul este salvat cu succes

    res.status(201).json(savedProduct);
  } catch (error) {
    // Log eroare în cazul unei probleme la salvare
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Eroare la crearea produsului" });
  }
};

const updateProduct = async (req, res) => {
  console.log("updateProduct route accessed");

  const { id } = req.params; // Obținem ID-ul produsului din parametrii URL-ului
  const { name, price, description, category } = req.body;

  if (!id) {
    console.log("Error: Missing product ID");
    return res.status(400).json({ error: "Missing product ID" });
  }

  // Preluăm informațiile actualizate despre imagine, dacă există
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updateData = {
    ...(name && { name }),
    ...(price && { price: parseFloat(price) }),
    ...(description && { description }),
    ...(category && { category }),
    ...(image && { image }),
  };

  console.log("Data for update:", updateData);

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Returnează produsul actualizat
      runValidators: true, // Rulează validările definite în model
    });

    if (!updatedProduct) {
      console.log("Error: Product not found");
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Product updated:", updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Eroare la actualizarea produsului" });
  }
};

const deleteProduct = async (req, res) => {
  console.log("deleteProduct route accessed");

  const { id } = req.params; // Obținem ID-ul produsului din parametrii URL-ului

  if (!id) {
    console.log("Error: Missing product ID");
    return res.status(400).json({ error: "Missing product ID" });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      console.log("Error: Product not found");
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Product deleted:", deletedProduct);
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Eroare la ștergerea produsului" });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
