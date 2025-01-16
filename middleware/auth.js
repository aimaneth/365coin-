const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const auth = async (req, res, next) => {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
            message: 'Database connection not ready',
            status: 'error',
            readyState: mongoose.connection.readyState
        });
    }

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};

module.exports = auth; 