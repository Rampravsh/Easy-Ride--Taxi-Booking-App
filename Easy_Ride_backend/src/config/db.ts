import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../shared/utils/logger';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/easy-ride';
    const conn = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;