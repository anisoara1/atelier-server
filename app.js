const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const productRoutes = require("./routes/index"); // Importă ruta pentru produse
const uploadDir = path.join(process.cwd(), "uploads"); // Directorul pentru fișierele încărcate
const storeImage = path.join(process.cwd(), "images"); // Directorul pentru a stoca imaginile finale
dotenv.config(); // Încarcă variabilele din fișierul .env

const app = express();

// Configurare middleware
app.use(express.json()); // Permite să parsezi JSON în requesturi
app.use(cors()); // Permite cereri CORS
app.use(morgan("tiny")); // Loguri pentru requesturi

// Configurare multer pentru a stoca fișierele încărcate
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination folder:", uploadDir); // Log pentru a verifica directorul de destinație
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("Uploaded file:", file.originalname); // Log pentru fișierul încărcat
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576, // Limita fișierului la 1MB
  },
});

const upload = multer({
  storage: storage,
});

// Ruta pentru încărcarea fișierelor
app.post("/upload", upload.single("picture"), async (req, res, next) => {
  const { description } = req.body;
  const { path: temporaryName, originalname } = req.file;
  const fileName = path.join(storeImage, originalname);

  console.log("Temporary file path:", temporaryName); // Log pentru a verifica că fișierul este încărcat corect
  console.log(req.body); // Celelalte câmpuri (name, price, etc.)
  console.log(req.file);
  try {
    // Mută fișierul din locația temporară în locația permanentă
    await fs.rename(temporaryName, fileName);
  } catch (err) {
    // Dacă există o eroare, șterge fișierul temporar și trimite eroarea
    await fs.unlink(temporaryName);
    return next(err);
  }

  // Trimite răspunsul de succes
  res.json({
    description,
    message: "Fișierul a fost încărcat cu succes",
    status: 200,
  });
});

// Configurare rute pentru produse
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/products", productRoutes); // Rutele pentru gestionarea produselor

// Gestionare 404 (rute inexistente)
app.use((req, res, next) => {
  next(createError(404));
});

// Gestionare erori globale
app.use((err, req, res, next) => {
  console.error(err); // Log eroare
  res.status(err.status || 500);
  return thunkAPI.rejectWithValue(
    err.response?.data?.message || "Eroare la procesarea cererii"
  );
});

// Verifică dacă un folder este accesibil
const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

// Crează folderul dacă nu există
const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    console.log(`Creating folder: ${folder}`); // Log pentru a confirma crearea folderului
    await fs.mkdir(folder);
  } else {
    console.log(`Folder already exists: ${folder}`); // Log dacă folderul există deja
  }
};

// Pornirea serverului și conexiunea la MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB"); // Log pentru a confirma conexiunea
    createFolderIsNotExist(uploadDir); // Crează folderul pentru fișierele încărcate
    createFolderIsNotExist(storeImage); // Crează folderul pentru imagini
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`); // Log pentru a confirma că serverul rulează
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err); // Log dacă conexiunea la MongoDB nu reușește
  });
