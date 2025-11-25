const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers, updateProfile, deleteUser } = require('../controller/auth');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/users', authenticate, isAdmin, getAllUsers);
router.delete('/users/:id', authenticate, isAdmin, deleteUser);

module.exports = router;
