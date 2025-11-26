const Admin = require('../model/admin');
const jwt = require('jsonwebtoken');
const { uploadSingle } = require('../../multer');

const generateToken = (adminId) => {
    return jwt.sign({ adminId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '30d' });
};

// Admin Register
const adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name is required' 
            });
        }
        
        if (!email || !email.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }
        
        if (!password || password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        
        if (existingAdmin) {
            return res.status(400).json({ 
                success: false, 
                message: 'Admin already exists with this email' 
            });
        }
        
        // Create new admin
        const admin = new Admin({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password 
        });
        
        await admin.save();
        
        // Generate token
        const token = generateToken(admin._id);
        
        res.status(201).json({
            success: true, 
            message: 'Admin registered successfully',
            data: { 
                user: { 
                    id: admin._id, 
                    name: admin.name, 
                    email: admin.email,
                    profilePicture: admin.profilePicture || ''
                }, 
                token 
            }
        });
    } catch (error) {
        console.error('Error in admin register:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error registering admin', 
            error: error.message 
        });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        const isMatch = await admin.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        const token = generateToken(admin._id);
        
        res.status(200).json({
            success: true, 
            message: 'Login successful',
            data: { 
                user: { 
                    id: admin._id, 
                    name: admin.name, 
                    email: admin.email,
                    profilePicture: admin.profilePicture || ''
                }, 
                token 
            }
        });
    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error logging in', 
            error: error.message 
        });
    }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: admin 
        });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching profile', 
            error: error.message 
        });
    }
};

// Update Admin Profile
const updateAdminProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const updateData = {};
        
        if (name) {
            updateData.name = name.trim();
        }
        
        // Handle profile picture upload
        if (req.file) {
            updateData.profilePicture = `${req.file.filename}`;
        }
        
        updateData.updatedAt = Date.now();
        
        const admin = await Admin.findByIdAndUpdate(
            req.adminId, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Profile updated successfully', 
            data: admin 
        });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating profile', 
            error: error.message 
        });
    }
};

// Change Admin Password
const changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password and new password are required' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters long' 
            });
        }
        
        const admin = await Admin.findById(req.adminId);
        
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }
        
        // Verify current password
        const isMatch = await admin.comparePassword(currentPassword);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }
        
        // Update password
        admin.password = newPassword;
        admin.updatedAt = Date.now();
        await admin.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Password changed successfully' 
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error changing password', 
            error: error.message 
        });
    }
};

module.exports = {
    adminRegister,
    adminLogin,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword
};

