const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    console.log('Using cached database connection');
    return cachedConnection;
  }

  try {
    console.log('Creating new database connection');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'exists' : 'missing');

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false
    });

    console.log('MongoDB Connected Successfully');
    cachedConnection = connection;
    return connection;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    throw new Error(`Database connection failed: ${err.message}`);
  }
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    console.log('Function started');
    console.log('Event:', {
      method: event.httpMethod,
      path: event.path,
      headers: event.headers
    });

    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    await connectDB();

    if (event.httpMethod === 'POST') {
      const { email, password, username } = JSON.parse(event.body);
      console.log('Processing signup for:', { email, username });

      if (!email || !password || !username) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            message: 'All fields are required' 
          })
        };
      }

      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
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
    console.error('Function error:', {
      message: error.message,
      stack: error.stack
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Server error',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}; 