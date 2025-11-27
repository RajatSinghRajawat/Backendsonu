const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedbacks, getFeedbackById, updateFeedback, deleteFeedback } = require('../controller/feedbacks');

router.get('/', getAllFeedbacks);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;

