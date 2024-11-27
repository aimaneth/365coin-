const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Add CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000
    });
    
    cachedDb = db;
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('Function invoked with event:', { 
    method: event.httpMethod,
    path: event.path,
    body: event.body 
  });

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    if (event.httpMethod === 'POST') {
      const { email, password, username } = JSON.parse(event.body);
      console.log('Received signup request for:', { email, username });

      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
        console.log('User already exists:', { email, username });
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            message: existingUser.email === email ? 
              'Email already registered' : 
              'Username already taken' 
          })
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ 
        username, 
        email, 
        password: hashedPassword 
      });
      
      console.log('Saving new user...');
      await user.save();
      console.log('User saved successfully');

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email
          }
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Server error', 
        error: error.message,
        stack: error.stack 
      })
    };
  }
}; 