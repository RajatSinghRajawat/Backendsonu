const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "public/Uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Remove spaces and special characters from filename
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  },
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif|avif/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const error = new Error("Invalid file type. Only images (jpeg, jpg, png, webp, gif, avif) are allowed.");
    error.status = 400;
    return cb(error, false);
  }
};

// File filter for images and videos
const mediaFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif|avif|mp4|mov|avi/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const error = new Error("Invalid file type. Only images and videos are allowed.");
    error.status = 400;
    return cb(error, false);
  }
};

// Single image upload
const uploadSingle = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Multiple images upload
const uploadMultiple = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10, // Max 10 files
  },
});

// Media upload (images and videos)
const uploadMedia = multer({
  storage: storage,
  fileFilter: mediaFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
});

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadMedia,
};