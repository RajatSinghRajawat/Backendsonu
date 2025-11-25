const jwt = require('jsonwebtoken');
const User = require('../model/auth');
const Admin = require('../model/admin');

const authenticate = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
        if (token.startsWith('Bearer ')) token = token.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (!decoded.userId) return res.status(401).json({ success: false, message: 'Invalid token format' });
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token has expired' });
        if (error.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid token' });
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

// Admin Authentication Middleware
const authenticateAdmin = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
        if (token.startsWith('Bearer ')) token = token.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (!decoded.adminId) return res.status(401).json({ success: false, message: 'Invalid token format' });
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token has expired' });
        if (error.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid token' });
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error checking admin status', error: error.message });
    }
};

module.exports = { authenticate, authenticateAdmin, isAdmin };
