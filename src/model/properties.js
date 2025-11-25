const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Property name is required'],
        trim: true
    },
    price: {
        type: Number,
        default: function() {
            // Auto-calculate from totalPrice if not provided
            return this.totalPrice || 0;
        }
    },
    pricePerGaj: {
        type: Number,
        required: [true, 'Price per Gaj is required'],
        min: [0, 'Price per Gaj must be positive']
    },
    Gaj: {
        type: Number,
        required: [true, 'Gaj is required'],
        min: [0, 'Gaj must be positive']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total price must be positive']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description is required'],
        trim: true
    },
    features: {
        type: [String],
        default: []
    },
    images: {
        type: [String],
        required: [true, 'At least one image is required'],
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'At least one image is required'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-update updatedAt before saving
propertySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    // Auto-calculate price from totalPrice if not set
    if (!this.price && this.totalPrice) {
        this.price = this.totalPrice;
    }
    next();
});

module.exports = mongoose.model('Property', propertySchema);