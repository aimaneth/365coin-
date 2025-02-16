import mongoose from 'mongoose';
import { User } from '../api/models/User.js';
import { Trade } from '../api/models/Trade.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/365-coin';

async function checkDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get collection names
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nAvailable collections:', collections.map(c => c.name));

        // Count documents
        const userCount = await User.countDocuments();
        const tradeCount = await Trade.countDocuments();
        console.log('\nDocument counts:');
        console.log(`Users: ${userCount}`);
        console.log(`Trades: ${tradeCount}`);

        // Sample data
        if (userCount > 0) {
            const sampleUser = await User.findOne();
            console.log('\nSample user:', JSON.stringify(sampleUser, null, 2));
        }

        if (tradeCount > 0) {
            const sampleTrade = await Trade.findOne();
            console.log('\nSample trade:', JSON.stringify(sampleTrade, null, 2));
        }

        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
    }
}

checkDatabase(); 