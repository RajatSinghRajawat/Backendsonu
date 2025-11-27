const Feedback = require('../model/feedbakcks');

const createFeedback = async (req, res) => {
    try {
        const { name, email, message, rating } = req.body;
        
        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name is required' 
            });
        }
        
        if (!email || !email.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        if (!message || !message.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Message is required' 
            });
        }
        
        if (!rating || isNaN(rating)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating is required' 
            });
        }
        
        // Validate rating range (1-5)
        const ratingNum = Number(rating);
        if (ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }
        
        const feedback = new Feedback({ 
            name: name.trim(), 
            email: email.trim().toLowerCase(), 
            message: message.trim(),
            rating: ratingNum,
            status: 'pending' // Default status
        });
        
        await feedback.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Feedback created successfully', 
            data: feedback 
        });
    } catch (error) {
        console.error('Error creating feedback:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating feedback', 
            error: error.message 
        });
    }
};

// Public route - get only approved feedbacks
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .select('-__v');
        res.status(200).json({ 
            success: true, 
            count: feedbacks.length, 
            data: feedbacks 
        });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching feedbacks', 
            error: error.message 
        });
    }
};

// Admin route - get all feedbacks
const getAllFeedbacksAdmin = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        res.status(200).json({ 
            success: true, 
            count: feedbacks.length, 
            data: feedbacks 
        });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching feedbacks', 
            error: error.message 
        });
    }
};

const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid feedback ID' 
            });
        }
        
        const feedback = await Feedback.findById(id).select('-__v');
        
        if (!feedback) {
            return res.status(404).json({ 
                success: false, 
                message: 'Feedback not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: feedback 
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching feedback', 
            error: error.message 
        });
    }
};

const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid feedback ID' 
            });
        }
        
        // Process text fields
        if (req.body.name) updateData.name = req.body.name.trim();
        if (req.body.message) updateData.message = req.body.message.trim();
        
        // Process email with validation
        if (req.body.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid email format' 
                });
            }
            updateData.email = req.body.email.trim().toLowerCase();
        }
        
        // Process rating
        if (req.body.rating !== undefined) {
            const ratingNum = Number(req.body.rating);
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Rating must be between 1 and 5' 
                });
            }
            updateData.rating = ratingNum;
        }
        
        // Process status
        if (req.body.status) {
            const validStatuses = ['pending', 'approved', 'declined'];
            if (!validStatuses.includes(req.body.status)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Status must be pending, approved, or declined' 
                });
            }
            updateData.status = req.body.status;
        }
        
        // Update feedback
        const feedback = await Feedback.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!feedback) {
            return res.status(404).json({ 
                success: false, 
                message: 'Feedback not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Feedback updated successfully', 
            data: feedback 
        });
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating feedback', 
            error: error.message 
        });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid feedback ID' 
            });
        }
        
        const feedback = await Feedback.findByIdAndDelete(id);
        
        if (!feedback) {
            return res.status(404).json({ 
                success: false, 
                message: 'Feedback not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Feedback deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting feedback', 
            error: error.message 
        });
    }
};

// Update feedback status only
const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid feedback ID' 
            });
        }
        
        // Validate status
        const validStatuses = ['pending', 'approved', 'declined'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Status must be pending, approved, or declined' 
            });
        }
        
        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!feedback) {
            return res.status(404).json({ 
                success: false, 
                message: 'Feedback not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Feedback status updated successfully', 
            data: feedback 
        });
    } catch (error) {
        console.error('Error updating feedback status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating feedback status', 
            error: error.message 
        });
    }
};

module.exports = { 
    createFeedback, 
    getAllFeedbacks, 
    getAllFeedbacksAdmin,
    getFeedbackById, 
    updateFeedback, 
    updateFeedbackStatus,
    deleteFeedback 
};

