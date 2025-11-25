const Inquiry = require('../model/inquiery');
const Property = require('../model/properties');

const createInquiry = async (req, res) => {
    try {
        const { propertyId, propertyTitle, propertyName, propertyLocation, propertyPrice, propertyTotalPrice, propertyPricePerGaj, propertyGaj, propertyCategory, propertyPlotCategory, propertyImage, ...inquiryData } = req.body;

        // If propertyId is provided, fetch property details
        let propertyDetails = {};
        if (propertyId) {
            try {
                const property = await Property.findById(propertyId);
                if (property) {
                    propertyDetails = {
                        name: property.name || propertyTitle || propertyName,
                        title: property.name || propertyTitle || propertyName,
                        location: property.location || propertyLocation,
                        price: property.price || propertyPrice,
                        totalPrice: property.totalPrice || propertyTotalPrice || property.price || propertyPrice,
                        pricePerGaj: property.pricePerGaj || propertyPricePerGaj,
                        gaj: property.Gaj || property.gaj || propertyGaj,
                        category: property.category || propertyCategory,
                        plotCategory: property.plotCategory || property.category || propertyPlotCategory,
                        image: Array.isArray(property.images) && property.images.length > 0 
                            ? property.images[0] 
                            : (typeof property.images === 'string' ? property.images : propertyImage)
                    };
                }
            } catch (propError) {
                console.error('Error fetching property:', propError);
                // Use provided property details if property fetch fails
                propertyDetails = {
                    name: propertyTitle || propertyName,
                    title: propertyTitle || propertyName,
                    location: propertyLocation,
                    price: propertyPrice,
                    totalPrice: propertyTotalPrice || propertyPrice,
                    pricePerGaj: propertyPricePerGaj,
                    gaj: propertyGaj,
                    category: propertyCategory,
                    plotCategory: propertyPlotCategory,
                    image: propertyImage
                };
            }
        } else {
            // Use provided property details if no propertyId
            propertyDetails = {
                name: propertyTitle || propertyName,
                title: propertyTitle || propertyName,
                location: propertyLocation,
                price: propertyPrice,
                totalPrice: propertyTotalPrice || propertyPrice,
                pricePerGaj: propertyPricePerGaj,
                gaj: propertyGaj,
                category: propertyCategory,
                plotCategory: propertyPlotCategory,
                image: propertyImage
            };
        }

        const inquiry = new Inquiry({
            ...inquiryData,
            propertyId: propertyId || null,
            propertyDetails: propertyDetails
        });
        await inquiry.save();
        res.status(201).json({ success: true, message: 'Inquiry created successfully', data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating inquiry', error: error.message });
    }
};

const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find()
            .populate('propertyId', 'name location totalPrice pricePerGaj Gaj category plotCategory images')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching inquiries', error: error.message });
    }
};

const getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id)
            .populate('propertyId', 'name location totalPrice pricePerGaj Gaj category plotCategory images');
        if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
        res.status(200).json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching inquiry', error: error.message });
    }
};

const updateInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
        res.status(200).json({ success: true, message: 'Inquiry updated successfully', data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating inquiry', error: error.message });
    }
};

const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
        res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting inquiry', error: error.message });
    }
};

module.exports = { createInquiry, getAllInquiries, getInquiryById, updateInquiry, deleteInquiry };
