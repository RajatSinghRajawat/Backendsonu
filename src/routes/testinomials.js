const express = require('express');
const router = express.Router();
const { createTestimonial, getAllTestimonials, getTestimonialById, updateTestimonial, deleteTestimonial } = require('../controller/testinomials');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateTestimonial } = require('../middleware/validation');
const { uploadSingle } = require('../../multer');

router.get('/', getAllTestimonials);
router.get('/:id', getTestimonialById);
router.post('/', uploadSingle.single('image'), validateTestimonial, createTestimonial);
router.put('/:id', uploadSingle.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;
