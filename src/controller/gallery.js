const Gallery = require('../model/gallery');

// Ensure image paths always start with "/uploads/filename"
const withUploadsPrefix = (imagePath) => {
    if (!imagePath) return imagePath;

    const clean = String(imagePath).replace(/^\/+/, '');
    if (clean.toLowerCase().startsWith('uploads/')) {
        return `/${clean}`;
    }
    return `/uploads/${clean}`;
};

const createGallery = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name is required' 
            });
        }
        
        if (!description || !description.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Description is required' 
            });
        }
        
        // Process images (normalize to start with /uploads/)
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map((file) => withUploadsPrefix(file.filename));
        } else if (req.body.images) {
            const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            images = bodyImages.map(withUploadsPrefix);
        }
        
        if (images.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'At least one image is required' 
            });
        }
        
        const gallery = new Gallery({ 
            name: name.trim(), 
            description: description.trim(), 
            images 
        });
        
        await gallery.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Gallery item created successfully', 
            data: gallery 
        });
    } catch (error) {
        console.error('Error creating gallery:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating gallery item', 
            error: error.message 
        });
    }
};

const getAllGalleries = async (req, res) => {
    try {
        const galleries = await Gallery.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        res.status(200).json({ 
            success: true, 
            count: galleries.length, 
            data: galleries 
        });
    } catch (error) {
        console.error('Error fetching galleries:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching gallery items', 
            error: error.message 
        });
    }
};

const getGalleryById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid gallery ID' 
            });
        }
        
        const gallery = await Gallery.findById(id).select('-__v');
        
        if (!gallery) {
            return res.status(404).json({ 
                success: false, 
                message: 'Gallery item not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: gallery 
        });
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching gallery item', 
            error: error.message 
        });
    }
};

const updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid gallery ID' 
            });
        }
        
        // Process text fields
        if (req.body.name) updateData.name = req.body.name.trim();
        if (req.body.description) updateData.description = req.body.description.trim();
        
        // Process images - only update if new files are uploaded
        if (req.files && req.files.length > 0) {
            // New files uploaded, replace images with normalized paths
            updateData.images = req.files.map((file) => withUploadsPrefix(file.filename));
        }
        // If no files uploaded, keep existing images (don't update images field)
        
        // Update gallery
        const gallery = await Gallery.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!gallery) {
            return res.status(404).json({ 
                success: false, 
                message: 'Gallery item not found' 
            });
        }
        console.log(gallery,'gallery');
        
        res.status(200).json({ 
            success: true, 
            message: 'Gallery item updated successfully', 
            data: gallery 
        });
    } catch (error) {
        console.error('Error updating gallery:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating gallery item', 
            error: error.message 
        });
    }
};

const deleteGallery = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid gallery ID' 
            });
        }
        
        const gallery = await Gallery.findByIdAndDelete(id);
        
        if (!gallery) {
            return res.status(404).json({ 
                success: false, 
                message: 'Gallery item not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Gallery item deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting gallery:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting gallery item', 
            error: error.message 
        });
    }
};

module.exports = { createGallery, getAllGalleries, getGalleryById, updateGallery, deleteGallery };
