const mongoose = require('mongoose');

// Fallback to cluster URI if environment variable is not set in cloud host
const DEFAULT_MONGO_URI =
  'mongodb+srv://kanagalarajesh88_db_user:VUWvKpM2MZYRTmXL@cluster0.vuesrzy.mongodb.net/college_event_management?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('MongoDB Connected Successfully');
    console.log(`Connected to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If Atlas IP access list is restricted, inform the user clearly
    if (
      error.message.includes('bad auth') ||
      error.message.includes('whitelist') ||
      error.message.includes('querySrv')
    ) {
      console.error(
        '\nNOTE: If connecting to MongoDB Atlas fails, ensure your IP address is whitelisted in MongoDB Atlas Network Access (or set to 0.0.0.0/0).'
      );
    }
    throw error;
  }
};

module.exports = connectDB;

