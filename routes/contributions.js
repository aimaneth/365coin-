const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user contributions
router.get('/:address', auth, async (req, res) => {
    try {
        const user = await User.findOne({ address: req.params.address });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.contributions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new contribution
router.post('/', auth, async (req, res) => {
    try {
        const { address, amount, tokens, currency } = req.body;
        const user = await User.findOne({ address });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.contributions.push({
            amount,
            tokens,
            timestamp: new Date(),
            currency
        });

        await user.save();
        res.json(user.contributions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 