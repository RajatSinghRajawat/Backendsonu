const express = require('express');
const router = express.Router();
const { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty } = require('../controller/properties');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateProperty } = require('../middleware/validation');
const { uploadMultiple } = require('../../multer');

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/createProperty', uploadMultiple.array('images', 10), createProperty);
router.put('/:id', uploadMultiple.array('images', 10), updateProperty);
router.delete('/:id',deleteProperty);

module.exports = router;
