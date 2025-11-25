const express = require('express');
const router = express.Router();
const { adminRegister, adminLogin, getAdminProfile, updateAdminProfile, changeAdminPassword } = require('../controller/admin');
const { authenticateAdmin } = require('../middleware/auth');
const { validateRegister } = require('../middleware/validation');
const { uploadSingle } = require('../../multer');

// Admin Register (public route)
router.post('/register', adminRegister);

// Admin Login (public route)
router.post('/login', adminLogin);

// Admin Profile Routes (protected)
router.get('/profile', authenticateAdmin, getAdminProfile);
router.put('/profile', authenticateAdmin, uploadSingle.single('profilePicture'), updateAdminProfile);
router.put('/change-password', authenticateAdmin, changeAdminPassword);

module.exports = router;

