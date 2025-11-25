const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, getContactById, updateContact, deleteContact } = require('../controller/contact');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

router.post('/', validateContact, createContact);
router.get('/',  getAllContacts);
router.get('/:id', getContactById);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
