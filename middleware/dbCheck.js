const mongoose = require('mongoose');

const dbCheck = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database connection not ready',
            status: 'error',
            readyState: mongoose.connection.readyState,
            details: {
                0: 'disconnected',
                1: 'connected',
                2: 'connecting',
                3: 'disconnecting'
            }[mongoose.connection.readyState] || 'unknown'
        });
    }
    next();
};

module.exports = dbCheck; 