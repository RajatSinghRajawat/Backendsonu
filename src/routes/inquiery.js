const express = require('express');
const router = express.Router();
const { createInquiry, getAllInquiries, getInquiryById, updateInquiry, deleteInquiry } = require('../controller/inquiery');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateInquiry } = require('../middleware/validation');

router.post('/createInquiry',  createInquiry);
router.get('/', getAllInquiries);
router.get('/getInquiryById/:id', getInquiryById);
router.put('/updateInquiry/:id',  updateInquiry);
router.delete('/deleteInquiry/:id',  deleteInquiry);

module.exports = router;
