const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('MongoDB Connected Successfully');
    console.log(`Connected to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If Atlas IP access list is restricted, inform the user clearly
    if (error.message.includes('bad auth') || error.message.includes('whitelist') || error.message.includes('querySrv')) {
      console.error('\nNOTE: If connecting to MongoDB Atlas fails, ensure your IP address is whitelisted in MongoDB Atlas Network Access (or set to 0.0.0.0/0).');
    }
  }
};

module.exports = connectDB;
