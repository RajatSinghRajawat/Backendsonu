const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Featured image is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    category: {
        type: String,
        trim: true,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    excerpt: {
        type: String,
        trim: true,
        default: ''
    },
    subHeadings: [{
        title: {
            type: String,
            trim: true
        },
        content: {
            type: String,
            trim: true
        }
    }],
    quotes: [{
        type: String,
        trim: true
    }],
    highlightPoints: [{
        type: String,
        trim: true
    }],
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
blogSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Blog', blogSchema);