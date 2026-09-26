const mongoose = require('mongoose');

// Fallback to cluster URI if environment variable is not set or invalid in cloud host
const DEFAULT_MONGO_URI =
  'mongodb+srv://kanagalarajesh88_db_user:VUWvKpM2MZYRTmXL@cluster0.vuesrzy.mongodb.net/college_event_management?retryWrites=true&w=majority&appName=Cluster0';

const isInvalidUri = (uri) => {
  if (!uri || typeof uri !== 'string') return true;
  const s = uri.trim();
  return (
    s === '' ||
    s.includes('<password>') ||
    s.includes('<username>') ||
    s.includes('your_mongodb_uri') ||
    !s.startsWith('mongodb')
  );
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const envUri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : null;
  const primaryUri = !isInvalidUri(envUri) ? envUri : DEFAULT_MONGO_URI;

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected Successfully');
    console.log(`Connected to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Primary Connection Error: ${error.message}`);

    // If the primary URI failed (e.g. bad auth in Render dashboard or invalid credentials)
    // and it was different from our verified DEFAULT_MONGO_URI, immediately fallback to DEFAULT_MONGO_URI!
    if (primaryUri !== DEFAULT_MONGO_URI) {
      console.log('Falling back to default verified MongoDB Atlas cluster URI...');
      try {
        const fallbackConn = await mongoose.connect(DEFAULT_MONGO_URI, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB Connected Successfully via Fallback Cluster URI!');
        console.log(`Connected to host: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`Fallback MongoDB Connection Error: ${fallbackError.message}`);
        throw fallbackError;
      }
    }

    throw error;
  }
};

module.exports = connectDB;

