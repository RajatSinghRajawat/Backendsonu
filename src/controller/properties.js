const Property = require('../model/properties');

// Ensure image paths always start with "/uploads/filename"
const withUploadsPrefix = (imagePath) => {
    if (!imagePath) return imagePath;

    const clean = String(imagePath).replace(/^\/+/, '');
    if (clean.toLowerCase().startsWith('uploads/')) {
        return `/${clean}`;
    }
    return `/uploads/${clean}`;
};

const createProperty = async (req, res) => {
    try {
        const {
            name,
            pricePerGaj,
            Gaj,
            totalPrice,
            location,
            shortDescription,
            features,
            category,
        } = req.body;

        // Simple required field check (backend schema will also validate)
        if (!name || !pricePerGaj || !Gaj || !totalPrice || !location || !shortDescription || !category) {
            return res.status(400).json({
                success: false,
                message: 'name, pricePerGaj, Gaj, totalPrice, location, shortDescription, category are required',
            });
        }

        // Simple image handling:
        // - if Multer uploaded files, use their filenames with /uploads/ prefix
        // - otherwise, expect `images` from body as array or single string and normalize
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map((file) => withUploadsPrefix(file.filename));
        } else if (req.body.images) {
            const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            images = bodyImages.map(withUploadsPrefix);
        }

        if (!images.length) {
            return res.status(400).json({
                success: false,
                message: 'At least one image is required',
            });
        }

        // Simple features handling:
        // - array -> keep as is
        // - string -> split by comma
        let featuresArray = [];
        if (Array.isArray(features)) {
            featuresArray = features;
        } else if (typeof features === 'string' && features.trim()) {
            featuresArray = features
                .split(',')
                .map((f) => f.trim())
                .filter(Boolean);
        }

        const property = new Property({
            name: name.trim(),
            pricePerGaj: Number(pricePerGaj),
            Gaj: Number(Gaj),
            totalPrice: Number(totalPrice),
            price: Number(totalPrice), // keep same behaviour
            location: location.trim(),
            shortDescription: shortDescription.trim(),
            features: featuresArray,
            images,
            category: category.trim(),
        });

        await property.save();

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: property,
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating property',
            error: error.message,
        });
    }
};

const getAllProperties = async (req, res) => {
    try {
        const { category, location, minPrice, maxPrice } = req.query;
        const query = {};
        
        // Filter by category
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        
        // Filter by location (case-insensitive)
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        
        // Filter by price range (using totalPrice)
        if (minPrice || maxPrice) {
            query.totalPrice = {};
            if (minPrice) query.totalPrice.$gte = Number(minPrice);
            if (maxPrice) query.totalPrice.$lte = Number(maxPrice);
        }
        
        const properties = await Property.find(query)
            .sort({ createdAt: -1 })
            .select('-__v');
        
        res.status(200).json({ 
            success: true, 
            count: properties.length, 
            data: properties 
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching properties', 
            error: error.message 
        });
    }
};

const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid property ID' 
            });
        }
        
        const property = await Property.findById(id).select('-__v');
        
        if (!property) {
            return res.status(404).json({ 
                success: false, 
                message: 'Property not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: property 
        });
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching property', 
            error: error.message 
        });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};

        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: 'Invalid property ID',
            });
        }

        // Simple text fields
        if (req.body.name) updateData.name = req.body.name.trim();
        if (req.body.location) updateData.location = req.body.location.trim();
        if (req.body.shortDescription) updateData.shortDescription = req.body.shortDescription.trim();
        if (req.body.category) updateData.category = req.body.category.trim();

        // Simple numeric fields
        if (req.body.pricePerGaj !== undefined) updateData.pricePerGaj = Number(req.body.pricePerGaj);
        if (req.body.Gaj !== undefined) updateData.Gaj = Number(req.body.Gaj);
        if (req.body.totalPrice !== undefined) {
            updateData.totalPrice = Number(req.body.totalPrice);
            updateData.price = Number(req.body.totalPrice);
        }

        // Simple image update:
        // - if new files uploaded, replace images with new filenames (with /uploads/ prefix)
        // - else if `images` in body, normalize and use that
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map((file) => withUploadsPrefix(file.filename));
        } else if (req.body.images) {
            const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            updateData.images = bodyImages.map(withUploadsPrefix);
        }

        // Simple features update
        if (req.body.features !== undefined) {
            if (Array.isArray(req.body.features)) {
                updateData.features = req.body.features;
            } else if (typeof req.body.features === 'string' && req.body.features.trim()) {
                updateData.features = req.body.features
                    .split(',')
                    .map((f) => f.trim())
                    .filter(Boolean);
            } else {
                updateData.features = [];
            }
        }

        updateData.updatedAt = Date.now();

        const property = await Property.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select('-__v');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data: property,
        });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating property',
            error: error.message,
        });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid property ID' 
            });
        }
        
        const property = await Property.findByIdAndDelete(id);
        
        if (!property) {
            return res.status(404).json({ 
                success: false, 
                message: 'Property not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Property deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting property', 
            error: error.message 
        });
    }
};

module.exports = { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty };
