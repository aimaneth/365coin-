import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        default: 0
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
        default: Date.now
    },
    closedAt: {
        type: Date
    },
    network: {
        type: String,
        default: 'BSC'
    },
    walletAddress: {
        type: String,
        required: true
    }
});

export const Trade = mongoose.model('Trade', tradeSchema);
export default Trade; 