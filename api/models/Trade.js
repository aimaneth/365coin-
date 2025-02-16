import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    entryPrice: {
        type: Number,
        required: true
    },
    exitPrice: {
        type: Number
    },
    pnl: {
        type: Number,
        default: 0,
        index: true
    },
    pnlPercentage: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    openedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    closedAt: {
        type: Date,
        index: true
    },
    network: {
        type: String,
        default: 'BSC'
    },
    walletAddress: {
        type: String,
        required: true,
        index: true
    }
}, {
    collection: 'trades',
    timestamps: true
});

// Add compound index for userId and pnl for faster aggregation
tradeSchema.index({ userId: 1, pnl: -1 });

// Add method to calculate trade statistics
tradeSchema.statics.calculateStats = async function(userId) {
    const stats = await this.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$userId',
                totalPnL: { $sum: '$pnl' },
                totalTrades: { $sum: 1 },
                winningTrades: {
                    $sum: { $cond: [{ $gt: ['$pnl', 0] }, 1, 0] }
                },
                totalVolume: {
                    $sum: { $multiply: ['$amount', '$price'] }
                }
            }
        }
    ]);
    return stats[0] || null;
};

// Add pre-save middleware to ensure proper ObjectId conversion
tradeSchema.pre('save', function(next) {
    if (this.userId && typeof this.userId === 'string') {
        this.userId = new mongoose.Types.ObjectId(this.userId);
    }
    next();
});

export const Trade = mongoose.model('Trade', tradeSchema);
export default Trade; 