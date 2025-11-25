const mongoose = require('mongoose');


const inquierySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['New', 'Pending', 'Confirmed', 'Rejected'],
        default: 'New'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    // Property details stored for reference
    propertyDetails: {
        name: {
            type: String
        },
        title: {
            type: String
        },
        location: {
            type: String
        },
        price: {
            type: Number
        },
        totalPrice: {
            type: Number
        },
        pricePerGaj: {
            type: Number
        },
        gaj: {
            type: Number
        },
        category: {
            type: String
        },
        plotCategory: {
            type: String
        },
        image: {
            type: String
        }
    }
})

const Inquiry = mongoose.model('Inquiry', inquierySchema);

module.exports = Inquiry;