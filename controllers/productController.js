const sharp = require("sharp");
const path = require("path");
const fs = require("fs-extra");
const Product = require("../models/productModel");

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
  try {
    console.log("Request body received:", req.body);
    console.log("Uploaded file details:", req.file);

    const { name, price, description, category, image } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let imagePath;

    // Check if a file was uploaded
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      console.log("File uploaded successfully:", imagePath);

      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      const tempPath = path.join(
        __dirname,
        "../uploads",
        `temp_${req.file.filename}`
      );

      // Resize the image and save it temporarily
      await sharp(filePath).resize(800, 600).toFile(tempPath);

      // Replace the original file with the resized file
      await fs.rename(tempPath, filePath);

      console.log("File resized and overwritten:", filePath);
    } else if (image) {
      const existingImagePath = path.join(
        __dirname,
        "../uploads",
        path.basename(image)
      );
      console.log("Checking existence of image at path:", existingImagePath);

      if (await fs.stat(existingImagePath)) {
        imagePath = `/uploads/${path.basename(image)}`;
        console.log("Using existing file:", imagePath);
      } else {
        console.log(
          "Specified image does not exist in uploads directory:",
          existingImagePath
        );
        return res
          .status(400)
          .json({ error: "Specified image does not exist" });
      }
    } else {
      console.log("Error: No image uploaded or specified.");
      return res.status(400).json({ error: "No image uploaded or specified" });
    }

    // Create the product and save it to the database
    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      category,
      image: imagePath,
    });

    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error.message);
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
    // Găsim produsul înainte de a-l șterge, pentru a obține detaliile imaginii
    const productToDelete = await Product.findById(id);

    if (!productToDelete) {
      console.log("Error: Product not found");
      return res.status(404).json({ error: "Product not found" });
    }

    const imagePath = productToDelete.image;
    console.log("imagePath:", imagePath);

    // Ștergem produsul din baza de date
    const deletedProduct = await Product.findByIdAndDelete(id);

    console.log("Product deleted:", deletedProduct);

    // Verificăm dacă imaginea este utilizată de alte produse
    const isImageUsedElsewhere = await Product.exists({ image: imagePath });
    console.log("Image used:", isImageUsedElsewhere);
    if (!isImageUsedElsewhere && imagePath) {
      // Convertim calea relativă într-o cale absolută
      const absoluteImagePath = path.join(__dirname, "../", imagePath);

      // Ștergem imaginea de pe disc
      fs.unlink(absoluteImagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image deleted successfully:", absoluteImagePath);
        }
      });
    } else {
      console.log(
        "Image is still used by other products or no image associated."
      );
    }

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
