import { verifyToken } from '../middleware/auth';
import { connectDB } from '../db/connect';
import User from '../models/User';

async function handler(req, res) {
    try {
        await connectDB();
        const user = await User.findById(req.userId);
        
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
        console.error('Token Verification Error:', error);
        res.status(500).json({ message: 'Error verifying token' });
    }
}

export default verifyToken(handler); 