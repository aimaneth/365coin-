import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './api/auth/routes.js';

dotenv.config();

const app = express();

// Set server timeout
app.set('timeout', 30000);

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
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection check middleware
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database connection not ready. Please try again.',
            readyState: mongoose.connection.readyState
        });
    }
    next();
});

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        headers: req.headers,
        body: req.body
    });
    next();
});

// CORS headers middleware
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
    serverSelectionTimeoutMS: 30000,
    heartbeatFrequencyMS: 2000,
    socketTimeoutMS: 45000,
    maxPoolSize: 50,
    minPoolSize: 10,
    maxIdleTimeMS: 30000,
    retryWrites: true,
    retryReads: true,
    family: 4,
    autoIndex: true,
    connectTimeoutMS: 30000,
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    directConnection: false,
    replicaSet: 'atlas-11gkgh-shard-0',
    authSource: 'admin'
};

let server;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
        console.log('MongoDB connected successfully');
        return true;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        return false;
    }
};

const startServer = async () => {
    let retries = 5;
    let connected = false;

    while (retries > 0 && !connected) {
        connected = await connectDB();
        if (!connected) {
            console.log(`Connection attempt failed. ${retries - 1} retries remaining...`);
            retries--;
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

    if (!connected) {
        console.error('Failed to connect to MongoDB after multiple attempts');
        process.exit(1);
    }

    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    server.timeout = 30000;

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
};

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    setTimeout(connectDB, 5000);
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
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

// Start the server
startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
}); 