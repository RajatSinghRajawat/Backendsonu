const express = require('express');
const router = express.Router();
const { createGallery, getAllGalleries, getGalleryById, updateGallery, deleteGallery } = require('../controller/gallery');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateGallery } = require('../middleware/validation');
const { uploadMultiple } = require('../../multer');

router.get('/', getAllGalleries);
router.get('/:id', getGalleryById);
router.post('/', uploadMultiple.array('images', 10), createGallery);
router.put('/:id', uploadMultiple.array('images', 10), updateGallery);
router.delete('/:id', deleteGallery);

module.exports = router;
