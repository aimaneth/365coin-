import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { connectDB } from '../utils/db.js';
import authRoutes from './auth/routes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Connect to MongoDB
try {
    await connectDB();
    console.log('MongoDB Connected Successfully');
} catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
}

// Use routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

try {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
}

export default app; 