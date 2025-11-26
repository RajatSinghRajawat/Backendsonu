const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const connectDB = require('./src/config/Dbconfig');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use(express.static('public/Uploads'));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/blog', require('./src/routes/blog'));
app.use('/api/testimonials', require('./src/routes/testinomials'));
app.use('/api/inquiry', require('./src/routes/inquiery'));
app.use('/api/gallery', require('./src/routes/gallery'));
app.use('/api/properties', require('./src/routes/properties'));
app.use('/api/team', require('./src/routes/team'));


// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

