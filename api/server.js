import express from 'express';
import cors from 'cors';
import { connectDB } from '../utils/db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import routes
import authRoutes from './auth/routes.js';

// Use routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 