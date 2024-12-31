import express from 'express';
import { User } from '../models/User.js';
import { auth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register new user
router.post('/signup', async (req, res) => {
  try {
    console.log('Received signup request:', req.body); // Debug log
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password }); // Debug log
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Check email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email); // Debug log
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }

    // Check password length
    if (password.length < 6) {
      console.log('Password too short:', password.length); // Debug log
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      console.log('User already exists:', { 
        existingEmail: existingUser.email === email, 
        existingUsername: existingUser.username === username 
      }); // Debug log
      return res.status(400).json({ 
        message: existingUser.email === email ? 
          'Email already registered' : 
          'Username already taken' 
      });
    }

    console.log('Creating new user:', { username, email }); // Debug log
    const user = new User({ username, email, password });
    await user.save();
    const token = await user.generateAuthToken();

    console.log('User created successfully:', user._id); // Debug log
    res.status(201).json({ 
      user: user.toJSON(), 
      token 
    });
  } catch (error) {
    console.error('Detailed signup error:', error); // Debug log
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Quick validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Find user without selecting all fields
        const user = await User.findOne({ email })
            .select('+password -__v')
            .lean()
            .exec();

        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Remove sensitive data
        delete user.password;
        
        // Send response
        res.json({ 
            user,
            token 
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ 
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});

// Logout user
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        // req.user is set by the auth middleware
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Connect wallet to user account
router.post('/connect-wallet', auth, async (req, res) => {
    try {
        const { walletAddress } = req.body;
        
        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        // Check if wallet is already connected to this user
        const user = await User.findById(req.user.id);
        const existingWallet = user.walletAddresses?.find(w => 
            w.address.toLowerCase() === walletAddress.toLowerCase()
        );

        if (existingWallet) {
            return res.status(400).json({ message: 'Wallet already connected to this account' });
        }

        // Add the new wallet
        user.walletAddresses = [
            ...(user.walletAddresses || []),
            {
                address: walletAddress,
                network: 'BSC', // Default to BSC network
                dateAdded: new Date()
            }
        ];

        await user.save();
        res.json({ user: user.toJSON() });
    } catch (error) {
        console.error('Connect Wallet Error:', error);
        res.status(500).json({ message: 'Failed to connect wallet' });
    }
});

// Disconnect wallet from user account
router.post('/disconnect-wallet', auth, async (req, res) => {
    try {
        const { walletAddress } = req.body;
        
        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        const user = await User.findById(req.user.id);
        
        // Remove the wallet
        user.walletAddresses = user.walletAddresses?.filter(w => 
            w.address.toLowerCase() !== walletAddress.toLowerCase()
        ) || [];

        await user.save();
        res.json({ user: user.toJSON() });
    } catch (error) {
        console.error('Disconnect Wallet Error:', error);
        res.status(500).json({ message: 'Failed to disconnect wallet' });
    }
});

export default router; 