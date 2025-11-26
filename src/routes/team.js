const express = require('express');
const router = express.Router();
const { 
    createTeamMember, 
    getAllTeamMembers, 
    getTeamMemberById, 
    updateTeamMember, 
    deleteTeamMember 
} = require('../controller/team');
const { authenticate, isAdmin } = require('../middleware/auth');
const { uploadSingle } = require('../../multer');

// Public routes
router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMemberById);

// Protected routes (admin only)
router.post('/', uploadSingle.single('image'), createTeamMember);
router.put('/:id', uploadSingle.single('image'), updateTeamMember);
router.delete('/:id', deleteTeamMember);

module.exports = router;

