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
            return res.status(503).json({
                success: false,
                message: 'Database connection not ready',
                readyState: mongoose.connection.readyState
            });
        }

        // Aggregate trades to calculate total PnL and other stats for each trader
        const rankings = await Trade.aggregate([
            // Group trades by userId
            {
                $group: {
                    _id: '$userId',
                    totalPnL: { $sum: '$pnl' },
                    totalTrades: { $sum: 1 },
                    winningTrades: {
                        $sum: { $cond: [{ $gt: ['$pnl', 0] }, 1, 0] }
                    },
                    averagePnL: { $avg: '$pnl' },
                    totalVolume: {
                        $sum: { $multiply: ['$amount', '$price'] }
                    },
                    lastTrade: { $max: '$closedAt' }
                }
            },
            // Calculate win rate and other derived stats
            {
                $addFields: {
                    winRate: {
                        $multiply: [
                            { $divide: ['$winningTrades', '$totalTrades'] },
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
            // Unwind the user array
            { $unwind: '$user' },
            // Project final fields
            {
                $project: {
                    username: '$user.username',
                    walletAddress: { $arrayElemAt: ['$user.walletAddresses.address', 0] },
                    totalPnL: 1,
                    totalTrades: 1,
                    winRate: 1,
                    averagePnL: 1,
                    totalVolume: 1,
                    lastTrade: 1
                }
            },
            // Sort by total PnL descending
            { $sort: { totalPnL: -1 } }
        ]);

        // Format the response
        const formattedRankings = rankings.map((trader, index) => ({
            rank: index + 1,
            username: trader.username,
            walletAddress: trader.walletAddress,
            stats: {
                totalPnL: parseFloat(trader.totalPnL.toFixed(2)),
                totalTrades: trader.totalTrades,
                winRate: parseFloat(trader.winRate.toFixed(2)),
                averagePnL: parseFloat(trader.averagePnL.toFixed(2)),
                totalVolume: parseFloat(trader.totalVolume.toFixed(2)),
                lastActive: trader.lastTrade
            }
        }));

        // Send response
        res.json({
            success: true,
            rankings: formattedRankings
        });
    } catch (error) {
        console.error('Error fetching rankings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trader rankings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router; 