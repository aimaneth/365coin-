import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const walletAddressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    network: {
        type: String,
        required: true,
        default: 'BSC'
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    walletAddresses: [walletAddressSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    try {
        console.log('Pre-save middleware triggered for user:', this._id || 'new user');
        if (this.isModified('password')) {
            console.log('Password modified, hashing...');
            this.password = await bcrypt.hash(this.password, 10);
            console.log('Password hashed successfully');
        }
        next();
    } catch (error) {
        console.error('Error in pre-save middleware:', error);
        next(error);
    }
});

// Generate auth token
userSchema.methods.generateAuthToken = function() {
    try {
        console.log('Generating auth token for user:', this._id);
        const token = jwt.sign(
            { userId: this._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Auth token generated successfully');
        return token;
    } catch (error) {
        console.error('Error generating auth token:', error);
        throw error;
    }
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
    console.log('Converting user to JSON:', this._id);
    const user = this.toObject();
    delete user.password;
    return user;
};

export const User = mongoose.model('User', userSchema);
export default User; 