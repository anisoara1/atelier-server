const Product = require("../models/productModel"); // Importă modelul pentru produs

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

    res.status(201).json(savedProduct); // Trimite produsul salvat ca răspuns
  } catch (error) {
    // Log eroare în cazul unei probleme la salvare
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Eroare la crearea produsului" });
  }
};

module.exports = { addProduct };
