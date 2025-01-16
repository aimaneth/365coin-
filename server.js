import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './api/auth/routes.js';

dotenv.config();

const app = express();

// Set server timeout
app.set('timeout', 30000); // 30 seconds timeout

// CORS configuration
const corsOptions = {
    origin: ['https://365coin.netlify.app', 'http://localhost:3000', 'https://365coin.org'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: false,
    optionsSuccessStatus: 200,
    preflightContinue: false
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsing middleware with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        headers: req.headers,
        body: req.body
    });
    next();
});

// Add CORS headers to all responses
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (corsOptions.origin.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Allow-Credentials', 'false');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
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
    serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
    heartbeatFrequencyMS: 2000,    // Check server status every 2 seconds
    socketTimeoutMS: 45000,        // Close sockets after 45 seconds of inactivity
    maxPoolSize: 50,               // Maintain up to 50 socket connections
    minPoolSize: 10,               // Maintain at least 10 socket connections
    maxIdleTimeMS: 30000,          // Close idle connections after 30 seconds
    retryWrites: true,             // Enable retrying write operations
    retryReads: true,              // Enable retrying read operations
    family: 4                      // Force IPv4
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, mongoOptions)
    .then(() => {
        console.log('Connected to MongoDB');
        startServer();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

// Start server function
const startServer = () => {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    // Configure server timeout
    server.timeout = 30000; // 30 seconds timeout

    // Handle server errors
    server.on('error', (error) => {
        console.error('Server error:', error);
        if (error.code === 'EADDRINUSE') {
            console.log('Address in use, retrying...');
            setTimeout(() => {
                server.close();
                server.listen(PORT);
            }, 1000);
        }
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        } catch (err) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
    });
};

startServer(); 