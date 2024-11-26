const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup route with improved error handling
router.post('/signup', async (req, res) => {
    try {
        console.log('Received signup request:', req.body);
        const { email, password, username } = req.body;

        // Validate input
        if (!email || !password || !username) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user exists with detailed error
        try {
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
        } catch (error) {
            console.error('Error checking existing user:', error);
            return res.status(500).json({ message: 'Error checking user existence' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user with error handling
        try {
            await user.save();
        } catch (error) {
            console.error('Error saving user:', error);
            if (error.code === 11000) { // Duplicate key error
                return res.status(400).json({ 
                    message: 'Email or username already exists' 
                });
            }
            throw error;
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send success response
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
        res.status(500).json({ 
            message: 'Server error during signup',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // TODO: Implement password reset email functionality
        res.json({ message: 'Password reset instructions sent to your email' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
});

// Add this new route in auth.js
router.post('/connect-wallet', async (req, res) => {
    try {
        const { userId, walletAddress } = req.body;

        if (!userId || !walletAddress) {
            return res.status(400).json({ 
                message: 'User ID and wallet address are required' 
            });
        }

        // Find user and update wallet addresses
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if wallet address already exists for this user
        const existingWallet = user.walletAddresses.find(w => 
            w.address.toLowerCase() === walletAddress.toLowerCase()
        );

        if (!existingWallet) {
            user.walletAddresses.push({
                address: walletAddress,
                network: 'BSC',
                dateAdded: new Date()
            });
            await user.save();
        }

        res.json({
            message: 'Wallet connected successfully',
            walletAddresses: user.walletAddresses
        });
    } catch (error) {
        console.error('Wallet Connection Error:', error);
        res.status(500).json({ 
            message: 'Error connecting wallet',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Add this route to your auth.js
router.post('/disconnect-wallet', async (req, res) => {
    try {
        const { userId, walletAddress } = req.body;

        if (!userId || !walletAddress) {
            return res.status(400).json({ 
                message: 'User ID and wallet address are required' 
            });
        }

        // Find user and update wallet addresses
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the wallet address
        user.walletAddresses = user.walletAddresses.filter(w => 
            w.address.toLowerCase() !== walletAddress.toLowerCase()
        );

        await user.save();

        res.json({
            message: 'Wallet disconnected successfully',
            walletAddresses: user.walletAddresses
        });
    } catch (error) {
        console.error('Wallet Disconnection Error:', error);
        res.status(500).json({ 
            message: 'Error disconnecting wallet',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router; 