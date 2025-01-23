const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

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

module.exports = upload;
