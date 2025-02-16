import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './api/auth/routes.js';
import rankingsRoutes from './api/routes/rankings.js';
import dbCheck from './middleware/dbCheck.js';

dotenv.config();

const app = express();

// Set server timeout
app.set('timeout', 30000);

// CORS configuration
const corsOptions = {
    origin: ['https://365coin.netlify.app', 'http://localhost:3000', 'https://365coin.org'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 3600,
    preflightContinue: false
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection check middleware
app.use(dbCheck);

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        headers: req.headers,
        body: req.body
    });
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rankings', rankingsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({ 
        status: 'ok', 
        message: 'Server is running',
        database: dbStatus
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// MongoDB connection options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000,
    socketTimeoutMS: 45000,
    maxPoolSize: 50,
    minPoolSize: 10,
    retryWrites: true,
    w: 'majority',
    retryReads: true,
    ssl: true,
    tls: true,
    authSource: 'admin'
};

let connectionAttempts = 0;
const maxAttempts = 5;

const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
        console.log('MongoDB connected successfully');
        connectionAttempts = 0;
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        connectionAttempts++;
        
        if (connectionAttempts < maxAttempts) {
            console.log(`Retrying connection... Attempt ${connectionAttempts} of ${maxAttempts}`);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.error('Failed to connect to MongoDB after multiple attempts');
            process.exit(1);
        }
    }
};

// Start connection process
connectWithRetry();

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        if (server) {
            server.close(() => {
                console.log('Server closed');
            });
        }
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
}); 