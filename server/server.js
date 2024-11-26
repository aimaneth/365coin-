require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const contributionsRoutes = require('./routes/contributions');

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'https://365coin-aimaneths-projects-ae029b18.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection with improved options
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
    console.error('MongoDB Error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB Disconnected. Attempting to reconnect...');
    connectDB();
});

// Initial connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contributions', contributionsRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 