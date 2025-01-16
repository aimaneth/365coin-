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
    serverSelectionTimeoutMS: 15000, // Increased timeout for server selection
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    connectTimeoutMS: 15000, // Increased timeout for initial connection
    maxPoolSize: 50, // Maintain up to 50 socket connections
    minPoolSize: 10, // Maintain at least 10 socket connections
    maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
    retryWrites: true, // Enable retrying write operations
    retryReads: true, // Enable retrying read operations
    family: 4 // Force IPv4
};

// Connect to MongoDB with retry mechanism
const connectWithRetry = async () => {
    const maxRetries = 5; // Increased retries
    let retries = 0;
    let connected = false;

    while (retries < maxRetries && !connected) {
        try {
            console.log(`MongoDB connection attempt ${retries + 1}/${maxRetries}`);
            await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
            console.log('Connected to MongoDB');
            connected = true;

            // Set up connection event handlers
            mongoose.connection.on('error', err => {
                console.error('MongoDB connection error:', err);
                if (!connected) {
                    setTimeout(() => connectWithRetry(), 5000);
                }
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected. Attempting to reconnect...');
                if (!connected) {
                    setTimeout(() => connectWithRetry(), 5000);
                }
            });

            // Graceful shutdown
            process.on('SIGINT', async () => {
                try {
                    await mongoose.connection.close();
                    console.log('MongoDB connection closed through app termination');
                    process.exit(0);
                } catch (err) {
                    console.error('Error during MongoDB shutdown:', err);
                    process.exit(1);
                }
            });

        } catch (err) {
            retries++;
            console.error(`MongoDB connection attempt ${retries} failed:`, err);
            if (retries === maxRetries) {
                console.error('Failed to connect to MongoDB after maximum retries');
                process.exit(1);
            }
            // Wait before retrying (exponential backoff with max delay of 10 seconds)
            const delay = Math.min(Math.pow(2, retries) * 1000, 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return connected;
};

// Start server only after MongoDB connection is established
const startServer = async () => {
    try {
        const connected = await connectWithRetry();
        if (!connected) {
            console.error('Could not establish MongoDB connection. Exiting...');
            process.exit(1);
        }

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

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 