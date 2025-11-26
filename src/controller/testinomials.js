const Testimonial = require('../model/testinomials');

const createTestimonial = async (req, res) => {
    try {
        const { name, title, text, rating, status } = req.body;
        const image = req.file ? `${req.file.filename}` : req.body.image;
        
        // Validate required fields
        if (!name || !title || !text || !rating) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, title, text, and rating are required' 
            });
        }
        
        if (!image) {
            return res.status(400).json({ 
                success: false, 
                message: 'Image is required' 
            });
        }
        
        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }
        
        const testimonial = new Testimonial({ 
            name: name.trim(), 
            title: title.trim(), 
            text: text.trim(), 
            rating: ratingNum, 
            image,
            status: status || 'pending'
        });
        
        await testimonial.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Testimonial created successfully', 
            data: testimonial 
        });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating testimonial', 
            error: error.message 
        });
    }
};

const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        res.status(200).json({ 
            success: true, 
            count: testimonials.length, 
            data: testimonials 
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching testimonials', 
            error: error.message 
        });
    }
};

const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid testimonial ID' 
            });
        }
        
        const testimonial = await Testimonial.findById(id).select('-__v');
        
        if (!testimonial) {
            return res.status(404).json({ 
                success: false, 
                message: 'Testimonial not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: testimonial 
        });
    } catch (error) {
        console.error('Error fetching testimonial:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching testimonial', 
            error: error.message 
        });
    }
};

const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid testimonial ID' 
            });
        }
        
        // Process text fields
        if (req.body.name) updateData.name = req.body.name.trim();
        if (req.body.title) updateData.title = req.body.title.trim();
        if (req.body.text) updateData.text = req.body.text.trim();
        
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
        
        // Process image
        if (req.file) {
            updateData.image = `${req.file.filename}`;
        } else if (req.body.image) {
            updateData.image = req.body.image;
        }
        
        // Process status
        if (req.body.status) {
            if (['pending', 'approved', 'declined'].includes(req.body.status)) {
                updateData.status = req.body.status;
            }
        }
        
        // Update updatedAt
        updateData.updatedAt = Date.now();
        
        // Update testimonial
        const testimonial = await Testimonial.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!testimonial) {
            return res.status(404).json({ 
                success: false, 
                message: 'Testimonial not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Testimonial updated successfully', 
            data: testimonial 
        });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating testimonial', 
            error: error.message 
        });
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid testimonial ID' 
            });
        }
        
        const testimonial = await Testimonial.findByIdAndDelete(id);
        
        if (!testimonial) {
            return res.status(404).json({ 
                success: false, 
                message: 'Testimonial not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Testimonial deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting testimonial', 
            error: error.message 
        });
    }
};

module.exports = { createTestimonial, getAllTestimonials, getTestimonialById, updateTestimonial, deleteTestimonial };
