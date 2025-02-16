import express from 'express';
import { Trade } from '../models/Trade.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get trader rankings
router.get('/', async (req, res) => {
    try {
        // Check database connection
        if (mongoose.connection.readyState !== 1) {
            console.error('Database not connected. State:', mongoose.connection.readyState);
            return res.status(503).json({
                success: false,
                message: 'Database connection not ready',
                readyState: mongoose.connection.readyState
            });
        }

        // Debug: Log collection names
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        // Debug: Check if we have users and trades
        const userCount = await User.countDocuments();
        const tradeCount = await Trade.countDocuments();
        console.log(`Found ${userCount} users and ${tradeCount} trades`);

        // Debug: Get sample trade and user
        const sampleTrade = await Trade.findOne();
        const sampleUser = await User.findById(sampleTrade?.userId);
        console.log('Sample trade:', sampleTrade);
        console.log('Sample user:', sampleUser);

        // Get all trades with user details
        const rankings = await Trade.aggregate([
            // Match only closed trades
            { 
                $match: { 
                    status: 'closed',
                    userId: { $exists: true, $ne: null }
                } 
            },
            
            // Group trades by userId
            {
                $group: {
                    _id: '$userId',
                    totalPnL: { $sum: { $ifNull: ['$pnl', 0] } },
                    totalTrades: { $sum: 1 },
                    winningTrades: {
                        $sum: { 
                            $cond: [{ $gt: [{ $ifNull: ['$pnl', 0] }, 0] }, 1, 0] 
                        }
                    },
                    totalVolume: {
                        $sum: { 
                            $multiply: [
                                { $ifNull: ['$amount', 0] }, 
                                { $ifNull: ['$entryPrice', 0] }
                            ] 
                        }
                    },
                    lastTrade: { $max: '$closedAt' },
                    trades: { $push: '$$ROOT' }
                }
            },
            
            // Calculate win rate
            {
                $addFields: {
                    winRate: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: ['$totalTrades', 0] },
                                    0,
                                    { $divide: ['$winningTrades', '$totalTrades'] }
                                ]
                            },
                            100
                        ]
                    }
                }
            },
            
            // Look up user details
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            
            // Filter out traders with no user data
            {
                $match: {
                    'user.0': { $exists: true }
                }
            },
            
            // Unwind the user array
            { $unwind: '$user' },
            
            // Project final fields
            {
                $project: {
                    username: '$user.username',
                    walletAddress: { $arrayElemAt: ['$user.walletAddresses.address', 0] },
                    totalPnL: { $round: ['$totalPnL', 2] },
                    totalTrades: 1,
                    winRate: { $round: ['$winRate', 2] },
                    totalVolume: { $round: ['$totalVolume', 2] },
                    lastTrade: 1
                }
            },
            
            // Sort by total PnL descending
            { $sort: { totalPnL: -1 } }
        ]);

        console.log('Rankings before formatting:', JSON.stringify(rankings, null, 2));

        if (!rankings || rankings.length === 0) {
            console.log('No rankings found after aggregation');
            return res.json({
                success: true,
                rankings: [],
                debug: {
                    userCount,
                    tradeCount,
                    rankingsCount: 0,
                    message: 'No rankings found'
                }
            });
        }

        // Format the response
        const formattedRankings = rankings.map((trader, index) => ({
            rank: index + 1,
            username: trader.username || 'Unknown Trader',
            walletAddress: trader.walletAddress || 'No Address',
            stats: {
                totalPnL: trader.totalPnL || 0,
                totalTrades: trader.totalTrades || 0,
                winRate: trader.winRate || 0,
                totalVolume: trader.totalVolume || 0,
                lastActive: trader.lastTrade || new Date()
            }
        }));

        console.log('Final formatted rankings:', JSON.stringify(formattedRankings, null, 2));

        // Send response
        res.json({
            success: true,
            rankings: formattedRankings,
            debug: {
                userCount,
                tradeCount,
                rankingsCount: rankings.length,
                collections: collections.map(c => c.name)
            }
        });
    } catch (error) {
        console.error('Error fetching rankings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trader rankings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router; 