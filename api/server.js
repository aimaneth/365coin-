import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../utils/db.js';
import authRoutes from './auth/routes.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: ['https://365-coin.vercel.app', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// Handle 404
app.use((req, res) => {
    console.log('404 for:', req.url);
    res.status(404).json({ message: 'Not Found' });
});

// Connect to MongoDB
connectDB().then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.error('MongoDB Connection Error:', err);
});

export default app; 