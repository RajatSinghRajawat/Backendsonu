const Property = require('../model/properties');

// Helper function to process images
const processImages = (files, bodyImages) => {
    if (files && files.length > 0) {
        return files.map(file => `/Uploads/${file.filename}`);
    }
    if (bodyImages) {
        return Array.isArray(bodyImages) ? bodyImages : [bodyImages];
    }
    return [];
};

// Helper function to process features
const processFeatures = (features) => {
    if (!features) return [];
    
    if (Array.isArray(features)) {
        return features.filter(f => f && f.trim());
    }
    
    if (typeof features === 'string') {
        try {
            const parsed = JSON.parse(features);
            return Array.isArray(parsed) ? parsed.filter(f => f && f.trim()) : [features.trim()];
        } catch (e) {
            // If not JSON, treat as comma-separated string
            return features.split(',').map(f => f.trim()).filter(f => f);
        }
    }
    
    return [String(features)];
};

// Helper function to validate required fields
const validatePropertyData = (data) => {
    const { name, pricePerGaj, Gaj, totalPrice, location, shortDescription, category } = data;
    const missing = [];
    
    if (!name) missing.push('name');
    if (!pricePerGaj && pricePerGaj !== 0) missing.push('pricePerGaj');
    if (!Gaj && Gaj !== 0) missing.push('Gaj');
    if (!totalPrice && totalPrice !== 0) missing.push('totalPrice');
    if (!location) missing.push('location');
    if (!shortDescription) missing.push('shortDescription');
    if (!category) missing.push('category');
    
    return missing;
};

const createProperty = async (req, res) => {
    try {
        const { name, pricePerGaj, Gaj, totalPrice, location, shortDescription, features, category } = req.body;
        
        // Validate required fields
        const missingFields = validatePropertyData(req.body);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }
        
        // Process images
        const images = processImages(req.files, req.body.images);
        if (images.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'At least one image is required' 
            });
        }
        
        // Process features
        const featuresArray = processFeatures(features);
        
        // Create property
        const property = new Property({
            name: name.trim(),
            pricePerGaj: Number(pricePerGaj),
            Gaj: Number(Gaj),
            totalPrice: Number(totalPrice),
            price: Number(totalPrice), // Set price = totalPrice for backward compatibility
            location: location.trim(),
            shortDescription: shortDescription.trim(),
            features: featuresArray,
            images,
            category: category.trim()
        });
        
        await property.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Property created successfully', 
            data: property 
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating property', 
            error: error.message 
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
                message: 'Invalid property ID' 
            });
        }
        
        // Process text fields
        if (req.body.name) updateData.name = req.body.name.trim();
        if (req.body.location) updateData.location = req.body.location.trim();
        if (req.body.shortDescription) updateData.shortDescription = req.body.shortDescription.trim();
        if (req.body.category) updateData.category = req.body.category.trim();
        
        // Process numeric fields
        if (req.body.pricePerGaj !== undefined) updateData.pricePerGaj = Number(req.body.pricePerGaj);
        if (req.body.Gaj !== undefined) updateData.Gaj = Number(req.body.Gaj);
        if (req.body.totalPrice !== undefined) {
            updateData.totalPrice = Number(req.body.totalPrice);
            updateData.price = Number(req.body.totalPrice); // Update price = totalPrice
        }
        
        // Process images
        const images = processImages(req.files, req.body.images);
        if (images.length > 0) {
            updateData.images = images;
        }
        
        // Process features
        if (req.body.features !== undefined) {
            updateData.features = processFeatures(req.body.features);
        }
        
        // Update updatedAt
        updateData.updatedAt = Date.now();
        
        // Update property
        const property = await Property.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!property) {
            return res.status(404).json({ 
                success: false, 
                message: 'Property not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Property updated successfully', 
            data: property 
        });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating property', 
            error: error.message 
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
