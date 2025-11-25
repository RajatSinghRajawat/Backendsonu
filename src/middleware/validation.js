const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone);

const validateContact = (req, res, next) => {
    const { name, email, phone, subject, message } = req.body;
    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters long');
    if (!email || !validateEmail(email)) errors.push('Valid email is required');
    if (!phone || !validatePhone(phone)) errors.push('Valid phone number is required');
    if (!subject || !['buying', 'selling', 'investment', 'valuation', 'other'].includes(subject)) errors.push('Valid subject is required');
    // if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters long');
    if (errors.length > 0) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    next();
};

const validateInquiry = (req, res, next) => {
    const { name, email, phone, message } = req.body;
    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters long');
    if (!email || !validateEmail(email)) errors.push('Valid email is required');
    if (!phone || !validatePhone(phone)) errors.push('Valid phone number is required');
    if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters long');
    if (errors.length > 0) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    next();
};

const validateBlog = (req, res, next) => {
    const { name, author, description, content } = req.body;
    const errors = [];
    if (!name || name.trim().length < 3) errors.push('Blog name must be at least 3 characters long');
    if (!author || author.trim().length < 2) errors.push('Author name must be at least 2 characters long');
    if (!description || description.trim().length < 20) errors.push('Description must be at least 20 characters long');
    if (!content || content.trim().length < 50) errors.push('Content must be at least 50 characters long');
    if (errors.length > 0) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    next();
};

const validateTestimonial = (req, res, next) => {
    const { name, title, text, rating } = req.body;
    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters long');
    if (!title || title.trim().length < 2) errors.push('Title must be at least 2 characters long');
    // if (!text || text.trim().length < 10) errors.push('Testimonial text must be at least 10 characters long');
    if (!rating || rating < 1 || rating > 5) errors.push('Rating must be between 1 and 5');
    if (errors.length > 0) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    next();
};

const validateProperty = (req, res, next) => {
    const { name, pricePerGaj, Gaj, totalPrice, location, shortDescription, category } = req.body;
    const errors = [];
    
    // Validate name
    if (!name || name.trim().length < 3) {
        errors.push('Property name must be at least 3 characters long');
    }
    
    // Validate pricePerGaj
    if (!pricePerGaj || isNaN(pricePerGaj) || Number(pricePerGaj) <= 0) {
        errors.push('Valid price per Gaj is required (must be greater than 0)');
    }
    
    // Validate Gaj
    if (!Gaj || isNaN(Gaj) || Number(Gaj) <= 0) {
        errors.push('Valid Gaj is required (must be greater than 0)');
    }
    
    // Validate totalPrice
    if (!totalPrice || isNaN(totalPrice) || Number(totalPrice) <= 0) {
        errors.push('Valid total price is required (must be greater than 0)');
    }
    
    // Validate location
    if (!location || location.trim().length < 3) {
        errors.push('Location must be at least 3 characters long');
    }
    
    // Validate shortDescription
    if (!shortDescription || shortDescription.trim().length < 10) {
        errors.push('Short description must be at least 10 characters long');
    }
    
    // Validate category
    if (!category || category.trim().length < 2) {
        errors.push('Category is required');
    }
    
    // Validate images (check if files are uploaded)
    if (!req.files || req.files.length === 0) {
        errors.push('At least one image is required');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Validation failed', 
            errors 
        });
    }
    
    next();
};

const validateGallery = (req, res, next) => {
    const { name, description } = req.body;
    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters long');
    if (!description || description.trim().length < 10) errors.push('Description must be at least 10 characters long');
    if (errors.length > 0) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    next();
};

const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters long');
    if (!email || !validateEmail(email)) errors.push('Valid email is required');
    if (!password || password.length < 6) errors.push('Password must be at least 6 characters long');
    if (errors.length > 0) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];
    if (!email || !validateEmail(email)) errors.push('Valid email is required');
    if (!password || password.length < 1) errors.push('Password is required');
    if (errors.length > 0) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    next();
};

module.exports = { validateContact, validateInquiry, validateBlog, validateTestimonial, validateProperty, validateGallery, validateRegister, validateLogin };
