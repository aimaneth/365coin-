import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../api/models/User.js';
import { Trade } from '../api/models/Trade.js';

dotenv.config();

// Trading pairs for generating random trades
const tradingPairs = [
    { symbol: 'BTC/USDT', minPrice: 40000, maxPrice: 50000 },
    { symbol: 'ETH/USDT', minPrice: 2000, maxPrice: 3000 },
    { symbol: 'BNB/USDT', minPrice: 200, maxPrice: 300 },
    { symbol: '365/USDT', minPrice: 0.1, maxPrice: 0.5 },
    { symbol: 'DOGE/USDT', minPrice: 0.05, maxPrice: 0.15 }
];

const traders = [
    {
        username: "cryptomaster",
        email: "cryptomaster@example.com",
        password: "Trader123!",
        walletAddresses: [
            {
                address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                network: "BSC",
                dateAdded: new Date('2024-01-15')
            }
        ],
        tradeCount: 50,
        successRate: 0.75
    },
    {
        username: "tradingpro",
        email: "tradingpro@example.com",
        password: "Trader123!",
        walletAddresses: [
            {
                address: "0x9B8149DbF37dF6e4Fb8C84354a8738Fb7856A1Bb",
                network: "BSC",
                dateAdded: new Date('2024-01-20')
            }
        ],
        tradeCount: 35,
        successRate: 0.82
    },
    {
        username: "coinwhisperer",
        email: "coinwhisperer@example.com",
        password: "Trader123!",
        walletAddresses: [
            {
                address: "0x1F4e7Db6C7B191C3d2714E5234Fad306dB6dC1Aa",
                network: "BSC",
                dateAdded: new Date('2024-02-01')
            }
        ],
        tradeCount: 65,
        successRate: 0.68
    },
    {
        username: "hodlmaster",
        email: "hodlmaster@example.com",
        password: "Trader123!",
        walletAddresses: [
            {
                address: "0x8F7Db6C7B191C3d2714E5234Fad306dB6dC1Bb9",
                network: "BSC",
                dateAdded: new Date('2024-02-05')
            }
        ],
        tradeCount: 25,
        successRate: 0.90
    },
    {
        username: "cryptowarrior",
        email: "cryptowarrior@example.com",
        password: "Trader123!",
        walletAddresses: [
            {
                address: "0x3E7Db6C7B191C3d2714E5234Fad306dB6dC1Cc8",
                network: "BSC",
                dateAdded: new Date('2024-02-10')
            }
        ],
        tradeCount: 45,
        successRate: 0.72
    },
    {
        username: "bitmaster",
        email: "bitmaster@example.com",
        password: "Trader123!",
        walletAddresses: [
            {
                address: "0x4A7Db6C7B191C3d2714E5234Fad306dB6dC1Dd7",
                network: "BSC",
                dateAdded: new Date('2024-02-12')
            }
        ],
        tradeCount: 55,
        successRate: 0.78
    },
    {
        username: "cryptoqueen",
        email: "cryptoqueen@example.com",
        password: "Trader123!",
        walletAddresses: [
            {
                address: "0x5B7Db6C7B191C3d2714E5234Fad306dB6dC1Ee6",
                network: "BSC",
                dateAdded: new Date('2024-02-15')
            }
        ],
        tradeCount: 40,
        successRate: 0.85
    }
];

// Helper function to generate random number between min and max
const random = (min, max) => Math.random() * (max - min) + min;

// Helper function to generate random trade
const generateTrade = (userId, walletAddress, successRate, date) => {
    const pair = tradingPairs[Math.floor(Math.random() * tradingPairs.length)];
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const entryPrice = random(pair.minPrice, pair.maxPrice);
    const amount = random(0.1, 10);
    
    // Calculate exit price based on success rate
    const priceChange = random(0.01, 0.15);
    const successful = Math.random() < successRate;
    const exitPrice = successful ? 
        (type === 'buy' ? entryPrice * (1 + priceChange) : entryPrice * (1 - priceChange)) :
        (type === 'buy' ? entryPrice * (1 - priceChange) : entryPrice * (1 + priceChange));

    const pnl = type === 'buy' ? 
        (exitPrice - entryPrice) * amount :
        (entryPrice - exitPrice) * amount;

    const pnlPercentage = (pnl / (entryPrice * amount)) * 100;

    return {
        userId,
        type,
        symbol: pair.symbol,
        amount,
        price: entryPrice,
        entryPrice,
        exitPrice,
        pnl,
        pnlPercentage,
        status: 'closed',
        openedAt: date,
        closedAt: new Date(date.getTime() + random(1, 24) * 60 * 60 * 1000),
        network: 'BSC',
        walletAddress
    };
};

const seedTraders = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({
            email: { $in: traders.map(trader => trader.email) }
        });
        await Trade.deleteMany({});
        console.log('Cleared existing data');

        // Create traders and their trades
        for (const trader of traders) {
            // Create trader
            const hashedPassword = await bcrypt.hash(trader.password, 10);
            const newTrader = await User.create({
                ...trader,
                password: hashedPassword
            });

            // Generate trades
            const trades = [];
            const startDate = trader.walletAddresses[0].dateAdded;
            const endDate = new Date();
            
            for (let i = 0; i < trader.tradeCount; i++) {
                const tradeDate = new Date(
                    startDate.getTime() + random(0, endDate.getTime() - startDate.getTime())
                );
                
                trades.push(generateTrade(
                    newTrader._id,
                    trader.walletAddresses[0].address,
                    trader.successRate,
                    tradeDate
                ));
            }

            // Insert trades
            await Trade.insertMany(trades);
            console.log(`Created ${trades.length} trades for ${trader.username}`);
        }

        console.log('Traders and trades seeded successfully');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

// Run the seeding
seedTraders(); 