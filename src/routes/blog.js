const express = require('express');
const router = express.Router();
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controller/blog');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateBlog } = require('../middleware/validation');
const { uploadSingle } = require('../../multer');

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', uploadSingle.single('image'), createBlog);
router.put('/:id', uploadSingle.single('image'), updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
