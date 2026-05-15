import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import logger from '../shared/utils/logger';

dotenv.config();

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  logger.info('✅ Cloudinary configured successfully');
} else {
  logger.warn('⚠️ Cloudinary keys missing. Image uploads will not work.');
}


export default cloudinary;
