import { connectDB } from '../db/connect';
import User from '../models/User';
import { verifyToken } from '../middleware/auth';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB();
        const { walletAddress } = req.body;
        const userId = req.userId; // Set by verifyToken middleware

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if wallet already exists
        const existingWallet = user.walletAddresses.find(w => 
            w.address.toLowerCase() === walletAddress.toLowerCase()
        );

        if (!existingWallet) {
            user.walletAddresses.push({
                address: walletAddress,
                network: 'BSC'
            });
            await user.save();
        }

        res.json({
            message: 'Wallet connected successfully',
            walletAddresses: user.walletAddresses
        });
    } catch (error) {
        console.error('Wallet Connection Error:', error);
        res.status(500).json({ message: 'Error connecting wallet' });
    }
}

export default verifyToken(handler); 