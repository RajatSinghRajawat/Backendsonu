const express = require('express');
const router = express.Router();
const { 
    createFeedback, 
    getAllFeedbacks, 
    getAllFeedbacksAdmin,
    getFeedbackById, 
    updateFeedback, 
    updateFeedbackStatus,
    deleteFeedback 
} = require('../controller/feedbacks');

// Public routes
router.get('/', getAllFeedbacks); // Only approved feedbacks
router.post('/', createFeedback); // Create new feedback

// Admin routes (should add authentication middleware later)
router.get('/admin/all', getAllFeedbacksAdmin); // Get all feedbacks
router.get('/:id', getFeedbackById); // Get single feedback
router.put('/:id/status', updateFeedbackStatus); // Update status only
router.put('/:id', updateFeedback); // Update full feedback
router.delete('/:id', deleteFeedback); // Delete feedback

module.exports = router;

