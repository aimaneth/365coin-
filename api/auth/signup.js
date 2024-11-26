import { connectDB } from '../../utils/db.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        await connectDB();
        
        const { email, password, username } = req.body;
        console.log('Signup attempt:', { email, username });

        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email ? 
                    'Email already registered' : 
                    'Username already taken' 
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password // Password will be hashed by the pre-save hook
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
}; 