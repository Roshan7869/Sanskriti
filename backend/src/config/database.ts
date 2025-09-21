import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongoServer: MongoMemoryServer;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourista';

export const connectDatabase = async (): Promise<void> => {
  try {
    let uri = MONGODB_URI;

    // Use in-memory server for tests or if specified by env var
    if (process.env.NODE_ENV === 'test' || process.env.USE_MEMORY_DB === 'true') {
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`🧠 Using in-memory MongoDB at ${uri}`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      console.log('🧠 In-memory MongoDB server stopped.');
    }
    console.log('📴 MongoDB Disconnected');
  } catch (error) {
    console.error('❌ Database disconnection error:', error);
  }
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});