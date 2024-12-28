const crypto = require('crypto');

const generateSecret = () => {
  // Generate a random 64-character hex string
  const secret = crypto.randomBytes(32).toString('hex');
  console.log('\x1b[32m%s\x1b[0m', 'Generated JWT Secret:');
  console.log('\x1b[33m%s\x1b[0m', secret);
  console.log('\n\x1b[32m%s\x1b[0m', 'Add this to your .env file as:');
  console.log('\x1b[36m%s\x1b[0m', `JWT_SECRET=${secret}`);
};

generateSecret(); 