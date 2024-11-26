import jwt from 'jsonwebtoken';
import { connectDB } from '../../utils/db.js';
import User from '../../models/User.js';

export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await connectDB();
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                walletAddresses: user.walletAddresses
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
}; 